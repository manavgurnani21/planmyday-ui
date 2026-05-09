import { Router } from 'express';
import { GeocodeQuery } from '../schemas/geocode.js';
import { getValidated, validateQuery } from '../middleware/validate.js';
import { geocodeForward } from '../services/nominatim.js';

export const geocodeRouter = Router();

geocodeRouter.get(
  '/geocode',
  validateQuery(GeocodeQuery),
  async (req, res, next) => {
    try {
      const q = getValidated<GeocodeQuery>(req);
      const results = await geocodeForward(q.q, q.limit);
      res.json({ results });
    } catch (err) {
      next(err);
    }
  },
);
