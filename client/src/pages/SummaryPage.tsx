import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../components/ToastProvider';
import { getRound, getSummary } from '../services/api';
import { Round, RoundSummary } from '../types';
import { formatPercentage } from '../utils/format';

const SummaryStat = ({ label, value }: { label: string; value: string }) => (
  <Card className="flex flex-col gap-2 text-center" surface="muted">
    <span className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">{label}</span>
    <span className="font-serif text-4xl font-semibold text-charcoal">{value}</span>
  </Card>
);

export const SummaryPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const { push } = useToast();
  const roundId = Number(params.roundId);
  const [round, setRound] = useState<Round | null>(null);
  const [summary, setSummary] = useState<RoundSummary | null>(null);

  useEffect(() => {
    if (!Number.isFinite(roundId)) {
      navigate('/');
      return;
    }
    Promise.all([getRound(roundId), getSummary(roundId)])
      .then(([roundData, summaryData]) => {
        setRound(roundData);
        setSummary(summaryData);
      })
      .catch(() => {
        push({ message: 'Unable to load summary' });
        navigate('/');
      });
  }, [navigate, roundId, push]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Round summary</p>
          <h1 className="font-serif text-4xl font-semibold text-charcoal">{round?.courseName ?? 'Untitled course'}</h1>
        </div>
        <Button onClick={() => navigate('/')}>Finish round</Button>
      </div>

      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryStat label="Gross" value={summary.gross.toString()} />
          <SummaryStat label="Putts" value={summary.putts.toString()} />
          <SummaryStat label="FIR" value={formatPercentage(summary.firPercentage)} />
          <SummaryStat label="GIR" value={formatPercentage(summary.girPercentage)} />
          <SummaryStat label="In Play" value={formatPercentage(summary.inPlayPercentage)} />
          <SummaryStat
            label="Differential"
            value={summary.differential !== null ? summary.differential.toFixed(1) : '—'}
          />
        </div>
      )}

      {round && (
        <Card className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl font-semibold text-charcoal">Hole detail</h2>
          <div className="grid gap-2 md:grid-cols-2">
            {round.holes.map((hole) => (
              <div
                key={hole.id}
                className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
              >
                <span className="text-sm font-medium text-slate-600">Hole {hole.holeNumber}</span>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>Strokes {hole.strokes ?? '—'}</span>
                  <span>Putts {hole.putts ?? '—'}</span>
                  <span>FIR {hole.fir ? '✓' : '—'}</span>
                  <span>GIR {hole.gir ? '✓' : '—'}</span>
                  <span>In-play {hole.inPlay ? '✓' : '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
