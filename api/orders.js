// POST /api/orders { slug, handle, email, names, details } → { orderId, amount, price }
// Starts a pending order for a template and a free handle. The price comes from the catalogue.
import { getDb, HttpError } from './_lib/firebase.js';
import { handle, json, readJson } from './_lib/http.js';
import { checkHandle, cleanDetails, handleFree, priceFor } from './_lib/orders.js';

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

export function POST(request) {
  return handle(async () => {
    const body = await readJson(request);
    const slug = String(body.slug || '');
    const price = priceFor(slug);
    if (!price) throw new HttpError(400, 'Unknown template.');

    const h = String(body.handle || '');
    checkHandle(h);

    const email = String(body.email || '').trim().toLowerCase();
    if (!EMAIL.test(email) || email.length > 254) throw new HttpError(400, 'Please enter a valid email address.', { field: 'email' });
    const names = String(body.names || '').trim().slice(0, 120);
    const details = cleanDetails(body.details);

    const db = await getDb();
    if (!(await handleFree(db, h))) throw new HttpError(409, 'That link is already taken. Please choose another.', { field: 'handle' });

    const ref = db.collection('orders').doc();
    await ref.set({
      slug,
      handle: h,
      email,
      names,
      details,
      photos: {},
      amount: price.amount,
      currency: 'PHP',
      status: 'pending',
      sessionIds: [],
      createdAt: new Date(),
    });
    return json({ orderId: ref.id, amount: price.amount, price: price.price }, 201);
  });
}
