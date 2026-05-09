import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodError, type ZodTypeAny, type z } from 'zod';
import { badRequest } from '../lib/errors.js';

declare module 'express-serve-static-core' {
  interface Request {
    validatedQuery?: unknown;
  }
}

/**
 * Zod-based query validation middleware. Stashes the parsed/coerced result on
 * `req.validatedQuery`. Route handlers cast it via `getValidated<T>(req)`.
 */
export const validateQuery =
  <T extends ZodTypeAny>(schema: T): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        next(badRequest('Invalid query parameters', err.flatten()));
      } else {
        next(err);
      }
    }
  };

export const getValidated = <T>(req: Request): T => req.validatedQuery as T;

export type Inferred<T extends ZodTypeAny> = z.infer<T>;
