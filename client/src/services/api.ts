import {
  Club,
  CreateRoundPayload,
  Round,
  RoundSummary,
  UpdateHolePayload
} from '../types';

const handle = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message ?? 'Request failed');
  }
  return response.json();
};

export const getClubs = async (): Promise<Club[]> => {
  const res = await fetch('/api/clubs');
  return handle<Club[]>(res);
};

export const createClub = async (payload: { name: string; claimedDistance: number }) => {
  const res = await fetch('/api/clubs', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle<Club>(res);
};

export const updateClub = async (id: number, payload: { name: string; claimedDistance: number }) => {
  const res = await fetch(`/api/clubs/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle<Club>(res);
};

export const deleteClub = async (id: number) => {
  const res = await fetch(`/api/clubs/${id}`, { method: 'DELETE' });
  return handle<{ success: boolean }>(res);
};

export const createRound = async (payload: CreateRoundPayload) => {
  const res = await fetch('/api/rounds', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle<Round>(res);
};

export const getRound = async (roundId: number) => {
  const res = await fetch(`/api/rounds/${roundId}`);
  return handle<Round>(res);
};

export const getRecentRounds = async () => {
  const res = await fetch('/api/rounds');
  return handle<Round[]>(res);
};

export const updateHole = async (roundId: number, holeNumber: number, payload: UpdateHolePayload) => {
  const res = await fetch(`/api/rounds/${roundId}/hole/${holeNumber}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return handle<Round>(res);
};

export const getSummary = async (roundId: number) => {
  const res = await fetch(`/api/rounds/${roundId}/summary`);
  return handle<RoundSummary>(res);
};
