import { describe, it, expect } from 'vitest';
import { haversineMi, milesToMeters } from './distance.js';

describe('haversineMi', () => {
  it('returns 0 for identical points', () => {
    const p = { lat: 40.6710, lng: -73.9814 };
    expect(haversineMi(p, p)).toBeCloseTo(0, 6);
  });

  it('matches a known NYC ↔ LA distance within 0.5%', () => {
    const nyc = { lat: 40.7128, lng: -74.0060 };
    const la = { lat: 34.0522, lng: -118.2437 };
    const expected = 2451; // miles, rounded
    const got = haversineMi(nyc, la);
    expect(Math.abs(got - expected) / expected).toBeLessThan(0.005);
  });

  it('is symmetric', () => {
    const a = { lat: 1.234, lng: 5.678 };
    const b = { lat: -3.21, lng: 9.876 };
    expect(haversineMi(a, b)).toBeCloseTo(haversineMi(b, a), 9);
  });
});

describe('milesToMeters', () => {
  it('converts 1 mi to 1609.344 m', () => {
    expect(milesToMeters(1)).toBe(1609.344);
  });

  it('scales linearly', () => {
    expect(milesToMeters(5)).toBeCloseTo(8046.72, 5);
  });
});
