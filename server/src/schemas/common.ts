import { z } from 'zod';
import { isCategoryId, type CategoryId } from '../domain/categories.js';

export const Lat = z.coerce
  .number()
  .min(-90, 'lat must be ≥ -90')
  .max(90, 'lat must be ≤ 90');

export const Lng = z.coerce
  .number()
  .min(-180, 'lng must be ≥ -180')
  .max(180, 'lng must be ≤ 180');

export const InterestsCsv = z
  .string()
  .min(1, 'interests is required')
  .transform((s, ctx): CategoryId[] => {
    const parts = s
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    if (parts.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'interests cannot be empty' });
      return z.NEVER;
    }
    const out: CategoryId[] = [];
    for (const p of parts) {
      if (!isCategoryId(p)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Unknown category id: ${p}` });
        return z.NEVER;
      }
      out.push(p);
    }
    return out;
  });

export const Bool = z
  .union([z.boolean(), z.string()])
  .transform((v) => {
    if (typeof v === 'boolean') return v;
    return v === 'true' || v === '1';
  });
