import { z } from 'zod';
import { Bool, InterestsCsv, Lat, Lng } from './common.js';

const ALLOWED_RADII = [1, 5, 10, 25] as const;

export const ActivitiesQuery = z.object({
  lat: Lat,
  lng: Lng,
  radius_mi: z.coerce
    .number()
    .refine((n) => (ALLOWED_RADII as readonly number[]).includes(n), {
      message: `radius_mi must be one of ${ALLOWED_RADII.join(', ')}`,
    })
    .default(5),
  interests: InterestsCsv,
  open_now: Bool.default(false),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  cursor: z.string().optional(),
});

export type ActivitiesQuery = z.infer<typeof ActivitiesQuery>;

export const ActivityResult = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  category_label: z.string(),
  distance_mi: z.number(),
  score: z.number(),
  open_now: z.boolean().nullable(),
  website: z.string().nullable(),
  location: z.object({ lat: z.number(), lng: z.number() }),
  address: z.string().nullable(),
  hours_raw: z.string().nullable(),
});

export type ActivityResult = z.infer<typeof ActivityResult>;

export const ActivitiesResponse = z.object({
  results: z.array(ActivityResult),
  next_cursor: z.string().nullable(),
  total_estimate: z.number().int().nonnegative(),
});

export type ActivitiesResponse = z.infer<typeof ActivitiesResponse>;
