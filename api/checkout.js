// POST /api/checkout { orderId } → { checkoutUrl }
// Opens a PayMongo Checkout Session (GCash, Maya, QR Ph) for a pending order, at the catalogue price.
import { getDb, HttpError } from './_lib/firebase.js';
import { handle, json, readJson, siteOrigin } from './_lib/http.js';
import { handleFree, loadOrder, priceFor } from './_lib/orders.js';
import { createCheckoutSession } from './_lib/paymongo.js';

export function POST(request) {
  return handle(async () => {
    const body = await readJson(request);
    const db = await getDb();
    const { ref, order } = await loadOrder(db, body.orderId);
    if (order.status !== 'pending') throw new HttpError(409, 'This order is already paid.');
    if ((order.sessionIds || []).length >= 10) throw new HttpError(429, 'Too many payment attempts for this order. Please start again.');
    if (!(await handleFree(db, order.handle))) throw new HttpError(409, 'That link was just taken. Please choose another.', { field: 'handle' });

    // Re-read the price from the catalogue; the order's amount was set the same way.
    const price = priceFor(order.slug);
    if (!price || price.amount !== order.amount) throw new HttpError(409, 'The price of this template changed. Please start again.');

    const origin = siteOrigin(request);
    const session = await createCheckoutSession({
      name: `${price.name} — digital wedding invitation`,
      amount: price.amount,
      orderId: body.orderId,
      handle: order.handle,
      email: order.email,
      billingName: order.names,
      successUrl: `${origin}/${order.handle}?paid=1&order=${body.orderId}`,
      cancelUrl: `${origin}/templates/${order.slug}/customize?publish=cancelled`,
    });
    const id = session?.data?.id;
    const checkoutUrl = session?.data?.attributes?.checkout_url;
    if (!id || !checkoutUrl) throw new HttpError(502, 'The payment provider returned an unexpected reply.');

    await ref.update({ sessionId: id, sessionIds: [...(order.sessionIds || []), id], checkoutStartedAt: new Date() });
    return json({ checkoutUrl });
  });
}
