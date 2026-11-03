// PayMongo Checkout Sessions and webhook signatures.
// Docs: https://docs.paymongo.com/reference/create-a-checkout
//       https://docs.paymongo.com/docs/developer-tools-webhook-setup-management (Securing a webhook)
import { createHmac, timingSafeEqual } from 'node:crypto';
import { HttpError } from './firebase.js';

const API = 'https://api.paymongo.com/v1';
export const PAYMENT_METHODS = ['gcash', 'paymaya', 'qrph'];

function secretKey() {
  const key = process.env.PAYMONGO_SECRET_KEY;
  if (!key) throw new HttpError(500, 'The server is missing PAYMONGO_SECRET_KEY.');
  return key;
}

/** sk_live_… keys are live mode; everything else (sk_test_…) is test mode. */
export const isLiveMode = () => (process.env.PAYMONGO_SECRET_KEY || '').startsWith('sk_live_');

async function call(method, path, body) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      authorization: `Basic ${Buffer.from(`${secretKey()}:`).toString('base64')}`,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // PayMongo's error details are safe to log (no secrets), and help when setting up.
    const detail = data?.errors?.map((e) => e.detail).join('; ') || res.statusText;
    console.error(`[paymongo] ${method} ${path} failed (${res.status}): ${detail}`);
    throw new HttpError(502, 'The payment provider could not be reached. Please try again.');
  }
  return data;
}

export function createCheckoutSession({ name, amount, orderId, handle, email, billingName, successUrl, cancelUrl }) {
  return call('POST', '/checkout_sessions', {
    data: {
      attributes: {
        line_items: [{ name, amount, currency: 'PHP', quantity: 1, description: `knotiva.my/${handle}` }],
        payment_method_types: PAYMENT_METHODS,
        description: `${name} digital invitation · knotiva.my/${handle}`,
        reference_number: orderId,
        metadata: { orderId, handle },
        success_url: successUrl,
        cancel_url: cancelUrl,
        send_email_receipt: Boolean(email),
        show_description: true,
        show_line_items: true,
        ...(email ? { billing: { name: billingName || undefined, email } } : {}),
      },
    },
  });
}

export const retrieveCheckoutSession = (id) => call('GET', `/checkout_sessions/${encodeURIComponent(id)}`);

/** A checkout session (resource object) is paid when one of its payments is paid. */
export function paidPayment(session) {
  const a = session?.attributes || {};
  const pay = (a.payments || []).find((p) => p?.attributes?.status === 'paid');
  if (pay) return { id: pay.id, amount: pay.attributes.amount, method: pay.attributes.source?.type || null };
  if (a.payment_intent?.attributes?.status === 'succeeded') {
    return { id: a.payment_intent.id, amount: a.payment_intent.attributes.amount, method: null };
  }
  return null;
}

/**
 * Checks the Paymongo-Signature header ("t=…,te=…,li=…"): HMAC-SHA256 of `${t}.${rawBody}`
 * with the webhook secret, compared (constant time) against `li` in live mode or `te` in test mode.
 * Returns '' when valid, or the reason it failed.
 */
export function verifySignature({ header, rawBody, secret, live, now = Date.now(), toleranceSec = 300 }) {
  if (!secret) return 'missing webhook secret';
  if (!header) return 'missing signature header';
  const parts = {};
  for (const piece of String(header).split(',')) {
    const i = piece.indexOf('=');
    if (i > 0) parts[piece.slice(0, i).trim()] = piece.slice(i + 1).trim();
  }
  const t = parts.t;
  const given = live ? parts.li : parts.te;
  if (!t || !/^\d+$/.test(t)) return 'bad timestamp';
  if (!given || !/^[0-9a-f]+$/i.test(given)) return `no ${live ? 'li' : 'te'} signature`;
  if (Math.abs(now / 1000 - Number(t)) > toleranceSec) return 'timestamp outside tolerance';
  const expected = createHmac('sha256', secret).update(`${t}.${rawBody}`).digest();
  const actual = Buffer.from(given, 'hex');
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return 'signature mismatch';
  return '';
}
