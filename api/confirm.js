// GET /api/confirm?orderId=… → { status, handle }
// Fallback for when the couple lands on their page before the webhook arrives: asks PayMongo directly
// and publishes the order if a session is paid. status: pending | paid | paid_handle_conflict
import { getDb } from './_lib/firebase.js';
import { handle, json } from './_lib/http.js';
import { loadOrder } from './_lib/orders.js';
import { retrieveCheckoutSession } from './_lib/paymongo.js';
import { settleSession } from './_lib/settle.js';

export function GET(request) {
  return handle(async () => {
    const orderId = new URL(request.url).searchParams.get('orderId');
    const db = await getDb();
    const { order } = await loadOrder(db, orderId);
    if (order.status !== 'pending') return json({ status: order.status, handle: order.handle });

    // Newest session first; a couple may have opened checkout more than once.
    const ids = [...(order.sessionIds || [])].reverse().slice(0, 5);
    for (const id of ids) {
      const session = (await retrieveCheckoutSession(id))?.data;
      const result = await settleSession(db, session);
      if (result && result.status !== 'pending') return json(result);
    }
    return json({ status: 'pending', handle: order.handle });
  });
}
