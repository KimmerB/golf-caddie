import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Skeleton } from '../components/Skeleton';
import { RoundCard } from '../components/RoundCard';
import { RoundSetupDialog } from '../components/RoundSetupDialog';
import { useAsyncData } from '../hooks/useAsyncData';
import { getRecentRounds } from '../services/api';
import { useRoundStore } from '../store/roundStore';
import { useToast } from '../components/ToastProvider';

export const HomePage = () => {
  const navigate = useNavigate();
  const { push } = useToast();
  const [showSetup, setShowSetup] = useState(false);
  const currentRoundId = useRoundStore((state) => state.currentRoundId);
  const { status, data: rounds } = useAsyncData(getRecentRounds, []);

  const handleContinueRound = () => {
    if (!currentRoundId) {
      push({ message: 'No active round yet. Start one to begin scoring.' });
      return;
    }
    navigate(`/round/${currentRoundId}`);
  };

  return (
    <div className="flex flex-col gap-8">
      <section className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-4">
          <h2 className="font-serif text-3xl font-semibold text-charcoal">On-course control</h2>
          <p className="text-sm text-slate-500">
            Begin a fresh round with luxury-speed inputs and auto-save precision.
          </p>
          <Button onClick={() => setShowSetup(true)}>Start round</Button>
        </Card>
        <Card className="flex flex-col gap-4">
          <h2 className="font-serif text-3xl font-semibold text-charcoal">Pick up where you left</h2>
          <p className="text-sm text-slate-500">Hop straight back into the hole you paused on.</p>
          <Button variant="ghost" onClick={handleContinueRound}>
            Continue round
          </Button>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <Card className="flex flex-col gap-4" surface="muted">
          <h3 className="font-serif text-2xl font-semibold text-charcoal">Manage your clubs</h3>
          <p className="text-sm text-slate-500">
            Refine your bag with claimed distances. GPS calibration arrives soon.
          </p>
          <Button variant="ghost" onClick={() => navigate('/clubs')}>
            Manage clubs
          </Button>
        </Card>
        <Card className="flex flex-col gap-4">
          <h3 className="font-serif text-2xl font-semibold text-charcoal">Recent rounds</h3>
          {status === 'loading' && <Skeleton className="h-12 w-32" />}
          {status === 'success' && rounds && rounds.length === 0 && (
            <p className="text-sm text-slate-500">No rounds yet. The first tee awaits.</p>
          )}
          {status === 'success' && rounds && rounds.length > 0 && (
            <div className="flex flex-col gap-3">
              {rounds.slice(0, 4).map((round) => (
                <RoundCard key={round.id} round={round} />
              ))}
            </div>
          )}
        </Card>
      </section>
      {showSetup && <RoundSetupDialog onClose={() => setShowSetup(false)} />}
    </div>
  );
};
