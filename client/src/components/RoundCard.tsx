import { Link } from 'react-router-dom';
import { Card } from './Card';
import { Round } from '../types';
import { formatDate } from '../utils/format';

export const RoundCard = ({ round }: { round: Round }) => (
  <Card className="flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="font-serif text-xl font-semibold text-charcoal">{round.courseName ?? 'Untitled course'}</h3>
        <p className="text-sm text-slate-500">{formatDate(round.startedAt)}</p>
      </div>
      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.3em] text-primary">
        {round.differential !== null ? round.differential.toFixed(1) : '—'}
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
      <span>CR {round.courseRating ?? '—'}</span>
      <span>SS {round.slope ?? '—'}</span>
      <span>{round.holes.filter((hole) => hole.strokes !== null).length}/18 played</span>
    </div>
    <div className="flex gap-2">
      <Link
        to={`/round/${round.id}`}
        className="text-sm font-medium text-primary transition hover:text-emerald-600"
      >
        Continue round
      </Link>
      <Link
        to={`/summary/${round.id}`}
        className="text-sm font-medium text-slate-500 transition hover:text-primary"
      >
        Summary
      </Link>
    </div>
  </Card>
);
