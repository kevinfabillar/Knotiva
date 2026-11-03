// Registers Knotiva's PayMongo webhook and prints its signing secret (PAYMONGO_WEBHOOK_SECRET).
//
//   node scripts/paymongo-webhook.mjs                         → https://www.knotiva.my/api/paymongo-webhook
//   node scripts/paymongo-webhook.mjs https://example.com/api/paymongo-webhook
//   node scripts/paymongo-webhook.mjs --list                  → show existing webhooks (no secrets)
//
// Uses PAYMONGO_SECRET_KEY from the environment or .env.local. A test key (sk_test_…) makes a
// test-mode webhook and a live key (sk_live_…) a live one; each has its own secret.
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const DEFAULT_URL = 'https://www.knotiva.my/api/paymongo-webhook';
const EVENTS = ['checkout_session.payment.paid'];

function envKey() {
  if (process.env.PAYMONGO_SECRET_KEY) return process.env.PAYMONGO_SECRET_KEY;
  const file = resolve(dirname(fileURLToPath(import.meta.url)), '..', '.env.local');
  if (!existsSync(file)) return '';
  const line = readFileSync(file, 'utf8').split(/\r?\n/).find((l) => /^\s*PAYMONGO_SECRET_KEY\s*=/.test(l));
  return line ? line.split('=').slice(1).join('=').trim().replace(/^['"]|['"]$/g, '') : '';
}

const key = envKey();
if (!/^sk_(test|live)_/.test(key)) {
  console.error('Set PAYMONGO_SECRET_KEY (sk_test_… or sk_live_…) in your environment or .env.local first.');
  process.exit(1);
}
const mode = key.startsWith('sk_live_') ? 'LIVE' : 'TEST';
const auth = `Basic ${Buffer.from(`${key}:`).toString('base64')}`;

async function api(method, path, body) {
  const res = await fetch(`https://api.paymongo.com/v1${path}`, {
    method,
    headers: { authorization: auth, 'content-type': 'application/json', accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    console.error(`PayMongo said ${res.status}: ${data?.errors?.map((e) => e.detail).join('; ') || res.statusText}`);
    process.exit(1);
  }
  return data;
}

if (process.argv.includes('--list')) {
  const { data = [] } = await api('GET', '/webhooks');
  console.log(`${mode} mode webhooks:`);
  for (const w of data) console.log(`  ${w.id}  ${w.attributes.status.padEnd(8)}  ${w.attributes.url}  [${w.attributes.events.join(', ')}]`);
  if (!data.length) console.log('  (none)');
  process.exit(0);
}

const url = process.argv.slice(2).find((a) => !a.startsWith('--')) || DEFAULT_URL;
if (!/^https:\/\//.test(url)) {
  console.error('The webhook URL must be public and start with https:// (PayMongo cannot reach localhost).');
  process.exit(1);
}

const { data } = await api('POST', '/webhooks', { data: { attributes: { url, events: EVENTS } } });
console.log(`Created ${mode} mode webhook ${data.id}`);
console.log(`  url:    ${data.attributes.url}`);
console.log(`  events: ${data.attributes.events.join(', ')}`);
console.log('');
console.log('Set this as PAYMONGO_WEBHOOK_SECRET (Vercel → Settings → Environment Variables, and .env.local):');
console.log('');
console.log(`  ${data.attributes.secret_key}`);
console.log('');
console.log('Copy it now and keep it private. If it leaks, disable this webhook and create a new one.');
