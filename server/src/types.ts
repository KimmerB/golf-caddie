export type ClubRow = {
  id: number;
  name: string;
  claimed_distance: number;
  created_at: string;
};

export type RoundRow = {
  id: number;
  started_at: string;
  course_name: string | null;
  course_rating: number | null;
  slope: number | null;
  differential: number | null;
};

export type HoleRow = {
  id: number;
  round_id: number;
  hole_number: number;
  strokes: number | null;
  putts: number | null;
  fir: number | null;
  gir: number | null;
  in_play: number | null;
  updated_at: string;
};

export type HolePayload = {
  strokes: number | null;
  putts: number | null;
  fir: boolean | null;
  gir: boolean | null;
  inPlay: boolean | null;
};
