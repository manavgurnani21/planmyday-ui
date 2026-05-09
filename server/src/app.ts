import express from 'express';
import { activitiesRouter } from './routes/activities.js';
import { geocodeRouter } from './routes/geocode.js';
import { reverseGeocodeRouter } from './routes/reverseGeocode.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(express.json({ limit: '32kb' }));

  // Permissive CORS for local dev — frontend lives on a different port (Vite).
  app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.use(activitiesRouter);
  app.use(geocodeRouter);
  app.use(reverseGeocodeRouter);

  app.use(errorHandler);

  return app;
}
