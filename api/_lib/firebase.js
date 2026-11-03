// firebase-admin, set up once per function instance from the FIREBASE_SERVICE_ACCOUNT env var
// (the service account JSON, pasted as one line). Files under api/_lib are not routes.

let db = null;

/** Firestore (admin). Tests can swap in a fake with setDbForTests. */
export async function getDb() {
  if (db) return db;
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new HttpError(500, 'The server is missing FIREBASE_SERVICE_ACCOUNT.');
  let account;
  try {
    account = JSON.parse(raw);
  } catch {
    throw new HttpError(500, 'FIREBASE_SERVICE_ACCOUNT is not valid JSON.');
  }
  const { initializeApp, getApps, cert } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const app = getApps()[0] || initializeApp({ credential: cert(account), projectId: account.project_id });
  const firestore = getFirestore(app);
  try {
    firestore.settings({ ignoreUndefinedProperties: true });
  } catch {
    // settings() can only be called once per instance; a warm function may already have it.
  }
  db = firestore;
  return db;
}

export function setDbForTests(fake) {
  db = fake;
}

/** The Storage bucket the client uploads to, e.g. "my-project.firebasestorage.app". */
export const storageBucket = () => process.env.FIREBASE_STORAGE_BUCKET || process.env.VITE_FIREBASE_STORAGE_BUCKET || '';

export class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}
