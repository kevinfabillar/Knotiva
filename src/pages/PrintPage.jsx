import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { catalogEntry } from '../templates/catalog.js';
import { LOADERS } from '../templates/registry.js';
import { loadCustom, toUrls } from '../templates/kit/store.js';
import { GIFT_QR, parseEntourage, parseGifts, parseSchedule } from '../templates/kit/custom.jsx';
import { entourage as sampleEntourage, gifts as sampleGifts } from '../templates/kit/demo.js';
import { useFonts } from './useFonts.js';
import '../templates/shared/base.css';
import '../templates/kit/kit.css';
import './print.css';

const SIZES = {
  '5x7': { label: '5 × 7 in', w: '5in', h: '7in' },
  a5: { label: 'A5 (148 × 210 mm)', w: '148mm', h: '210mm' },
  '4x6': { label: '4 × 6 in', w: '4in', h: '6in' },
};

/** Shrinks its text until the content fits the card. */
function Fit({ className, deps, children }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let scale = 1;
    el.style.setProperty('--fit', '1');
    for (let i = 0; i < 24 && el.scrollHeight > el.clientHeight + 1; i += 1) {
      scale -= 0.04;
      el.style.setProperty('--fit', String(scale));
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** "16:30" from an ISO string, without converting time zones. */
function timeOf(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = Number(m[1]);
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}

function Ornament() {
  return (
    <svg className="pr-orn" viewBox="0 0 120 12" aria-hidden="true">
      <path d="M2 6 H48 M72 6 H118" stroke="currentColor" strokeWidth="0.8" />
      <path d="M60 1 L65 6 L60 11 L55 6 Z" fill="none" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="51" cy="6" r="1.2" fill="currentColor" />
      <circle cx="69" cy="6" r="1.2" fill="currentColor" />
    </svg>
  );
}

/** /templates/:slug/print — a printable invitation and details card in the template's style. */
export default function PrintPage() {
  const { slug } = useParams();
  const meta = catalogEntry(slug);
  useFonts(meta?.fonts);
  const [tpl, setTpl] = useState(null);
  const [custom, setCustom] = useState(null);
  const [size, setSize] = useState('5x7');
  const [showPhoto, setShowPhoto] = useState(true);
  const [showBack, setShowBack] = useState(true);
  const [showDay, setShowDay] = useState(true);
  const [showEnt, setShowEnt] = useState(true);
  const [message, setMessage] = useState('request the pleasure of your company at the celebration of their marriage');
  const [extra, setExtra] = useState('Reception to follow');

  useEffect(() => {
    if (!LOADERS[slug]) return undefined;
    let urls = [];
    LOADERS[slug]().then((m) => setTpl(m.meta));
    loadCustom(slug).then((r) => {
      const c = toUrls(r);
      urls = Object.values(c.photos);
      setCustom(c);
    });
    return () => urls.forEach(URL.revokeObjectURL);
  }, [slug]);

  useEffect(() => {
    if (meta) document.title = `${meta.name} · printable invitation`;
  }, [meta]);

  if (!meta || !LOADERS[slug]) return <Navigate to="/#templates" replace />;
  if (!tpl || !custom) return <div className="pr-loading">Preparing your printable invitation…</div>;

  const D = { ...tpl.defaults };
  Object.entries(custom.details || {}).forEach(([k, v]) => {
    if (typeof v === 'string' && v.trim() && k in D) D[k] = v.trim();
  });
  const photo = custom.photos[tpl.cover] || tpl.cover;
  const S = SIZES[size];
  const time = timeOf(D.start);
  const schedText = custom.details?.schedule;
  const schedule = schedText && schedText.trim() ? parseSchedule(schedText, tpl.schedule) : tpl.schedule || [];
  const entText = custom.details?.entourage;
  const groups = entText && entText.trim() ? parseEntourage(entText) : sampleEntourage(D);
  const dress = tpl.dress || {};
  const giftDefaults = sampleGifts(D);
  const giftNote = custom.details?.giftNote?.trim() || giftDefaults.note;
  const giftText = custom.details?.giftAccounts;
  const accounts = giftText && giftText.trim() ? parseGifts(giftText) : giftDefaults.accounts;
  const giftQr = custom.photos[GIFT_QR];
  const cardProps = (extra) => ({ className: `tpl ${tpl.className} pr-card ${extra}`, style: { '--pw': S.w, '--ph': S.h } });

  return (
    <div className="pr">
      <style>{`@page { size: ${S.w} ${S.h}; margin: 0; }`}</style>

      <div className="pr-ui">
        <Link to={`/templates/${slug}/customize`} className="pr-back">
          ← Edit details
        </Link>
        <h1>Printable invitation</h1>
        <p className="pr-lead">
          Made from your {meta.name} details. Print at home or send the PDF to a print shop: in the print window choose “Save as PDF”, set margins to “None” and turn on “Background graphics”.
        </p>
        <label className="pr-field">
          <span>Card size</span>
          <select value={size} onChange={(e) => setSize(e.target.value)}>
            {Object.entries(SIZES).map(([k, v]) => (
              <option key={k} value={k}>
                {v.label}
              </option>
            ))}
          </select>
        </label>
        <label className="pr-field">
          <span>Invitation wording</span>
          <textarea rows="2" value={message} onChange={(e) => setMessage(e.target.value)} />
        </label>
        <label className="pr-field">
          <span>Extra line</span>
          <input value={extra} onChange={(e) => setExtra(e.target.value)} />
        </label>
        <label className="pr-check">
          <input type="checkbox" checked={showPhoto} onChange={(e) => setShowPhoto(e.target.checked)} /> Show photo on the invitation
        </label>
        <label className="pr-check">
          <input type="checkbox" checked={showDay} onChange={(e) => setShowDay(e.target.checked)} /> Schedule &amp; dress code card
        </label>
        <label className="pr-check">
          <input type="checkbox" checked={showEnt} onChange={(e) => setShowEnt(e.target.checked)} /> Entourage card
        </label>
        <label className="pr-check">
          <input type="checkbox" checked={showBack} onChange={(e) => setShowBack(e.target.checked)} /> Gifts card (GCash / bank)
        </label>
        <button type="button" className="pr-print" onClick={() => window.print()}>
          Print or save as PDF
        </button>
      </div>

      <div className="pr-sheets">
        <article className={`tpl ${tpl.className} pr-card${showPhoto ? ' has-photo' : ''}`} style={{ '--pw': S.w, '--ph': S.h }}>
          <div className="pr-frame">
            {showPhoto && (
              <div className="pr-photo">
                <img src={photo} alt="" />
              </div>
            )}
            <div className="pr-text">
              <p className="pr-eyebrow">Together with their families</p>
              <h2 className="pr-names">
                <span>{D.a}</span>
                <em>&amp;</em>
                <span>{D.b}</span>
              </h2>
              <p className="pr-msg">{message}</p>
              <Ornament />
              <p className="pr-date">{D.date}</p>
              {time && <p className="pr-time">at {time}</p>}
              <p className="pr-venue">{D.venue}</p>
              <p className="pr-place">{D.place}</p>
              {extra && <p className="pr-extra">{extra}</p>}
            </div>
          </div>
        </article>

        {showDay && (
          <article {...cardProps('pr-card--day')}>
            <div className="pr-frame">
              <Fit className="pr-text pr-fit" deps={[schedule, dress, size]}>
                <h2 className="pr-back-title">Order of the day</h2>
                <p className="pr-date">{D.date}</p>
                <ol className="pr-sched">
                  {schedule.map((it, i) => (
                    <li key={`${it.time}-${i}`}>
                      <b>{it.time}</b>
                      <span>
                        {it.label || it.tag}
                        {(it.sub || it.note) && <small>{it.sub || it.note}</small>}
                      </span>
                    </li>
                  ))}
                </ol>
                <Ornament />
                <h3 className="pr-sub">Dress code</h3>
                {dress.note && <p className="pr-msg pr-small">{dress.note}</p>}
                {tpl.palette?.length > 0 && (
                  <ul className="pr-swatches">
                    {tpl.palette.map((c) => (
                      <li key={c.name}>
                        <i style={{ background: c.hex }} />
                        <span>{c.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {dress.attire?.map((a) => (
                  <p key={a.who} className="pr-attire">
                    <b>{a.who}:</b> {a.text}
                  </p>
                ))}
              </Fit>
            </div>
          </article>
        )}

        {showEnt && groups.length > 0 && (
          <article {...cardProps('pr-card--ent')}>
            <div className="pr-frame">
              <Fit className="pr-text pr-fit" deps={[groups, size]}>
                <h2 className="pr-back-title">The Entourage</h2>
                <div className="pr-ent">
                  {groups.map((g) => (
                    <div key={g.title} className={`pr-ent-group${g.pairs ? ' is-pairs' : ''}`}>
                      <h3>{g.title}</h3>
                      {g.pairs
                        ? g.pairs.map(([l, r]) => (
                            <p key={l + r} className="pr-ent-pair">
                              <span>{l}</span>
                              <span>{r}</span>
                            </p>
                          ))
                        : g.names.map((n) => <p key={n}>{n}</p>)}
                    </div>
                  ))}
                </div>
              </Fit>
            </div>
          </article>
        )}

        {showBack && (
          <article {...cardProps('pr-card--gifts')}>
            <div className="pr-frame">
              <Fit className="pr-text pr-fit pr-gifts" deps={[giftNote, accounts, giftQr, size]}>
                <p className="pr-mono">
                  {D.a[0]}
                  <em>&amp;</em>
                  {D.b[0]}
                </p>
                <h2 className="pr-back-title">Gifts</h2>
                <p className="pr-msg">{giftNote}</p>
                {giftQr && <img className="pr-gift-qr" src={giftQr} alt="Payment QR code" />}
                <ul className="pr-accounts">
                  {accounts.map((acc) => (
                    <li key={acc.label + acc.number}>
                      <span>{acc.label}</span>
                      {acc.name && <small>{acc.name}</small>}
                      <b>{acc.number}</b>
                    </li>
                  ))}
                </ul>
                <Ornament />
                <p className="pr-date">{D.date}</p>
              </Fit>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}
