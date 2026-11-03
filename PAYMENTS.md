# Paid publishing (PayMongo + Firebase)

A couple customises a template, pays with **GCash, Maya or QR Ph** through PayMongo, and their invitation goes live straight away at **https://www.knotiva.my/&lt;handle&gt;** (for example `www.knotiva.my/monxkarlla`).

## How it works

```
Customise page ── POST /api/orders ───────────► orders/{id}  status: pending   (price from catalog.js)
      │  uploads photos ──────────────────────► Storage orders/{id}/…          (storage.rules: pending orders only)
      │  POST /api/order-photos ──────────────► orders/{id}.photos
      │  POST /api/checkout ──────────────────► PayMongo Checkout Session (gcash, paymaya, qrph)
      ▼
PayMongo checkout ── pays ──► POST /api/paymongo-webhook (signed) ─┐
      │                                                            ├─► publish (one transaction, idempotent):
      └─ success_url: /<handle>?paid=1&order=… ─► GET /api/confirm ─┘     handles/{handle} + sites/{handle}, order → paid
                                                                          (handle taken meanwhile → paid_handle_conflict)
/<handle> ── reads sites/{handle} ──► renders the template; RSVPs → sites/{handle}/rsvps
```

| Path | What |
| --- | --- |
| `api/orders.js` | Creates a pending order. Checks the template, the handle (rules in `src/lib/handles.js`) and that it is free. |
| `api/handle.js` | `GET /api/handle?h=…`: the live "is this link free?" check. |
| `api/order-photos.js` | Records the uploaded photo URLs on the pending order. Only accepts our bucket and `orders/{id}/`. |
| `api/checkout.js` | Opens the PayMongo Checkout Session and returns `checkoutUrl`. |
| `api/paymongo-webhook.js` | Verifies `Paymongo-Signature`, then publishes on `checkout_session.payment.paid`. |
| `api/confirm.js` | Fallback when the couple arrives before the webhook: asks PayMongo directly. |
| `api/_lib/*` | Shared code (not routes). |
| `src/pages/PublishStep.jsx` | The "Publish your invitation" step on the customise page. |
| `src/pages/SitePage.jsx` | The couple's page at `/:handle`. |
| `firestore.rules`, `storage.rules`, `firebase.json` | Security rules. |

Order status values: `pending` → `paid` (published) or `paid_handle_conflict` (they paid, but someone took the link first; contact them and either publish at another link or refund).

## 1. PayMongo keys

1. Sign up at <https://dashboard.paymongo.com> and complete the business verification (live payments need it; test mode works straight away).
2. **Developers → API keys**: copy the **test secret key** (`sk_test_…`). You don't need the public key.
3. **Settings → Payment methods**: make sure GCash, Maya and QR Ph are enabled for your account. Checkout fails if a method in `payment_method_types` isn't enabled.

## 2. Firebase project

1. Open <https://console.firebase.google.com> and create a project (or reuse one). Google Analytics isn't needed.
2. **Build → Firestore Database → Create database**, in production mode. Pick a region near the Philippines, such as `asia-southeast1`.
3. **Build → Storage → Get started**. Storage needs the Blaze (pay-as-you-go) plan on new projects; a wedding site's usage stays within the free allowance.
4. **Project settings → General → Your apps → Add app → Web** (`</>`). Copy the `firebaseConfig` values into the `VITE_FIREBASE_*` variables below. These are public and safe in the browser; the rules protect the data.
5. **Project settings → Service accounts → Generate new private key**. This downloads a JSON file. It is a **secret**: never commit it.
   - Put its content in `FIREBASE_SERVICE_ACCOUNT` as one line, for example:
     `node -e "console.log(JSON.stringify(require('./key.json')))"`
   - Then delete the downloaded file.

## 3. Environment variables

Every variable is listed with comments in `.env.example`.

| Variable | Where it's used | Secret? |
| --- | --- | --- |
| `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` | browser | no |
| `VITE_SITE_URL` = `https://www.knotiva.my` | browser: the link shown to couples | no |
| `FIREBASE_SERVICE_ACCOUNT` | `/api` (firebase-admin) | **yes** |
| `FIREBASE_STORAGE_BUCKET` (same as `VITE_FIREBASE_STORAGE_BUCKET`) | `/api`: checks photo URLs | no |
| `PAYMONGO_SECRET_KEY` | `/api` | **yes** |
| `PAYMONGO_WEBHOOK_SECRET` | `/api/paymongo-webhook` | **yes** |
| `SITE_URL` = `https://www.knotiva.my` | `/api`: PayMongo's `success_url` and `cancel_url` | no |

- **Locally:** copy `.env.example` to `.env.local` and fill it in. `.env*.local` is git-ignored.
- **On Vercel:** go to **Project → Settings → Environment Variables** and add each one for **Production** (and Preview if you use it). Redeploy afterwards, because `VITE_*` values are baked in at build time.
- Never give a secret a `VITE_` prefix. Vite would ship it to every visitor.

Return links always come from `SITE_URL`, never from the request. The only exception is a request to a `localhost` dev server, which returns to localhost so you can try the flow locally.

## 4. Domain: www.knotiva.my

Couples' links are `https://www.knotiva.my/<handle>`. In **Vercel → Project → Settings → Domains**:

- add `www.knotiva.my` as the primary domain;
- add `knotiva.my` and set it to **redirect to `www.knotiva.my`** (308).

That way `knotiva.my/monxkarlla` also works. Always register the webhook on the `www` address: PayMongo doesn't follow redirects for webhooks.

## 5. Deploy the security rules

```
npm i -g firebase-tools
firebase login
firebase use --add                 # pick your project
firebase deploy --only firestore:rules,storage
```

The first time, the CLI asks to let Storage rules read Firestore. Answer **yes**: `storage.rules` checks that an order is still pending before accepting an upload.

What the rules allow:

- `sites/{handle}`: anyone can read one site by its link. Nobody can list sites, and only the server writes them.
- `sites/{handle}/rsvps`: guests can create a reply with checked fields. Nobody can read, change or delete replies from a browser.
- `orders`, `handles`: server only.
- Storage `orders/{id}/…`: uploads only for image files under 2 MB, and only while that order is pending.

Read RSVPs in the Firebase console (**Firestore → sites → &lt;handle&gt; → rsvps**) until there's a couple dashboard.

## 6. Register the webhook

After the API is deployed on www.knotiva.my, with `PAYMONGO_SECRET_KEY` in `.env.local` (or your shell):

```
node scripts/paymongo-webhook.mjs
# → registers https://www.knotiva.my/api/paymongo-webhook for checkout_session.payment.paid
#   and prints its secret (whsk_…)
```

1. Put the printed secret in `PAYMONGO_WEBHOOK_SECRET`, in both Vercel and `.env.local`, then redeploy.
2. Run `node scripts/paymongo-webhook.mjs --list` to see existing webhooks.

A test key creates a **test-mode** webhook; a live key creates a **live** one. Each has its own secret. You can also do this by hand in the PayMongo dashboard (**Developers → Webhooks**): use the URL above, the event `checkout_session.payment.paid`, and copy the secret.

## 7. Test in test mode

1. Deploy with the **test** key (`sk_test_…`) and the test-mode webhook secret.
2. Open a template → **Make it yours** → fill in the names → **Publish**. Choose a link and enter an email, then **Pay ₱… & publish**.
3. On PayMongo's test checkout, choose GCash, Maya or QR Ph and approve the test payment. You return to `www.knotiva.my/<link>?paid=1`. You see "Confirming your payment…", then your invitation with a "Your invitation is live" note.
4. Check in Firebase: `orders/{id}` is `paid`, and `sites/<link>` and `handles/<link>` exist. Send an RSVP from the page and check `sites/<link>/rsvps`.
5. In PayMongo → **Developers → Webhooks**, the delivery should show `200`.

**Local development:** `npm run dev` only serves the site. To run the `/api` functions locally, use `npx vercel dev` with `.env.local` filled in. PayMongo can't reach localhost, but you don't need the webhook there: after paying, `/api/confirm` asks PayMongo directly and publishes.

## 8. Go live

1. In PayMongo, finish activation and copy the **live** secret key (`sk_live_…`).
2. With the live key, run `node scripts/paymongo-webhook.mjs` again. This creates the live webhook and prints a new secret.
3. In Vercel, set `PAYMONGO_SECRET_KEY` to the live key and `PAYMONGO_WEBHOOK_SECRET` to the live secret, then redeploy.
4. Make one real, small purchase end to end. You can refund it from the PayMongo dashboard.

The webhook handler checks the `li` signature when the key is `sk_live_…` and the `te` signature otherwise. It ignores events from the other mode.

## Good to know

- **Prices** come from `src/templates/catalog.js` on the server (`'₱3,800'` → 380000 centavos). Changing a price there changes what checkout charges.
- **Reserved links** (every site route such as `templates` and `hero`, plus `api`, `admin`, …) are listed in `src/lib/handles.js`. Add new top-level pages there too.
- **Paid but not published?** Look for orders with status `paid_handle_conflict`, or `pending` orders whose `sessionIds` show a paid session in PayMongo. Calling `GET /api/confirm?orderId=…` re-checks safely.
- Abandoned `pending` orders and their photos stay in Firestore and Storage. Clean them up now and then, or add a TTL policy on `orders.createdAt`.
