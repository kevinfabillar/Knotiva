// Orders, handles and publishing. Firestore layout:
//   orders/{orderId}   { slug, handle, email, names, details, photos, amount, status, sessionIds, … }
//                      status: pending → paid | paid_handle_conflict
//   handles/{handle}   { orderId, createdAt }            (the claim on a link)
//   sites/{handle}     { slug, details, photos, names, orderId, publishedAt }   (public, read by /:handle)
import { CATALOG } from '../../src/templates/catalog.js';
import { handleProblem, priceToCentavos } from '../../src/lib/handles.js';
import { HttpError } from './firebase.js';

/** Template name and price (centavos) from the catalogue, never from the client. */
export function priceFor(slug) {
  const t = CATALOG.find((x) => x.slug === slug);
  const amount = t ? priceToCentavos(t.price) : 0;
  return t && amount ? { name: t.name, amount, price: t.price } : null;
}

export function checkHandle(handle) {
  const problem = handleProblem(handle);
  if (problem) throw new HttpError(400, problem, { field: 'handle' });
}

/** True when nobody has published at this handle. */
export async function handleFree(db, handle) {
  const snap = await db.collection('handles').doc(handle).get();
  return !snap.exists;
}

const KEY = /^[A-Za-z0-9_]{1,60}$/;

/** The couple's text edits: a flat object of short strings. */
export function cleanDetails(details) {
  if (details == null) return {};
  if (typeof details !== 'object' || Array.isArray(details)) throw new HttpError(400, 'Details must be an object.');
  const out = {};
  for (const [k, v] of Object.entries(details)) {
    if (!KEY.test(k) || typeof v !== 'string') continue;
    out[k] = v.slice(0, 6000);
  }
  if (Object.keys(out).length > 150 || JSON.stringify(out).length > 120_000) throw new HttpError(413, 'Your details are too long.');
  return out;
}

/**
 * The photo map { originalSrc: downloadURL }. Each original must be a photo of this template (or the
 * gift QR), and each URL must be a Firebase Storage download URL under orders/{orderId}/ in our bucket.
 */
export function cleanPhotos(photos, { slug, orderId, bucket }) {
  if (!photos || typeof photos !== 'object' || Array.isArray(photos)) throw new HttpError(400, 'Photos must be an object.');
  const entries = Object.entries(photos);
  if (entries.length > 40) throw new HttpError(400, 'Too many photos.');
  const prefix = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(`orders/${orderId}/`)}`;
  const out = {};
  for (const [src, url] of entries) {
    const okSrc = src === '__gift-qr' || (src.startsWith(`/templates/${slug}/`) && src.length < 200 && !src.includes('..'));
    if (!okSrc) throw new HttpError(400, `Unexpected photo: ${src.slice(0, 80)}`);
    if (typeof url !== 'string' || !bucket || !url.startsWith(prefix) || url.length > 600) {
      throw new HttpError(400, 'A photo link is not from your upload.');
    }
    out[src] = url;
  }
  return out;
}

export async function loadOrder(db, orderId) {
  if (typeof orderId !== 'string' || !/^[A-Za-z0-9]{10,40}$/.test(orderId)) throw new HttpError(400, 'Unknown order.');
  const snap = await db.collection('orders').doc(orderId).get();
  if (!snap.exists) throw new HttpError(404, 'Unknown order.');
  return { ref: snap.ref || db.collection('orders').doc(orderId), order: snap.data() };
}

/**
 * Publishes a paid order, once. One transaction: claim handles/{handle}, write sites/{handle}, mark the
 * order paid. If someone else claimed the handle first, the order becomes paid_handle_conflict for a
 * person to sort out. Calling it again (webhook retries, /api/confirm) changes nothing.
 * Returns { status, handle, published }.
 */
export async function publishOrder(db, orderId, payment) {
  const orderRef = db.collection('orders').doc(orderId);
  return db.runTransaction(async (t) => {
    const snap = await t.get(orderRef);
    if (!snap.exists) throw new HttpError(404, 'Unknown order.');
    const order = snap.data();
    if (order.status !== 'pending') return { status: order.status, handle: order.handle, published: false };

    const handleRef = db.collection('handles').doc(order.handle);
    const siteRef = db.collection('sites').doc(order.handle);
    const [handleSnap, siteSnap] = await Promise.all([t.get(handleRef), t.get(siteRef)]);
    const now = new Date();
    const paid = { paidAt: now, payment: payment || null };

    const takenByOther = (handleSnap.exists && handleSnap.data().orderId !== orderId) || (siteSnap.exists && siteSnap.data().orderId !== orderId);
    if (takenByOther) {
      t.update(orderRef, { ...paid, status: 'paid_handle_conflict' });
      return { status: 'paid_handle_conflict', handle: order.handle, published: false };
    }

    t.set(handleRef, { orderId, createdAt: now });
    t.set(siteRef, {
      slug: order.slug,
      names: order.names || '',
      details: order.details || {},
      photos: order.photos || {},
      orderId,
      publishedAt: now,
    });
    t.update(orderRef, { ...paid, status: 'paid', publishedAt: now });
    return { status: 'paid', handle: order.handle, published: true };
  });
}
