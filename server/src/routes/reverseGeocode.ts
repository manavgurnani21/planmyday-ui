import { Router } from 'express';
import { ReverseGeocodeQuery } from '../schemas/geocode.js';
import { getValidated, validateQuery } from '../middleware/validate.js';
import { geocodeReverse } from '../services/nominatim.js';

export const reverseGeocodeRouter = Router();

reverseGeocodeRouter.get(
  '/reverse-geocode',
  validateQuery(ReverseGeocodeQuery),
  async (req, res, next) => {
    try {
      const q = getValidated<ReverseGeocodeQuery>(req);
      const hit = await geocodeReverse(q.lat, q.lng);
      if (!hit) {
        res.status(404).json({ error: { message: 'No location found' } });
        return;
      }
      res.json(hit);
    } catch (err) {
      next(err);
    }
  },
);
