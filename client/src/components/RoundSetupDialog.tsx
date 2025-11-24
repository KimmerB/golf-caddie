import { FormEvent, useState } from 'react';
import { createRound } from '../services/api';
import { useRoundStore } from '../store/roundStore';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { useToast } from './ToastProvider';

export const RoundSetupDialog = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const { push } = useToast();
  const setCurrentRoundId = useRoundStore((state) => state.setCurrentRoundId);
  const [courseName, setCourseName] = useState('');
  const [courseRating, setCourseRating] = useState('72.0');
  const [slope, setSlope] = useState('113');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      setSubmitting(true);
      const round = await createRound({
        courseName: courseName.trim() || 'Untitled Course',
        courseRating: Number(courseRating) || 72,
        slope: Number(slope) || 113
      });
      setCurrentRoundId(round.id);
      push({ message: 'Round created. You’re on the tee.', tone: 'success' });
      onClose();
      navigate(`/round/${round.id}`);
    } catch (error) {
      push({ message: error instanceof Error ? error.message : 'Unable to create round' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-subtle">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-charcoal">Start a new round</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs uppercase tracking-[0.3em] text-slate-400 transition hover:text-primary"
          >
            Close
          </button>
        </div>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-500">
            Course name
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-inner focus:border-primary"
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              placeholder="Royal Greens"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-500">
            Course rating
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-inner focus:border-primary"
              value={courseRating}
              onChange={(event) => setCourseRating(event.target.value)}
              inputMode="decimal"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-500">
            Slope
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-inner focus:border-primary"
              value={slope}
              onChange={(event) => setSlope(event.target.value)}
              inputMode="numeric"
            />
          </label>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Preparing your round…' : 'Tee Off'}
          </Button>
        </form>
      </div>
    </div>
  );
};
