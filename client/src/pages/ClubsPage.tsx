import { useEffect, useMemo, useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../components/ToastProvider';
import { Club } from '../types';
import { createClub, deleteClub, getClubs, updateClub } from '../services/api';

type ClubType = 'driver' | 'wood' | 'hybrid' | 'iron' | 'wedge' | 'other';

const buildClubName = (type: ClubType, number: string) => {
  const safeNumber = number || '—';
  if (type === 'driver') return 'Driver';
  if (type === 'wood') return `Wood ${safeNumber}`;
  if (type === 'hybrid') return `Hybrid ${safeNumber}`;
  if (type === 'iron') return `Iron ${safeNumber}`;
  if (type === 'wedge') return `Wedge ${safeNumber}°`;
  return safeNumber;
};

const parseClubName = (name: string): { type: ClubType; number: string } => {
  if (name === 'Driver') return { type: 'driver', number: '' };
  const woodMatch = name.match(/^Wood\s+(\d+)/i);
  if (woodMatch) return { type: 'wood', number: woodMatch[1] };
  const hybridMatch = name.match(/^Hybrid\s+(\d+)/i);
  if (hybridMatch) return { type: 'hybrid', number: hybridMatch[1] };
  const ironMatch = name.match(/^Iron\s+(\d+)/i);
  if (ironMatch) return { type: 'iron', number: ironMatch[1] };
  const wedgeMatch = name.match(/^Wedge\s+(\d+)/i);
  if (wedgeMatch) return { type: 'wedge', number: wedgeMatch[1] };
  return { type: 'other', number: name };
};

const clubTypeOrder: ClubType[] = ['driver', 'wood', 'hybrid', 'iron', 'wedge', 'other'];

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
  const parsed = club ? parseClubName(club.name) : { type: 'driver', number: '' };
  const initialType = parsed.type === 'other' ? 'wood' : parsed.type;
  const initialNumber = parsed.type === 'other' ? '' : parsed.number;
  const [clubType, setClubType] = useState<ClubType>(initialType);
  const [clubNumber, setClubNumber] = useState(initialNumber);
  const [distance, setDistance] = useState(club?.claimedDistance?.toString() ?? '');
  const [submitting, setSubmitting] = useState(false);

  const clubName = useMemo(() => buildClubName(clubType, clubNumber), [clubNumber, clubType]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (clubType !== 'driver' && clubType !== 'other' && !clubNumber.trim()) {
      push({ message: 'Add the club number' });
      return;
    }
    const claimedDistance = Number(distance);
    if (!Number.isFinite(claimedDistance) || claimedDistance <= 0) {
      push({ message: 'Enter a distance greater than 0' });
      return;
    }

    try {
      setSubmitting(true);
      const payload = { name: clubName.trim(), claimedDistance };
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
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-500">
              Club type
              <select
                className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-inner focus:border-primary"
                value={clubType}
                onChange={(event) => setClubType(event.target.value as ClubType)}
              >
                <option value="driver">Driver</option>
                <option value="wood">Wood</option>
                <option value="hybrid">Hybrid</option>
                <option value="iron">Iron</option>
                <option value="wedge">Wedge</option>
              </select>
            </label>
            {clubType !== 'driver' && (
              <label className="flex flex-col gap-2 text-sm font-medium text-slate-500">
                {clubType === 'wedge' ? 'Wedge loft (°)' : 'Club number'}
                <input
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-base shadow-inner focus:border-primary"
                  value={clubNumber}
                  onChange={(event) => setClubNumber(event.target.value)}
                  placeholder={clubType === 'wedge' ? '56' : '3'}
                  inputMode="numeric"
                />
              </label>
            )}
          </div>
          <Card surface="muted" className="text-sm text-slate-500">
            <p className="font-medium text-charcoal">Preview</p>
            <p className="text-lg font-semibold text-primary">{clubName}</p>
          </Card>
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

  const grouped = useMemo(() => {
    const buckets: Record<ClubType, Club[]> = {
      driver: [],
      wood: [],
      hybrid: [],
      iron: [],
      wedge: [],
      other: []
    };

    clubs.forEach((club) => {
      const { type } = parseClubName(club.name);
      if (!buckets[type]) buckets.other.push(club);
      else buckets[type].push(club);
    });
    return buckets;
  }, [clubs]);

  const renderGroup = (type: ClubType, label: string) => {
    const list = grouped[type];
    if (!list || list.length === 0) return null;
    return (
      <div className="flex flex-col gap-2" key={type}>
        <div className="text-xs uppercase tracking-[0.3em] text-slate-400">{label}</div>
        <div className="flex flex-col gap-3">
          {list.map((club) => (
            <Card key={club.id} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-medium text-charcoal">{club.name}</p>
                <p className="text-sm text-slate-500">
                  {club.claimedDistance ? `${club.claimedDistance} m` : 'Add your distance'}
                </p>
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
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Your bag</p>
          <h1 className="font-serif text-4xl font-semibold text-charcoal">Club management</h1>
        </div>
        <Button
          onClick={() => {
            setActiveClub(null);
            setShowModal(true);
          }}
        >
          Add club
        </Button>
      </div>

      {loading && <EmptyState />}
      {!loading && clubs.length === 0 && <EmptyState />}
      {!loading && clubs.length > 0 && (
        <div className="flex flex-col gap-6">
          {clubTypeOrder.map((type) =>
            renderGroup(
              type,
              type === 'driver'
                ? 'Driver'
                : type === 'wood'
                ? 'Woods'
                : type === 'hybrid'
                ? 'Hybrids'
                : type === 'iron'
                ? 'Irons'
                : type === 'wedge'
                ? 'Wedges'
                : 'Other'
            )
          )}
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
