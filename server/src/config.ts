import { z } from 'zod';

const Env = z.object({
  PORT: z.coerce.number().int().positive().default(8787),
  OVERPASS_URL: z.string().url().default('https://overpass-api.de/api/interpreter'),
  NOMINATIM_URL: z.string().url().default('https://nominatim.openstreetmap.org'),
  USER_AGENT: z.string().min(1).default('PlanMyDay/0.1 (github.com/manavgurnani21/planmyday-ui)'),
  REQUEST_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
});

const parsed = Env.safeParse(process.env);
if (!parsed.success) {
  console.error('Invalid environment:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;
