// POST /api/paymongo-webhook — PayMongo calls this when a checkout session is paid.
// Verifies the Paymongo-Signature header against the raw body, then publishes the order (idempotent).
import { getDb } from './_lib/firebase.js';
import { json } from './_lib/http.js';
import { isLiveMode, verifySignature } from './_lib/paymongo.js';
import { settleSession } from './_lib/settle.js';

export async function POST(request) {
  const rawBody = await request.text();
  const live = isLiveMode();
  const problem = verifySignature({
    header: request.headers.get('paymongo-signature'),
    rawBody,
    secret: process.env.PAYMONGO_WEBHOOK_SECRET,
    live,
  });
  if (problem) {
    console.warn(`[webhook] rejected: ${problem}`);
    return json({ error: 'invalid signature' }, 401);
  }

  let event;
  try {
    event = JSON.parse(rawBody).data;
  } catch {
    return json({ error: 'bad json' }, 400);
  }
  const type = event?.attributes?.type;
  // Ignore events from the other mode and events we don't handle (200, so PayMongo doesn't retry).
  if (event?.attributes?.livemode !== live || type !== 'checkout_session.payment.paid') return json({ ok: true, ignored: type || null });

  try {
    const result = await settleSession(await getDb(), event.attributes.data);
    console.log(`[webhook] ${event.id}: ${result ? `${result.status} /${result.handle}` : 'not ours or unpaid'}`);
    return json({ ok: true, status: result?.status || null });
  } catch (err) {
    // A 5xx makes PayMongo retry later, which is what we want if Firestore had a hiccup.
    console.error(`[webhook] ${event?.id}: failed to publish:`, err?.message || err);
    return json({ error: 'temporary failure' }, 500);
  }
}
