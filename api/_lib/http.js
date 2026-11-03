// Small helpers for the Web-standard (Request → Response) Vercel functions.
import { HttpError } from './firebase.js';

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Reads a JSON body (max ~200 KB) or throws a 400. */
export async function readJson(request, limit = 200_000) {
  const text = await request.text();
  if (text.length > limit) throw new HttpError(413, 'That request is too large.');
  try {
    const body = JSON.parse(text || '{}');
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    return body;
  } catch {
    throw new HttpError(400, 'The request body must be a JSON object.');
  }
}

export const DEFAULT_SITE_URL = 'https://www.knotiva.my';

/**
 * The public site address for PayMongo's return links: the SITE_URL env var (default
 * https://www.knotiva.my), never the request's Origin header. Exception: requests to a local dev
 * server (localhost / 127.0.0.1) return to that server, so the flow can be tried locally.
 */
export function siteOrigin(request) {
  const url = new URL(request.url);
  if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(url.hostname)) return url.origin;
  return (process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
}

/** Runs a handler and turns thrown errors into JSON responses without leaking internals. */
export async function handle(fn) {
  try {
    return await fn();
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message, ...err.extra }, err.status);
    console.error('[api] unexpected error:', err?.message || err);
    return json({ error: 'Something went wrong on our side. Please try again.' }, 500);
  }
}
