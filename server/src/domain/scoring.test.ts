import { describe, it, expect } from 'vitest';
import { alignmentScore } from './scoring.js';

describe('alignmentScore', () => {
  it('returns 0 when no interests are selected', () => {
    expect(alignmentScore(['park'], [])).toBe(0);
  });

  it('returns 1 when every selected category is touched', () => {
    expect(alignmentScore(['park', 'cafe'], ['outdoors', 'food'])).toBe(1);
  });

  it('returns the fraction of selected categories matched', () => {
    // 1 of 3 selected categories touched → 1/3
    expect(alignmentScore(['park'], ['outdoors', 'food', 'arts'])).toBeCloseTo(1 / 3, 9);
  });

  it('counts overlapping tags only once toward their category', () => {
    // `bar` covers both food + nightlife; with both selected, both get credit
    expect(alignmentScore(['bar'], ['food', 'nightlife'])).toBe(1);
  });

  it('ignores unknown tags', () => {
    expect(alignmentScore(['bench', 'park'], ['outdoors'])).toBe(1);
    expect(alignmentScore(['bench'], ['outdoors'])).toBe(0);
  });

  it('does not double-count duplicate tags', () => {
    expect(alignmentScore(['park', 'park'], ['outdoors', 'food'])).toBeCloseTo(0.5, 9);
  });
});
