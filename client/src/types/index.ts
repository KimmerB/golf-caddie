export type Club = {
  id: number;
  name: string;
  claimedDistance: number;
  createdAt: string;
};

export type Hole = {
  id: number;
  holeNumber: number;
  strokes: number | null;
  putts: number | null;
  fir: boolean | null;
  gir: boolean | null;
  inPlay: boolean | null;
  updatedAt: string;
};

export type Round = {
  id: number;
  startedAt: string;
  courseName: string | null;
  courseRating: number | null;
  slope: number | null;
  holes: Hole[];
  differential: number | null;
};

export type RoundSummary = {
  gross: number;
  putts: number;
  firPercentage: number;
  girPercentage: number;
  inPlayPercentage: number;
  differential: number | null;
};

export type CreateRoundPayload = {
  courseName: string;
  courseRating: number;
  slope: number;
};

export type UpdateHolePayload = {
  strokes: number | null;
  putts: number | null;
  fir: boolean | null;
  gir: boolean | null;
  inPlay: boolean | null;
};
