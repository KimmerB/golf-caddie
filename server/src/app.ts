import express from 'express';
import cors from 'cors';
import clubsRouter from './routes/clubs';
import roundsRouter from './routes/rounds';

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));

  app.use('/api/clubs', clubsRouter);
  app.use('/api/rounds', roundsRouter);

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  });

  return app;
};
