import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { NumberStepper } from '../components/NumberStepper';
import { ToggleChip } from '../components/ToggleChip';
import { BottomActionBar } from '../components/BottomActionBar';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useRoundStore } from '../store/roundStore';
import { getRound, updateHole } from '../services/api';
import { useToast } from '../components/ToastProvider';

export const RoundPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const roundId = Number(params.roundId);
  const {
    setCurrentRoundId,
    setRound,
    round,
    selectedHole,
    setSelectedHole,
    updateHoleLocal,
    setSaving
  } = useRoundStore((state) => ({
    setCurrentRoundId: state.setCurrentRoundId,
    setRound: state.setRound,
    round: state.round,
    selectedHole: state.selectedHole,
    setSelectedHole: state.setSelectedHole,
    updateHoleLocal: state.updateHoleLocal,
    setSaving: state.setSaving
  }));

  useEffect(() => {
    if (!Number.isFinite(roundId)) {
      navigate('/');
      return;
    }
    setCurrentRoundId(roundId);
    getRound(roundId)
      .then((data) => {
        setRound(data);
        setSelectedHole(data.holes[0]?.holeNumber ?? 1);
      })
      .catch(() => navigate('/'));
  }, [navigate, roundId, setCurrentRoundId, setRound, setSelectedHole]);

  const hole = useMemo(
    () => round?.holes.find((item) => item.holeNumber === selectedHole) ?? null,
    [round, selectedHole]
  );

  const persistHole = async (payload?: {
    strokes: number | null;
    putts: number | null;
    fir: boolean | null;
    gir: boolean | null;
    inPlay: boolean | null;
  }) => {
    if (!round || !hole) return;
    const data =
      payload ?? {
        strokes: hole.strokes ?? null,
        putts: hole.putts ?? null,
        fir: hole.fir ?? null,
        gir: hole.gir ?? null,
        inPlay: hole.inPlay ?? null
      };
    setSaving(true);
    try {
      const updated = await updateHole(round.id, hole.holeNumber, data);
      setRound(updated);
      push({ message: 'Saved', tone: 'success' });
    } catch (error) {
      push({ message: error instanceof Error ? error.message : 'Auto-save failed' });
    } finally {
      setSaving(false);
    }
  };

  const applyChange = async (changes: Partial<{ strokes: number | null; putts: number | null; fir: boolean | null; gir: boolean | null; inPlay: boolean | null }>) => {
    if (!round || !hole) return;
    const payload = {
      strokes: Object.prototype.hasOwnProperty.call(changes, 'strokes') ? changes.strokes ?? null : hole.strokes ?? null,
      putts: Object.prototype.hasOwnProperty.call(changes, 'putts') ? changes.putts ?? null : hole.putts ?? null,
      fir: Object.prototype.hasOwnProperty.call(changes, 'fir') ? changes.fir ?? null : hole.fir ?? null,
      gir: Object.prototype.hasOwnProperty.call(changes, 'gir') ? changes.gir ?? null : hole.gir ?? null,
      inPlay: Object.prototype.hasOwnProperty.call(changes, 'inPlay') ? changes.inPlay ?? null : hole.inPlay ?? null
    };
    updateHoleLocal(hole.holeNumber, payload);
    await persistHole(payload);
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        setSelectedHole(Math.min(selectedHole + 1, 18));
      }
      if (event.key === 'ArrowLeft') {
        setSelectedHole(Math.max(selectedHole - 1, 1));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedHole, setSelectedHole]);

  const handlePrev = () => setSelectedHole(Math.max(1, selectedHole - 1));
  const handleNext = () => {
    if (selectedHole === 18) {
      navigate(`/summary/${round?.id ?? roundId}`);
      return;
    }
    setSelectedHole(Math.min(18, selectedHole + 1));
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Active hole</p>
          <h1 className="font-serif text-4xl font-semibold text-charcoal">Hole {selectedHole}</h1>
        </div>
        <div className="flex gap-1 overflow-x-auto rounded-full border border-slate-200 bg-fog/80 p-1">
          {Array.from({ length: 18 }).map((_, index) => {
            const number = index + 1;
            return (
              <button
                key={number}
                type="button"
                onClick={() => setSelectedHole(number)}
                className={`h-10 w-10 rounded-full text-sm font-semibold transition ${
                  selectedHole === number
                    ? 'bg-primary text-white shadow-subtle'
                    : 'bg-white text-slate-500 hover:text-primary'
                }`}
              >
                {number}
              </button>
            );
          })}
        </div>
      </div>

      {round && hole && (
        <Card className="flex flex-col gap-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <NumberStepper
              label="Strokes"
              value={hole.strokes ?? null}
              onChange={(value) => applyChange({ strokes: value })}
              min={1}
              max={15}
            />
            <NumberStepper
              label="Putts"
              value={hole.putts ?? null}
              onChange={(value) => applyChange({ putts: value })}
              min={0}
              max={10}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <ToggleChip label="FIR" active={hole.fir ?? null} onChange={(value) => applyChange({ fir: value })} />
            <ToggleChip label="GIR" active={hole.gir ?? null} onChange={(value) => applyChange({ gir: value })} />
            <ToggleChip
              label="In Play"
              active={hole.inPlay ?? null}
              onChange={(value) => applyChange({ inPlay: value })}
            />
          </div>
          <div className="flex flex-col gap-1 text-sm text-slate-500">
            <span>{round.courseName}</span>
            <span>
              Course rating {round.courseRating ?? '—'} · Slope {round.slope ?? '—'}
            </span>
          </div>
        </Card>
      )}

      <BottomActionBar>
        <Button variant="ghost" onClick={() => navigate('/')}>Back</Button>
        <div className="flex flex-1 justify-end gap-2">
          <Button variant="ghost" onClick={handlePrev} disabled={selectedHole === 1}>
            Prev hole
          </Button>
          <Button onClick={handleNext}>
            {selectedHole === 18 ? 'End round' : 'Next hole'}
          </Button>
        </div>
      </BottomActionBar>
    </div>
  );
};
