// GET /api/handle?h=monxkarlla → { handle, available, reason }
// The live "is this link free?" check on the customise page.
import { handleProblem } from '../src/lib/handles.js';
import { getDb } from './_lib/firebase.js';
import { handle, json } from './_lib/http.js';
import { handleFree } from './_lib/orders.js';

export function GET(request) {
  return handle(async () => {
    const h = new URL(request.url).searchParams.get('h') || '';
    const problem = handleProblem(h);
    if (problem) return json({ handle: h, available: false, reason: problem });
    const free = await handleFree(await getDb(), h);
    return json({ handle: h, available: free, reason: free ? '' : 'That link is already taken.' });
  });
}
