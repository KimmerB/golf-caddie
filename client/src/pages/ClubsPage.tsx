import { useEffect, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../components/ToastProvider';
import { Club } from '../types';
import { createClub, deleteClub, getClubs, updateClub } from '../services/api';

const EmptyState = () => (
  <Card className="flex flex-col items-start gap-4 text-left" surface="muted">
    <h2 className="font-serif text-2xl font-semibold text-charcoal">No clubs yet</h2>
    <p className="text-sm text-slate-500">Add your bag with the distances you trust most.</p>
  </Card>
);

type ClubModalProps = {
  club?: Club | null;
  onClose: () => void;
  onSaved: (club: Club) => void;
};

const ClubModal = ({ club, onClose, onSaved }: ClubModalProps) => {
  const isEditing = Boolean(club);
  const { push } = useToast();
  const [name, setName] = useState(club?.name ?? '');
  const [distance, setDistance] = useState(club?.claimedDistance.toString() ?? '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) {
      push({ message: 'Name is required' });
      return;
    }
    const claimedDistance = Number(distance);
    if (!claimedDistance) {
      push({ message: 'Add a distance' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = { name: name.trim(), claimedDistance };
      const saved = isEditing && club ? await updateClub(club.id, payload) : await createClub(payload);
      onSaved(saved);
      push({ message: isEditing ? 'Club updated' : 'Club added', tone: 'success' });
      onClose();
    } catch (error) {
      push({ message: error instanceof Error ? error.message : 'Unable to save club' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-subtle">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-semibold text-charcoal">
            {isEditing ? 'Edit club' : 'Add club'}
          </h2>
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
            Club name
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-inner focus:border-primary"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="7 Iron"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-500">
            Claimed distance (m)
            <input
              className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-inner focus:border-primary"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
              inputMode="numeric"
            />
          </label>
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Saving…' : isEditing ? 'Update club' : 'Add club'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export const ClubsPage = () => {
  const { push } = useToast();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeClub, setActiveClub] = useState<Club | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getClubs()
      .then((data) => setClubs(data))
      .catch(() => push({ message: 'Unable to load clubs' }))
      .finally(() => setLoading(false));
  }, [push]);

  const handleDelete = async (clubId: number) => {
    if (!confirm('Remove this club?')) return;
    try {
      await deleteClub(clubId);
      setClubs((prev) => prev.filter((club) => club.id !== clubId));
      push({ message: 'Club deleted', tone: 'success' });
    } catch (error) {
      push({ message: error instanceof Error ? error.message : 'Unable to delete club' });
    }
  };

  const handleSaved = (club: Club) => {
    setClubs((prev) => {
      const exists = prev.some((item) => item.id === club.id);
      if (exists) {
        return prev.map((item) => (item.id === club.id ? club : item));
      }
      return [club, ...prev];
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Your bag</p>
          <h1 className="font-serif text-4xl font-semibold text-charcoal">Club management</h1>
        </div>
        <Button onClick={() => { setActiveClub(null); setShowModal(true); }}>Add club</Button>
      </div>

      {loading && <EmptyState />}
      {!loading && clubs.length === 0 && <EmptyState />}
      {!loading && clubs.length > 0 && (
        <div className="flex flex-col gap-3">
          {clubs.map((club) => (
            <Card key={club.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-medium text-charcoal">{club.name}</p>
                <p className="text-sm text-slate-500">{club.claimedDistance} m</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setActiveClub(club);
                    setShowModal(true);
                  }}
                >
                  Edit
                </Button>
                <Button variant="ghost" onClick={() => handleDelete(club.id)}>
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showModal && (
        <ClubModal
          club={activeClub}
          onClose={() => setShowModal(false)}
          onSaved={(club) => {
            handleSaved(club);
          }}
        />
      )}
    </div>
  );
};
