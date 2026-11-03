import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { catalogEntry } from '../templates/catalog.js';
import { LOADERS } from '../templates/registry.js';
import { InviteContext } from '../templates/kit/context.jsx';
import { CustomContext } from '../templates/kit/custom.jsx';
import { toUrls } from '../templates/kit/store.js';
import { handleProblem } from '../lib/handles.js';
import { useFonts } from './useFonts.js';
import { siteHost, siteUrl } from '../lib/site-url.js';
import './template-page.css';
import './site.css';

const lazyCache = {};
const lazyTemplate = (slug) => {
  if (!lazyCache[slug]) lazyCache[slug] = lazy(LOADERS[slug]);
  return lazyCache[slug];
};

const live = () => import('../lib/live.js');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const CONFIRM_TRIES = 20; // ~1 minute at 3 s

/**
 * A couple's published invitation at /:handle (knotiva.my/monxkarlla).
 *   ?to=Maria&seats=3        personalise the guest name and reserved seats
 *   ?cover=off               skip the opening gate
 *   ?paid=1&order=<orderId>  just back from PayMongo: confirm the payment, then show the invitation
 */
export default function SitePage() {
  const { handle: raw } = useParams();
  const handle = raw.toLowerCase();
  const [query, setQuery] = useSearchParams();
  // Read once: the address is cleaned up after the invitation shows, and that mustn't reload it.
  const [{ paid, orderId }] = useState(() => ({ paid: query.get('paid') === '1', orderId: query.get('order') || '' }));
  const [state, setState] = useState({ phase: 'loading' });
  const [justPaid, setJustPaid] = useState(paid);
  const run = useRef(0);

  const load = useCallback(async () => {
    const id = ++run.current;
    const alive = () => id === run.current;
    if (handleProblem(handle)) return setState({ phase: 'missing' });
    setState({ phase: 'loading' });
    try {
      const api = await live();
      let site = await api.loadSite(handle);
      if (!alive()) return undefined;
      if (site) return setState({ phase: 'ready', site });
      if (!paid) return setState({ phase: 'missing' });

      // Back from checkout but not published yet: ask the server to check with PayMongo, briefly.
      setState({ phase: 'confirming' });
      for (let i = 0; i < CONFIRM_TRIES && alive(); i += 1) {
        let status = 'pending';
        if (orderId) {
          const res = await fetch(`/api/confirm?orderId=${encodeURIComponent(orderId)}`).catch(() => null);
          status = (await res?.json().catch(() => null))?.status || 'pending';
        }
        if (status === 'paid_handle_conflict') return alive() && setState({ phase: 'conflict' });
        if (status === 'paid' || !orderId) {
          site = await api.loadSite(handle);
          if (site) return alive() && setState({ phase: 'ready', site });
        }
        await wait(3000);
      }
      return alive() && setState({ phase: 'slow' });
    } catch (err) {
      console.error(err);
      return alive() && setState({ phase: 'error' });
    }
  }, [handle, paid, orderId]);

  useEffect(() => {
    load();
    return () => {
      run.current += 1;
    };
  }, [load]);

  // Once the invitation shows, drop ?paid/&order from the address so the link they copy is clean.
  useEffect(() => {
    if (state.phase !== 'ready' || !query.has('paid')) return;
    const next = new URLSearchParams(query);
    next.delete('paid');
    next.delete('order');
    setQuery(next, { replace: true });
  }, [state.phase, query, setQuery]);

  if (raw !== handle) return <Navigate to={`/${handle}${window.location.search}`} replace />;
  if (state.phase === 'ready') return <LiveInvitation handle={handle} site={state.site} justPaid={justPaid} onDismiss={() => setJustPaid(false)} />;
  if (state.phase === 'loading') return <div className="demo-loading" aria-label="Loading invitation" />;
  return <SiteNotice phase={state.phase} handle={handle} onRetry={load} />;
}

function LiveInvitation({ handle, site, justPaid, onDismiss }) {
  const [query] = useSearchParams();
  const meta = catalogEntry(site.slug);
  useFonts(meta?.fonts);

  const seats = Number.parseInt(query.get('seats'), 10);
  const guestName = (query.get('to') || '').trim().slice(0, 40);
  const invite = useMemo(
    () => ({
      mode: 'live',
      gate: query.get('cover') !== 'off',
      guest: { name: guestName, seats: Number.isFinite(seats) ? Math.min(10, Math.max(1, seats)) : 2 },
    }),
    [query, guestName, seats]
  );
  const custom = useMemo(() => {
    const { details, photos } = toUrls({ details: site.details, photos: site.photos });
    return {
      details,
      photos,
      registry: null,
      rsvp: { submit: async (reply) => (await live()).saveRsvp(handle, reply) },
    };
  }, [site, handle]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const names = site.names || [site.details?.a, site.details?.b].filter(Boolean).join(' & ');
    document.title = names ? `${names} · Wedding invitation` : 'Wedding invitation · Knotiva';
    return () => {
      document.title = 'Knotiva — wedding invitations, start to bow';
    };
  }, [site]);

  if (!meta || !LOADERS[site.slug]) return <SiteNotice phase="error" handle={handle} />;
  const Template = lazyTemplate(site.slug);

  return (
    <InviteContext.Provider value={invite}>
      <CustomContext.Provider value={custom}>
        <Suspense fallback={<div className="demo-loading" aria-label="Loading invitation" />}>
          <Template guest={invite.guest} />
        </Suspense>
      </CustomContext.Provider>
      {justPaid && <LiveToast handle={handle} onDismiss={onDismiss} />}
    </InviteContext.Provider>
  );
}

/** Shown once to the couple right after paying: the invitation is live, here's the link. */
function LiveToast({ handle, onDismiss }) {
  const [copied, setCopied] = useState(false);
  const url = `${siteUrl()}/${handle}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy your invitation link:', url);
    }
  };
  return (
    <div className="site-toast" role="status">
      <span className="site-toast-dot" aria-hidden="true" />
      <span className="site-toast-text">
        <b>Your invitation is live</b>
        <em>{url.replace(/^https?:\/\//, '')}</em>
      </span>
      <button type="button" className="site-toast-copy" onClick={copy}>
        {copied ? 'Copied' : 'Copy link'}
      </button>
      <button type="button" className="site-toast-x" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}

const NOTICES = {
  confirming: {
    eyebrow: 'Payment received?',
    title: 'Confirming your payment…',
    body: 'We’re checking with PayMongo and putting your invitation online. This usually takes a few seconds — please keep this page open.',
  },
  slow: {
    eyebrow: 'Almost there',
    title: 'Still confirming your payment',
    body: 'PayMongo hasn’t confirmed the payment yet. If you completed it, your invitation will go live as soon as they do — check again in a minute. You won’t be charged twice.',
  },
  conflict: {
    eyebrow: 'Payment received',
    title: 'That link was taken a moment ago',
    body: 'Your payment went through, but someone published at this link just before you. Don’t worry — we’ll contact you by email to set up your invitation at another link, or refund you.',
  },
  error: {
    eyebrow: 'Something went wrong',
    title: 'We couldn’t load this invitation',
    body: 'Please check your connection and try again.',
  },
  missing: {
    eyebrow: '404',
    title: 'We couldn’t find this invitation',
    body: 'Please check the link with the couple — it may have a typo.',
  },
};

function SiteNotice({ phase, handle, onRetry }) {
  const n = NOTICES[phase] || NOTICES.missing;
  useEffect(() => {
    document.title = `${n.title} · Knotiva`;
  }, [n.title]);
  return (
    <main className={`site-notice site-notice--${phase}`}>
      <Link to="/" className="site-notice-brand">
        Knotiva
      </Link>
      <div className="site-notice-card" aria-live="polite">
        {phase === 'confirming' ? <span className="site-spinner" aria-hidden="true" /> : <span className="site-knot" aria-hidden="true">∞</span>}
        <p className="site-notice-eyebrow">{n.eyebrow}</p>
        <h1>{n.title}</h1>
        <p className="site-notice-link">
          {siteHost()}/{handle}
        </p>
        <p className="site-notice-body">{n.body}</p>
        <div className="site-notice-actions">
          {(phase === 'slow' || phase === 'error') && onRetry && (
            <button type="button" className="site-btn" onClick={onRetry}>
              Check again
            </button>
          )}
          {phase !== 'confirming' && (
            <Link to="/#templates" className={`site-btn${phase === 'slow' || phase === 'error' ? ' site-btn--ghost' : ''}`}>
              Browse invitation templates
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}
