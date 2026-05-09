import { describe, it, expect } from 'vitest';
import { buildActivitiesQuery } from './overpass.js';

describe('buildActivitiesQuery', () => {
  const args = {
    lat: 40.6710,
    lng: -73.9814,
    radiusMeters: 8047,
    interests: ['outdoors', 'food'] as const,
  };

  it('includes the around filter with rounded radius and coordinates', () => {
    const q = buildActivitiesQuery(args);
    expect(q).toContain('around:8047,40.671,-73.9814');
  });

  it('includes union over node, way, relation', () => {
    const q = buildActivitiesQuery(args);
    expect(q).toMatch(/node\["amenity"~/);
    expect(q).toMatch(/way\["amenity"~/);
    expect(q).toMatch(/relation\["amenity"~/);
  });

  it('emits all OSM tag keys we union over', () => {
    const q = buildActivitiesQuery(args);
    for (const key of ['amenity', 'leisure', 'tourism', 'sport', 'shop']) {
      expect(q).toContain(`["${key}"~`);
    }
  });

  it('embeds tags from the requested categories', () => {
    const q = buildActivitiesQuery(args);
    // outdoors → park, hiking, nature_reserve, sports_centre
    // food → restaurant, cafe, bar, food_court
    for (const tag of ['park', 'hiking', 'restaurant', 'cafe']) {
      expect(q).toContain(tag);
    }
  });

  it('requests JSON output and centers for ways/relations', () => {
    const q = buildActivitiesQuery(args);
    expect(q).toMatch(/\[out:json\]/);
    expect(q).toMatch(/out center tags;/);
  });

  it('throws when interests resolve to no tags', () => {
    expect(() =>
      buildActivitiesQuery({ ...args, interests: [] }),
    ).toThrow();
  });
});
