import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { catalogEntry } from '../templates/catalog.js';
import { LOADERS } from '../templates/registry.js';
import { InviteContext } from '../templates/kit/context.jsx';
import { CustomContext } from '../templates/kit/custom.jsx';
import { loadCustom, onCustomChange, toUrls } from '../templates/kit/store.js';
import { useFonts } from './useFonts.js';
import './template-page.css';

const lazyCache = {};
const lazyTemplate = (slug) => {
  if (!lazyCache[slug]) lazyCache[slug] = lazy(LOADERS[slug]);
  return lazyCache[slug];
};

/** The couple's saved edits for this template, kept fresh when the customise page saves. */
function useCustom(slug, enabled) {
  const [custom, setCustom] = useState(null);
  useEffect(() => {
    if (!enabled) return undefined;
    let urls = [];
    let alive = true;
    const load = async () => {
      const next = toUrls(await loadCustom(slug));
      if (!alive) return;
      urls.forEach(URL.revokeObjectURL);
      urls = Object.values(next.photos);
      setCustom(next);
    };
    load();
    const off = onCustomChange((s) => s === slug && load());
    return () => {
      alive = false;
      off();
      urls.forEach(URL.revokeObjectURL);
    };
  }, [slug, enabled]);
  return custom;
}

/**
 * A full, working demo of one template at /templates/:slug.
 *   ?to=Maria&seats=3   personalise the guest name and reserved seats
 *   ?cover=off          skip the opening gate
 *   ?mine=1             show the couple's own edits saved on this device
 *   ?embed=1            inside the customise page: no demo bar, report fields and photos
 *   ?thumb=1            catalogue thumbnail mode (no gate, music, demo bar or animation)
 */
export default function TemplatePage() {
  const { slug } = useParams();
  const [query] = useSearchParams();
  const [barOpen, setBarOpen] = useState(true);
  const meta = catalogEntry(slug);
  useFonts(meta?.fonts);

  const thumb = query.has('thumb');
  const embed = query.has('embed');
  const mine = query.has('mine') || embed;
  const custom = useCustom(slug, mine);
  const registry = useRef({ details: null, photos: [], schedule: '', entourage: '' });

  const seats = Number.parseInt(query.get('seats'), 10);
  const guestName = (query.get('to') || '').trim().slice(0, 40);
  const invite = useMemo(
    () => ({
      mode: thumb ? 'thumb' : 'live',
      gate: query.get('cover') !== 'off' && !embed,
      guest: { name: guestName, seats: Number.isFinite(seats) ? Math.min(10, Math.max(1, seats)) : 2 },
    }),
    [thumb, embed, query, guestName, seats]
  );
  const customValue = useMemo(
    () => ({ details: custom?.details || null, photos: custom?.photos || null, registry: registry.current }),
    [custom]
  );

  // Tell the customise page which fields and photos this template has.
  useEffect(() => {
    if (!embed || window.parent === window) return undefined;
    let sent = '';
    const send = () => {
      const r = registry.current;
      const msg = JSON.stringify({ details: r.details, photos: r.photos, schedule: r.schedule, entourage: r.entourage, gifts: r.gifts });
      if (r.details && msg !== sent) {
        sent = msg;
        window.parent.postMessage({ type: 'knotiva-registry', slug, details: r.details, photos: r.photos, schedule: r.schedule, entourage: r.entourage, gifts: r.gifts }, window.location.origin);
      }
    };
    const id = setInterval(send, 400);
    return () => clearInterval(id);
  }, [embed, slug]);

  useEffect(() => {
    if (!embed) window.scrollTo(0, 0);
    if (meta) document.title = `${meta.name} · Knotiva digital invitation`;
    return () => {
      document.title = 'Knotiva — wedding invitations, start to bow';
    };
  }, [meta, embed]);

  if (!meta || !LOADERS[slug]) return <Navigate to="/#templates" replace />;
  const Template = lazyTemplate(slug);
  const showBar = !thumb && !embed;

  return (
    <InviteContext.Provider value={invite}>
      <CustomContext.Provider value={customValue}>
        <Suspense fallback={<div className="demo-loading" aria-label="Loading invitation" />}>
          {mine && !custom ? <div className="demo-loading" /> : <Template guest={invite.guest} />}
        </Suspense>
      </CustomContext.Provider>
      {showBar &&
        (barOpen ? (
          <div className="demo-bar" role="region" aria-label="Template demo">
            <Link to="/#templates" className="demo-bar-back">
              <span aria-hidden="true">←</span> <span className="demo-bar-long">All templates</span>
              <span className="demo-bar-short">All</span>
            </Link>
            <span className="demo-bar-name">
              {meta.name} <em>{meta.price}</em>
            </span>
            <Link to={`/templates/${meta.slug}/customize`} className="demo-bar-cta">
              Make it yours
            </Link>
            <button type="button" className="demo-bar-x" onClick={() => setBarOpen(false)} aria-label="Hide this bar">
              ×
            </button>
          </div>
        ) : (
          <button type="button" className="demo-bar-pill" onClick={() => setBarOpen(true)}>
            Knotiva
          </button>
        ))}
    </InviteContext.Provider>
  );
}
