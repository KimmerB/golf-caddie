import { Router } from 'express';
import { z } from 'zod';
import { db } from '../lib/db';
import { mapClub } from '../lib/transformers';
import { ClubRow } from '../types';

const router = Router();

const clubSchema = z.object({
  name: z.string().min(1),
  claimedDistance: z.number().int().positive()
});

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM clubs ORDER BY created_at DESC').all() as ClubRow[];
  res.json(rows.map(mapClub));
});

router.post('/', (req, res) => {
  const parse = clubSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parse.error.issues });
  }
  const stmt = db.prepare('INSERT INTO clubs (name, claimed_distance) VALUES (@name, @claimed_distance)');
  const result = stmt.run({
    name: parse.data.name,
    claimed_distance: parse.data.claimedDistance
  });
  const row = db.prepare('SELECT * FROM clubs WHERE id = ?').get(result.lastInsertRowid) as ClubRow;
  res.status(201).json(mapClub(row));
});

router.put('/:id', (req, res) => {
  const parse = clubSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parse.error.issues });
  }
  const update = db.prepare('UPDATE clubs SET name = @name, claimed_distance = @claimed_distance WHERE id = @id');
  const result = update.run({
    id: Number(req.params.id),
    name: parse.data.name,
    claimed_distance: parse.data.claimedDistance
  });
  if (result.changes === 0) {
    return res.status(404).json({ message: 'Club not found' });
  }
  const row = db.prepare('SELECT * FROM clubs WHERE id = ?').get(req.params.id) as ClubRow;
  res.json(mapClub(row));
});

router.delete('/:id', (req, res) => {
  const stmt = db.prepare('DELETE FROM clubs WHERE id = ?');
  const result = stmt.run(req.params.id);
  if (result.changes === 0) {
    return res.status(404).json({ message: 'Club not found' });
  }
  res.json({ success: true });
});

export default router;
