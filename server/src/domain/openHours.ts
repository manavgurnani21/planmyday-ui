import OpeningHours from 'opening_hours';

/**
 * Returns true if `hoursRaw` (OSM `opening_hours` syntax) indicates the place
 * is currently open. Returns null when the value is missing or unparseable —
 * callers must distinguish "definitely closed" from "unknown".
 */
export function isOpenNow(hoursRaw: string | undefined | null, now = new Date()): boolean | null {
  if (!hoursRaw) return null;
  try {
    const oh = new OpeningHours(hoursRaw);
    return oh.getState(now);
  } catch {
    return null;
  }
}
