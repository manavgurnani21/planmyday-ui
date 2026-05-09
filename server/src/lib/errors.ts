export class HttpError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export const badRequest = (message: string, details?: unknown) =>
  new HttpError(400, message, details);

export const upstreamFailure = (message = 'Upstream service failed', details?: unknown) =>
  new HttpError(502, message, details);

export const upstreamTimeout = (message = 'Upstream service timed out') =>
  new HttpError(504, message);
