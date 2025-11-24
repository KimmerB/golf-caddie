import { Router } from 'express';
import { z } from 'zod';
import { createRound, getRound, getRounds, getRoundSummary, updateHole } from '../services/roundService';

const router = Router();

const roundSchema = z.object({
  courseName: z.string().min(1),
  courseRating: z.number().min(60).max(80),
  slope: z.number().min(55).max(155)
});

const holeSchema = z.object({
  strokes: z.number().int().min(1).max(20).nullable(),
  putts: z.number().int().min(0).max(10).nullable(),
  fir: z.boolean().nullable(),
  gir: z.boolean().nullable(),
  inPlay: z.boolean().nullable()
});

router.get('/', (_req, res) => {
  res.json(getRounds());
});

router.post('/', (req, res) => {
  const parse = roundSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parse.error.issues });
  }
  const round = createRound(parse.data);
  res.status(201).json(round);
});

router.get('/:id', (req, res) => {
  const round = getRound(Number(req.params.id));
  if (!round) {
    return res.status(404).json({ message: 'Round not found' });
  }
  res.json(round);
});

router.put('/:id/hole/:holeNumber', (req, res) => {
  const parse = holeSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid payload', issues: parse.error.issues });
  }
  const updated = updateHole(Number(req.params.id), Number(req.params.holeNumber), parse.data);
  if (!updated) {
    return res.status(404).json({ message: 'Round not found' });
  }
  res.json(updated);
});

router.get('/:id/summary', (req, res) => {
  const summary = getRoundSummary(Number(req.params.id));
  if (!summary) {
    return res.status(404).json({ message: 'Round not found' });
  }
  res.json(summary);
});

export default router;
