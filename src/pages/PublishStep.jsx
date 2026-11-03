import { useEffect, useMemo, useRef, useState } from 'react';
import { GIFT_QR } from '../templates/kit/custom.jsx';
import { compressImage } from '../templates/kit/store.js';
import { handleProblem, normalizeHandle } from '../lib/handles.js';
import { siteHost } from '../lib/site-url.js';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_UPLOAD = 1.9 * 1024 * 1024; // storage.rules allow < 2 MB

async function post(path, body) {
  const res = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || 'Something went wrong. Please try again.');
    err.field = data.field;
    throw err;
  }
  return data;
}

/** Makes sure a photo fits under the Storage limit, shrinking it further if needed. */
async function fitForUpload(blob) {
  let out = blob;
  for (const max of [1600, 1280, 1000]) {
    if (out.size < MAX_UPLOAD && /^image\//.test(out.type)) return out;
    out = await compressImage(blob, max);
  }
  if (out.size >= MAX_UPLOAD) throw new Error('One of your photos is too large to upload. Please choose a smaller one.');
  return out;
}

const uploadName = (src, i) => (src === GIFT_QR ? 'gift-qr.jpg' : `${String(i + 1).padStart(2, '0')}-${normalizeHandle(src.split('/').pop().replace(/\.\w+$/, '')) || 'photo'}.jpg`);

/**
 * "Publish your invitation": pick a link, give an email, pay with PayMongo. The order is created on the
 * server (price from the catalogue), photos go to Firebase Storage, then we hand over to checkout.
 */
export default function PublishStep({ slug, meta, record, defaults, cancelled }) {
  const names = useMemo(() => {
    const pick = (k) => (record.details?.[k] || '').trim() || defaults?.[k] || '';
    return [pick('a'), pick('b')].filter(Boolean).join(' & ');
  }, [record.details, defaults]);
  const suggestion = useMemo(() => {
    const a = (record.details?.a || '').trim();
    const b = (record.details?.b || '').trim();
    return a && b ? normalizeHandle(`${a}x${b}`) : '';
  }, [record.details]);

  const [handle, setHandle] = useState('');
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState('');
  const [avail, setAvail] = useState({ state: 'idle', reason: '' });
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const checkSeq = useRef(0);
  const formRef = useRef(null);

  // Back from a cancelled checkout: bring them straight back to this step.
  useEffect(() => {
    if (cancelled) formRef.current?.scrollIntoView({ block: 'start' });
  }, [cancelled]);

  const value = touched ? handle : handle || suggestion;
  const host = siteHost();

  // Live availability: local rules first, then ask the server (debounced).
  useEffect(() => {
    const seq = ++checkSeq.current;
    if (!value) return setAvail({ state: 'idle', reason: '' });
    const problem = handleProblem(value);
    if (problem) return setAvail({ state: 'invalid', reason: problem });
    setAvail({ state: 'checking', reason: '' });
    const id = setTimeout(async () => {
      try {
        const res = await fetch(`/api/handle?h=${encodeURIComponent(value)}`);
        const data = await res.json();
        if (seq !== checkSeq.current) return;
        if (!res.ok) throw new Error(data.error);
        setAvail(data.available ? { state: 'ok', reason: '' } : { state: 'taken', reason: data.reason || 'That link is already taken.' });
      } catch {
        if (seq === checkSeq.current) setAvail({ state: 'offline', reason: 'We couldn’t check this link right now. You can still continue.' });
      }
    }, 350);
    return () => clearTimeout(id);
  }, [value]);

  const emailOk = EMAIL.test(email.trim());
  const ready = (avail.state === 'ok' || avail.state === 'offline') && emailOk && !busy;

  const publish = async (e) => {
    e.preventDefault();
    if (!ready) return;
    setError('');
    try {
      setBusy('Creating your order…');
      const { orderId } = await post('/api/orders', { slug, handle: value, email: email.trim(), names, details: record.details || {} });

      const blobs = Object.entries(record.photos || {}).filter(([, b]) => b instanceof Blob);
      if (blobs.length) {
        const { uploadPhoto } = await import('../lib/upload.js');
        const photos = {};
        for (let i = 0; i < blobs.length; i += 1) {
          setBusy(`Uploading photos · ${i + 1} of ${blobs.length}`);
          const [src, blob] = blobs[i];
          photos[src] = await uploadPhoto(orderId, uploadName(src, i), await fitForUpload(blob));
        }
        setBusy('Saving your photos…');
        await post('/api/order-photos', { orderId, photos });
      }

      setBusy('Opening secure checkout…');
      const { checkoutUrl } = await post('/api/checkout', { orderId });
      window.location.assign(checkoutUrl);
    } catch (err) {
      if (err.field === 'handle') setAvail({ state: 'taken', reason: err.message });
      setError(err.field === 'handle' ? '' : err.message || 'Something went wrong. Please try again.');
      setBusy('');
    }
  };

  const mark = { ok: '✓', taken: '✕', invalid: '!', offline: '?', checking: '…' }[avail.state];
  const status =
    avail.state === 'ok' ? 'This link is available.' : avail.state === 'checking' ? 'Checking…' : avail.reason || 'Letters, numbers and hyphens, 3–40 characters.';

  return (
    <form ref={formRef} className="cz-sec cz-publish" id="publish" onSubmit={publish} noValidate>
      <h2>
        Publish your invitation · <span className="cz-price">{meta.price}</span>
      </h2>
      <p className="cz-hint">
        Put your invitation online at its own link, ready to send to guests. Pay once with GCash, Maya or QR Ph — it goes live the moment payment is confirmed.
      </p>

      {cancelled && <p className="cz-note">Payment was cancelled — nothing was charged. You can try again whenever you’re ready.</p>}

      <label className="cz-field">
        <span>Your link</span>
        <div className={`cz-handle is-${avail.state}`}>
          <b className="cz-handle-host">{host}/</b>
          <input
            value={value}
            onChange={(e) => {
              setTouched(true);
              setHandle(normalizeHandle(e.target.value));
            }}
            placeholder="annaxmiguel"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            maxLength={40}
            disabled={Boolean(busy)}
            aria-describedby="cz-avail"
          />
        </div>
      </label>
      <p id="cz-avail" className={`cz-avail is-${avail.state}`} aria-live="polite">
        {mark && <i aria-hidden="true">{mark}</i>}
        {status}
      </p>

      <label className="cz-field">
        <span>Email for your receipt</span>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" disabled={Boolean(busy)} />
      </label>

      <div className="cz-linkcard" aria-label="Your invitation link">
        <span>Your guests will open</span>
        <b>
          {host}/<em>{value || 'your-link'}</em>
        </b>
        <small>Add ?to=Name&amp;seats=2 to personalise each guest’s link.</small>
      </div>

      {error && (
        <p className="cz-error" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="cz-btn cz-pay" disabled={!ready}>
        {busy ? (
          <>
            <span className="cz-spin" aria-hidden="true" /> {busy}
          </>
        ) : (
          `Pay ${meta.price} & publish`
        )}
      </button>
      <p className="cz-paynote">GCash · Maya · QR Ph — secure checkout by PayMongo</p>
    </form>
  );
}
