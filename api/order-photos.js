// POST /api/order-photos { orderId, photos: { originalSrc: downloadURL } } → { ok: true }
// Records the couple's uploaded photos on a pending order (they upload to Storage under orders/{orderId}/).
import { getDb, HttpError, storageBucket } from './_lib/firebase.js';
import { handle, json, readJson } from './_lib/http.js';
import { cleanPhotos, loadOrder } from './_lib/orders.js';

export function POST(request) {
  return handle(async () => {
    const body = await readJson(request);
    const db = await getDb();
    const { ref, order } = await loadOrder(db, body.orderId);
    if (order.status !== 'pending') throw new HttpError(409, 'This order is already paid.');
    const photos = cleanPhotos(body.photos, { slug: order.slug, orderId: body.orderId, bucket: storageBucket() });
    await ref.update({ photos, updatedAt: new Date() });
    return json({ ok: true, count: Object.keys(photos).length });
  });
}
