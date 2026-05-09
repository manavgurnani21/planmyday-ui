/**
 * Server-side mirror of the frontend CATEGORIES list (src/data/mockData.js).
 * The backend owns the canonical OSM tag mappings used in Overpass queries
 * and tag-match scoring.
 */

export type CategoryId =
  | 'outdoors'
  | 'food'
  | 'arts'
  | 'nightlife'
  | 'wellness'
  | 'sports';

export type Category = {
  id: CategoryId;
  /** OSM tag values that should match this category. */
  tags: string[];
  /** Default singular label used when a more specific OSM type isn't available. */
  defaultLabel: string;
  /** Pretty labels per tag, used for category_label in responses. */
  tagLabels: Record<string, string>;
};

export const CATEGORIES: readonly Category[] = [
  {
    id: 'outdoors',
    defaultLabel: 'Outdoors',
    tags: ['park', 'hiking', 'nature_reserve', 'sports_centre'],
    tagLabels: {
      park: 'Park',
      hiking: 'Trail',
      nature_reserve: 'Nature reserve',
      sports_centre: 'Sports centre',
    },
  },
  {
    id: 'food',
    defaultLabel: 'Food & Drink',
    tags: ['restaurant', 'cafe', 'bar', 'food_court'],
    tagLabels: {
      restaurant: 'Restaurant',
      cafe: 'Cafe',
      bar: 'Bar',
      food_court: 'Food court',
    },
  },
  {
    id: 'arts',
    defaultLabel: 'Arts & Culture',
    tags: ['museum', 'gallery', 'theatre', 'cinema'],
    tagLabels: {
      museum: 'Museum',
      gallery: 'Gallery',
      theatre: 'Theatre',
      cinema: 'Cinema',
    },
  },
  {
    id: 'nightlife',
    defaultLabel: 'Nightlife',
    tags: ['bar', 'nightclub', 'casino'],
    tagLabels: {
      bar: 'Bar',
      nightclub: 'Nightclub',
      casino: 'Casino',
    },
  },
  {
    id: 'wellness',
    defaultLabel: 'Wellness',
    tags: ['gym', 'spa', 'yoga', 'swimming_pool'],
    tagLabels: {
      gym: 'Gym',
      spa: 'Spa',
      yoga: 'Yoga studio',
      swimming_pool: 'Swimming pool',
    },
  },
  {
    id: 'sports',
    defaultLabel: 'Social Sports',
    tags: ['bowling_alley', 'golf_course', 'tennis_court', 'climbing'],
    tagLabels: {
      bowling_alley: 'Bowling alley',
      golf_course: 'Golf course',
      tennis_court: 'Tennis court',
      climbing: 'Climbing gym',
    },
  },
] as const;

const BY_ID = new Map<CategoryId, Category>(
  CATEGORIES.map((c) => [c.id, c]),
);

export const getCategory = (id: CategoryId): Category | undefined =>
  BY_ID.get(id);

export const isCategoryId = (id: string): id is CategoryId =>
  BY_ID.has(id as CategoryId);

/**
 * Reverse index: OSM tag value → category ids that contain it.
 * `bar` belongs to both 'food' and 'nightlife', so each tag maps to a list.
 */
export const TAG_TO_CATEGORIES: ReadonlyMap<string, readonly CategoryId[]> = (() => {
  const m = new Map<string, CategoryId[]>();
  for (const c of CATEGORIES) {
    for (const t of c.tags) {
      const list = m.get(t) ?? [];
      list.push(c.id);
      m.set(t, list);
    }
  }
  return m;
})();
