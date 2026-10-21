import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import { catalogEntry, fontsHref } from '../templates/catalog.js';
import { LOADERS } from '../templates/registry.js';
import { InviteContext } from '../templates/kit/context.jsx';
import './template-page.css';

const lazyCache = {};
const lazyTemplate = (slug) => {
  if (!lazyCache[slug]) lazyCache[slug] = lazy(LOADERS[slug]);
  return lazyCache[slug];
};

function useFonts(families) {
  useEffect(() => {
    if (!families?.length) return;
    const href = fontsHref(families);
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    document.head.appendChild(link);
  }, [families]);
}

/**
 * A full, working demo of one template at /templates/:slug.
 *   ?to=Maria&seats=3   personalise the guest name and reserved seats
 *   ?cover=off          skip the opening gate
 *   ?thumb=1            catalogue thumbnail mode (no gate, music, demo bar or animation)
 */
export default function TemplatePage() {
  const { slug } = useParams();
  const [query] = useSearchParams();
  const [barOpen, setBarOpen] = useState(true);
  const meta = catalogEntry(slug);
  useFonts(meta?.fonts);

  const thumb = query.has('thumb');
  const seats = Number.parseInt(query.get('seats'), 10);
  const guestName = (query.get('to') || '').trim().slice(0, 40);
  const invite = useMemo(
    () => ({
      mode: thumb ? 'thumb' : 'live',
      gate: query.get('cover') !== 'off',
      guest: { name: guestName, seats: Number.isFinite(seats) ? Math.min(10, Math.max(1, seats)) : 2 },
    }),
    [thumb, query, guestName, seats]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    if (meta) document.title = `${meta.name} · Knotiva digital invitation`;
    return () => {
      document.title = 'Knotiva — wedding invitations, start to bow';
    };
  }, [meta]);

  if (!meta || !LOADERS[slug]) return <Navigate to="/#templates" replace />;
  const Template = lazyTemplate(slug);

  return (
    <InviteContext.Provider value={invite}>
      <Suspense fallback={<div className="demo-loading" aria-label="Loading invitation" />}>
        <Template guest={invite.guest} />
      </Suspense>
      {!thumb &&
        (barOpen ? (
          <div className="demo-bar" role="region" aria-label="Template demo">
            <Link to="/#templates" className="demo-bar-back">
              <span aria-hidden="true">←</span> <span className="demo-bar-long">All templates</span>
              <span className="demo-bar-short">All</span>
            </Link>
            <span className="demo-bar-name">
              {meta.name} <em>{meta.price}</em>
            </span>
            <Link to={`/?template=${meta.slug}#contact`} className="demo-bar-cta">
              Use this design
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
