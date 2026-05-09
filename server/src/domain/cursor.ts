/**
 * Opaque cursor used by /activities pagination. Encodes a numeric offset.
 *
 * MVP tradeoff: each "Load more" page re-runs the upstream Overpass query
 * and slices a different window of the same sorted result set. Cheap and
 * stateless; will be replaced by a per-query cache when caching is added.
 */

import { badRequest } from '../lib/errors.js';

export const encodeCursor = (offset: number): string =>
  Buffer.from(JSON.stringify({ o: offset }), 'utf8').toString('base64url');

export function decodeCursor(cursor: string | undefined): number {
  if (!cursor) return 0;
  try {
    const parsed = JSON.parse(
      Buffer.from(cursor, 'base64url').toString('utf8'),
    ) as { o?: unknown };
    if (typeof parsed.o !== 'number' || !Number.isInteger(parsed.o) || parsed.o < 0) {
      throw new Error('malformed offset');
    }
    return parsed.o;
  } catch {
    throw badRequest('Invalid cursor');
  }
}
