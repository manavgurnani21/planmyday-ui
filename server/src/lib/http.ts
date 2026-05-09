import { config } from '../config.js';
import { upstreamFailure, upstreamTimeout } from './errors.js';

type FetchOptions = {
  url: string;
  method?: 'GET' | 'POST';
  headers?: Record<string, string>;
  body?: string;
  timeoutMs?: number;
  service: string;
};

export async function fetchUpstream({
  url,
  method = 'GET',
  headers = {},
  body,
  timeoutMs = config.REQUEST_TIMEOUT_MS,
  service,
}: FetchOptions): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      method,
      headers: {
        'User-Agent': config.USER_AGENT,
        Accept: 'application/json',
        ...headers,
      },
      body,
      signal: controller.signal,
    });
    if (!res.ok) {
      throw upstreamFailure(`${service} returned ${res.status}`, {
        service,
        status: res.status,
      });
    }
    return res;
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw upstreamTimeout(`${service} timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
