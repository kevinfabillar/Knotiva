// Shared by the webhook and /api/confirm: given a PayMongo checkout session, publish its order if paid.
import { paidPayment } from './paymongo.js';
import { publishOrder } from './orders.js';

/** Returns { status, handle } or null when the session isn't paid or isn't one of ours. */
export async function settleSession(db, session) {
  const orderId = session?.attributes?.metadata?.orderId;
  if (!orderId || !/^[A-Za-z0-9]{10,40}$/.test(orderId)) return null;
  const payment = paidPayment(session);
  if (!payment) return null;

  const snap = await db.collection('orders').doc(orderId).get();
  if (!snap.exists) return null;
  const order = snap.data();
  if (order.status !== 'pending') return { status: order.status, handle: order.handle };
  if (!(payment.amount >= order.amount)) {
    console.error(`[settle] order ${orderId}: paid amount ${payment.amount} is below ${order.amount}; not publishing`);
    return { status: 'pending', handle: order.handle };
  }
  const result = await publishOrder(db, orderId, { ...payment, sessionId: session.id || null });
  return { status: result.status, handle: result.handle };
}
