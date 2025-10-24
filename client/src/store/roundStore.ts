import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Round, Hole, UpdateHolePayload } from '../types';

type RoundState = {
  currentRoundId: number | null;
  round: Round | null;
  selectedHole: number;
  isSaving: boolean;
  setCurrentRoundId: (id: number | null) => void;
  setRound: (round: Round | null) => void;
  setSelectedHole: (hole: number) => void;
  updateHoleLocal: (holeNumber: number, payload: UpdateHolePayload) => void;
  setSaving: (saving: boolean) => void;
};

const updateHoleValues = (hole: Hole, payload: UpdateHolePayload): Hole => ({
  ...hole,
  strokes: payload.strokes ?? null,
  putts: payload.putts ?? null,
  fir: payload.fir ?? null,
  gir: payload.gir ?? null,
  inPlay: payload.inPlay ?? null,
  updatedAt: new Date().toISOString()
});

export const useRoundStore = create<RoundState>()(
  persist(
    (set, get) => ({
      currentRoundId: null,
      round: null,
      selectedHole: 1,
      isSaving: false,
      setCurrentRoundId: (id) => set({ currentRoundId: id }),
      setRound: (round) => set({ round }),
      setSelectedHole: (hole) => set({ selectedHole: hole }),
      updateHoleLocal: (holeNumber, payload) => {
        const { round } = get();
        if (!round) return;
        const updated = round.holes.map((hole) =>
          hole.holeNumber === holeNumber ? updateHoleValues(hole, payload) : hole
        );
        set({
          round: {
            ...round,
            holes: updated
          }
        });
      },
      setSaving: (saving) => set({ isSaving: saving })
    }),
    {
      name: 'round-state',
      partialize: (state) => ({ currentRoundId: state.currentRoundId })
    }
  )
);
