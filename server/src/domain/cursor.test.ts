import { describe, it, expect } from 'vitest';
import { decodeCursor, encodeCursor } from './cursor.js';
import { HttpError } from '../lib/errors.js';

describe('cursor codec', () => {
  it('round-trips zero', () => {
    expect(decodeCursor(encodeCursor(0))).toBe(0);
  });

  it('round-trips a positive offset', () => {
    expect(decodeCursor(encodeCursor(123))).toBe(123);
  });

  it('treats undefined as offset 0', () => {
    expect(decodeCursor(undefined)).toBe(0);
  });

  it('rejects malformed cursors with a 400', () => {
    try {
      decodeCursor('not-a-real-cursor');
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(HttpError);
      expect((err as HttpError).status).toBe(400);
    }
  });

  it('rejects negative offsets', () => {
    const malicious = Buffer.from(JSON.stringify({ o: -5 })).toString('base64url');
    expect(() => decodeCursor(malicious)).toThrow();
  });

  it('rejects non-integer offsets', () => {
    const malicious = Buffer.from(JSON.stringify({ o: 1.5 })).toString('base64url');
    expect(() => decodeCursor(malicious)).toThrow();
  });
});
