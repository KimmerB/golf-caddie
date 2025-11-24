import { db } from '../lib/db';
import { mapHole, mapRound } from '../lib/transformers';
import { HolePayload, HoleRow, RoundRow } from '../types';

type CreateRoundPayload = {
  courseName: string;
  courseRating: number;
  slope: number;
};

type Summary = {
  gross: number;
  putts: number;
  firPercentage: number;
  girPercentage: number;
  inPlayPercentage: number;
  differential: number | null;
};

const createEmptyHoles = (roundId: number) => {
  const insert = db.prepare(
    `INSERT INTO holes (round_id, hole_number, strokes, putts, fir, gir, in_play) VALUES (@round_id, @hole_number, NULL, NULL, NULL, NULL, NULL)`
  );
  const transaction = db.transaction(() => {
    for (let holeNumber = 1; holeNumber <= 18; holeNumber += 1) {
      insert.run({ round_id: roundId, hole_number: holeNumber });
    }
  });
  transaction();
};

export const createRound = (payload: CreateRoundPayload) => {
  const stmt = db.prepare(
    `INSERT INTO rounds (course_name, course_rating, slope) VALUES (@course_name, @course_rating, @slope)`
  );
  const result = stmt.run({
    course_name: payload.courseName,
    course_rating: payload.courseRating,
    slope: payload.slope
  });
  createEmptyHoles(Number(result.lastInsertRowid));
  return getRound(Number(result.lastInsertRowid));
};

export const getRounds = () => {
  const rounds = db.prepare('SELECT * FROM rounds ORDER BY started_at DESC').all() as RoundRow[];
  return rounds.map((round) => {
    const holes = db
      .prepare('SELECT * FROM holes WHERE round_id = ? ORDER BY hole_number ASC')
      .all(round.id) as HoleRow[];
    return {
      ...mapRound(round),
      holes: holes.map(mapHole)
    };
  });
};

export const getRound = (roundId: number) => {
  const round = db.prepare('SELECT * FROM rounds WHERE id = ?').get(roundId) as RoundRow | undefined;
  if (!round) return null;
  const holes = db
    .prepare('SELECT * FROM holes WHERE round_id = ? ORDER BY hole_number ASC')
    .all(roundId) as HoleRow[];
  return {
    ...mapRound(round),
    holes: holes.map(mapHole)
  };
};

export const updateHole = (roundId: number, holeNumber: number, payload: HolePayload) => {
  const stmt = db.prepare(
    `UPDATE holes
     SET strokes = @strokes,
         putts = @putts,
         fir = @fir,
         gir = @gir,
         in_play = @in_play,
         updated_at = CURRENT_TIMESTAMP
     WHERE round_id = @round_id AND hole_number = @hole_number`
  );
  stmt.run({
    strokes: payload.strokes,
    putts: payload.putts,
    fir: payload.fir === null ? null : payload.fir ? 1 : 0,
    gir: payload.gir === null ? null : payload.gir ? 1 : 0,
    in_play: payload.inPlay === null ? null : payload.inPlay ? 1 : 0,
    round_id: roundId,
    hole_number: holeNumber
  });
  return getRound(roundId);
};

const calculatePercentage = (values: (number | null)[]) => {
  const active = values.filter((value) => value !== null);
  if (active.length === 0) return 0;
  const successes = active.filter((value) => value === 1).length;
  return (successes / active.length) * 100;
};

const calculateDifferential = (gross: number, courseRating: number | null, slope: number | null) => {
  if (!courseRating || !slope || slope === 0) return null;
  const differential = ((gross - courseRating) * 113) / slope;
  return Number(differential.toFixed(1));
};

export const getRoundSummary = (roundId: number): Summary | null => {
  const round = db.prepare('SELECT * FROM rounds WHERE id = ?').get(roundId) as RoundRow | undefined;
  if (!round) return null;
  const holes = db
    .prepare('SELECT * FROM holes WHERE round_id = ? ORDER BY hole_number ASC')
    .all(roundId) as HoleRow[];

  const gross = holes.reduce((total, hole) => total + (hole.strokes ?? 0), 0);
  const putts = holes.reduce((total, hole) => total + (hole.putts ?? 0), 0);
  const firPercentage = calculatePercentage(holes.map((hole) => hole.fir));
  const girPercentage = calculatePercentage(holes.map((hole) => hole.gir));
  const inPlayPercentage = calculatePercentage(holes.map((hole) => hole.in_play));

  const differential = calculateDifferential(gross, round.course_rating, round.slope);
  if (differential !== null) {
    db.prepare('UPDATE rounds SET differential = ? WHERE id = ?').run(differential, roundId);
  }

  return {
    gross,
    putts,
    firPercentage,
    girPercentage,
    inPlayPercentage,
    differential
  };
};
