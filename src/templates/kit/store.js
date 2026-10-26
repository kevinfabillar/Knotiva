// Saves a couple's edits in this browser (IndexedDB), per template.
// Record shape: { details: { a: 'Ana', ... }, photos: { '/templates/x/hero.jpg': Blob } }

const DB = 'knotiva';
const STORE = 'custom';
const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('knotiva-custom') : null;

function open() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function tx(mode, fn) {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(STORE, mode);
    const out = fn(t.objectStore(STORE));
    t.oncomplete = () => resolve(out?.result);
    t.onerror = () => reject(t.error);
  });
}

export async function loadCustom(slug) {
  try {
    return (await tx('readonly', (s) => s.get(slug))) || { details: {}, photos: {} };
  } catch {
    return { details: {}, photos: {} };
  }
}

export async function saveCustom(slug, record) {
  await tx('readwrite', (s) => s.put(record, slug));
  channel?.postMessage({ slug });
}

export async function clearCustom(slug) {
  await tx('readwrite', (s) => s.delete(slug));
  channel?.postMessage({ slug });
}

/** Calls fn(slug) whenever edits are saved in another tab or frame. */
export function onCustomChange(fn) {
  if (!channel) return () => {};
  const handler = (e) => fn(e.data?.slug);
  channel.addEventListener('message', handler);
  return () => channel.removeEventListener('message', handler);
}

/** Shrinks an uploaded photo to at most `max` px and returns a JPEG Blob. */
export async function compressImage(file, max = 1800) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
}

/** Turns a stored record into { details, photos } with object URLs the page can use. */
export function toUrls(record) {
  const photos = {};
  Object.entries(record.photos || {}).forEach(([src, blob]) => {
    if (blob) photos[src] = URL.createObjectURL(blob);
  });
  return { details: record.details || {}, photos };
}
