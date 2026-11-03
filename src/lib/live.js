// The couple's page reading its site and saving RSVPs. Firestore Lite (no realtime listeners) keeps
// this small. Load it with `await import('../lib/live.js')` so Firebase stays out of the main bundle.
import { addDoc, collection, doc, getDoc, getFirestore, serverTimestamp } from 'firebase/firestore/lite';
import { firebaseApp } from './firebase-app.js';

/** The published invitation at knotiva.my/<handle>, or null. */
export async function loadSite(handle) {
  const snap = await getDoc(doc(getFirestore(firebaseApp()), 'sites', handle));
  return snap.exists() ? snap.data() : null;
}

/** Saves a guest's reply under sites/{handle}/rsvps (create-only; see firestore.rules). */
export async function saveRsvp(handle, reply) {
  await addDoc(collection(getFirestore(firebaseApp()), 'sites', handle, 'rsvps'), { ...reply, createdAt: serverTimestamp() });
}
