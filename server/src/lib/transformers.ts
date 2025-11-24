import { HoleRow, RoundRow, ClubRow } from '../types';

export const mapClub = (row: ClubRow) => ({
  id: row.id,
  name: row.name,
  claimedDistance: row.claimed_distance ?? null,
  createdAt: row.created_at
});

export const mapHole = (row: HoleRow) => ({
  id: row.id,
  holeNumber: row.hole_number,
  strokes: row.strokes ?? null,
  putts: row.putts ?? null,
  fir: row.fir === null || row.fir === undefined ? null : Boolean(row.fir),
  gir: row.gir === null || row.gir === undefined ? null : Boolean(row.gir),
  inPlay: row.in_play === null || row.in_play === undefined ? null : Boolean(row.in_play),
  updatedAt: row.updated_at
});

export const mapRound = (row: RoundRow) => ({
  id: row.id,
  startedAt: row.started_at,
  courseName: row.course_name,
  courseRating: row.course_rating,
  slope: row.slope,
  differential: row.differential ?? null
});
