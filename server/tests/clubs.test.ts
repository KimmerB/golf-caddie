import request from 'supertest';
import { createApp } from '../src/app';
import { db } from '../src/lib/db';

describe('Clubs API', () => {
  const app = createApp();

  beforeEach(() => {
    db.exec('DELETE FROM clubs;');
  });

  it('creates and lists clubs', async () => {
    await request(app).post('/api/clubs').send({ name: 'Driver', claimedDistance: 250 });
    const res = await request(app).get('/api/clubs');
    expect(res.status).toBe(200);
    expect(res.body[0].name).toBe('Driver');
  });
});
