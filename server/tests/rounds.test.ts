import request from 'supertest';
import { createApp } from '../src/app';
import { db } from '../src/lib/db';

describe('Rounds API', () => {
  const app = createApp();

  beforeEach(() => {
    db.exec('DELETE FROM holes; DELETE FROM rounds;');
  });

  it('creates a round and returns holes', async () => {
    const response = await request(app).post('/api/rounds').send({
      courseName: 'Test Course',
      courseRating: 72,
      slope: 120
    });
    expect(response.status).toBe(201);
    expect(response.body.holes).toHaveLength(18);
  });

  it('updates a hole and returns summary', async () => {
    const create = await request(app).post('/api/rounds').send({
      courseName: 'Test Course',
      courseRating: 72,
      slope: 120
    });
    const roundId = create.body.id;

    const update = await request(app)
      .put(`/api/rounds/${roundId}/hole/1`)
      .send({ strokes: 4, putts: 2, fir: true, gir: false, inPlay: true });
    expect(update.status).toBe(200);
    expect(update.body.holes[0].strokes).toBe(4);

    const summary = await request(app).get(`/api/rounds/${roundId}/summary`);
    expect(summary.status).toBe(200);
    expect(summary.body.gross).toBeGreaterThan(0);
    expect(summary.body.differential).toBeDefined();
  });
});
