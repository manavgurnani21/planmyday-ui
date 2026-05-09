import { z } from 'zod';
import { Lat, Lng } from './common.js';

export const GeocodeQuery = z.object({
  q: z.string().trim().min(1, 'q is required').max(200),
  limit: z.coerce.number().int().min(1).max(10).default(5),
});

export type GeocodeQuery = z.infer<typeof GeocodeQuery>;

export const GeocodeResult = z.object({
  name: z.string(),
  detail: z.string(),
  location: z.object({ lat: z.number(), lng: z.number() }),
});

export const GeocodeResponse = z.object({
  results: z.array(GeocodeResult),
});

export const ReverseGeocodeQuery = z.object({
  lat: Lat,
  lng: Lng,
});

export type ReverseGeocodeQuery = z.infer<typeof ReverseGeocodeQuery>;

export const ReverseGeocodeResponse = z.object({
  name: z.string(),
  detail: z.string(),
});
