import { TAG_TO_CATEGORIES, type CategoryId } from './categories.js';

/**
 * Tag-match alignment score in [0, 1].
 *
 * Inputs:
 *  - matchedTagValues: OSM tag values surfaced from the activity (e.g. `park`,
 *    `restaurant`). An activity may carry multiple tags (a place tagged
 *    `bar` matches both 'food' and 'nightlife', so the activity's matched
 *    categories swell).
 *  - selected: the user's chosen category ids
 *
 * Score = (number of selected categories the activity touches) / (number selected).
 */
export function alignmentScore(
  matchedTagValues: readonly string[],
  selected: readonly CategoryId[],
): number {
  if (selected.length === 0) return 0;

  const hits = new Set<CategoryId>();
  for (const tag of matchedTagValues) {
    const cats = TAG_TO_CATEGORIES.get(tag);
    if (!cats) continue;
    for (const c of cats) {
      if (selected.includes(c)) hits.add(c);
    }
  }
  return hits.size / selected.length;
}
