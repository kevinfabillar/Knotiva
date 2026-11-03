// Photo uploads for publishing (customise page only). Loaded with `await import('../lib/upload.js')`.
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebaseApp } from './firebase-app.js';

/** Uploads one photo to orders/{orderId}/{name} and returns its download URL. */
export async function uploadPhoto(orderId, name, blob) {
  const r = ref(getStorage(firebaseApp()), `orders/${orderId}/${name}`);
  await uploadBytes(r, blob, { contentType: blob.type || 'image/jpeg', cacheControl: 'public, max-age=31536000' });
  return getDownloadURL(r);
}
