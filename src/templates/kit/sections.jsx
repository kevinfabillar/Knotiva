import { useEffect, useRef, useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { Layer, calendarUrl, downloadIcs, mapsUrl, useInvite } from './context.jsx';

/* ------------------------------------------------------------------ Countdown */

function useNow(live) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!live) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [live]);
  return now;
}

/** Days / hours / minutes / seconds until the wedding. */
export function Countdown({ date, className = '', labels = ['Days', 'Hours', 'Minutes', 'Seconds'] }) {
  const { mode } = useInvite();
  const now = useNow(mode !== 'thumb');
  const diff = Math.max(0, new Date(date).getTime() - now);
  const parts = [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60];
  return (
    <div className={`k-count ${className}`} role="timer" aria-label={`${parts[0]} days to go`}>
      {parts.map((n, i) => (
        <div key={labels[i]} className="k-count-cell">
          <b>{String(n).padStart(2, '0')}</b>
          <span>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Add to calendar */

/**
 * "Add to calendar" button with a small menu: Google Calendar, Apple Calendar, Outlook.
 * `event` = { title, start, end, location, details }
 */
export function CalendarButton({ event, className = 'k-btn', label = 'Add to calendar', icon = true }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const key = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', key);
    };
  }, [open]);

  return (
    <div className="k-cal" ref={ref}>
      <button type="button" className={className} onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">
        {icon && <Icon name="calendar" size={16} stroke={1.5} />}
        {label}
      </button>
      {open && (
        <div className="k-cal-menu" role="menu">
          <a role="menuitem" href={calendarUrl(event)} target="_blank" rel="noreferrer" onClick={() => setOpen(false)}>
            Google Calendar
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              downloadIcs(event);
              setOpen(false);
            }}
          >
            Apple Calendar
          </button>
          <button
            role="menuitem"
            type="button"
            onClick={() => {
              downloadIcs(event);
              setOpen(false);
            }}
          >
            Outlook (.ics)
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Venues + map */

function MapDialog({ query, title, onClose }) {
  useEffect(() => {
    const key = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [onClose]);
  return (
    <Layer>
      <div className="k-modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
        <div className="k-modal-card k-map" role="dialog" aria-modal="true" aria-label={`Map: ${title}`}>
          <div className="k-modal-head">
            <p>{title}</p>
            <button type="button" className="k-modal-x" onClick={onClose} aria-label="Close map">
              <Icon name="close" size={20} stroke={1.5} />
            </button>
          </div>
          <iframe title={`Map of ${title}`} src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`} loading="lazy" />
          <a className="k-btn" href={mapsUrl(query)} target="_blank" rel="noreferrer">
            Open in Google Maps
          </a>
        </div>
      </div>
    </Layer>
  );
}

/**
 * Ceremony / reception cards with directions and an in-page map.
 * items = [{ kind, name, address, time, query, icon }]
 */
export function Venues({ items, className = '' }) {
  const [map, setMap] = useState(null);
  return (
    <div className={`k-venues ${className}`}>
      {items.map((v, i) => (
        <article key={v.kind} className={`k-venue rv d${i + 1}`}>
          <Icon name={v.icon || (i ? 'cheers' : 'rings')} size={34} stroke={1.1} className="k-venue-icon" />
          <p className="k-venue-kind">{v.kind}</p>
          <h3 className="k-venue-name">{v.name}</h3>
          {v.time && <p className="k-venue-time">{v.time}</p>}
          <p className="k-venue-address">{v.address}</p>
          <div className="k-venue-actions">
            <button type="button" className="k-link" onClick={() => setMap(v)}>
              View map
            </button>
            <a className="k-link" href={mapsUrl(v.query || `${v.name} ${v.address}`)} target="_blank" rel="noreferrer">
              Directions
            </a>
          </div>
        </article>
      ))}
      {map && <MapDialog query={map.query || `${map.name} ${map.address}`} title={map.name} onClose={() => setMap(null)} />}
    </div>
  );
}

/* ------------------------------------------------------------------ Dress code */

function Swatch({ hex, shape }) {
  if (shape === 'petal') {
    return (
      <svg viewBox="0 0 40 40" className="k-swatch-shape" aria-hidden="true">
        {[0, 72, 144, 216, 288].map((a) => (
          <ellipse key={a} cx="20" cy="11" rx="7.4" ry="10" fill={hex} transform={`rotate(${a} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="4.2" fill="rgba(255,255,255,0.55)" />
      </svg>
    );
  }
  return <span className={`k-swatch-shape k-swatch-shape--${shape}`} style={{ background: hex }} aria-hidden="true" />;
}

/**
 * Colour palette + what to wear.
 * palette = [{ name, hex }]; attire = [{ who, text, icon: 'gown' | 'suit' | 'barong' }]
 * shape   'circle' | 'petal' | 'arch' | 'square'
 */
export function DressCode({ note, palette = [], attire = [], shape = 'circle', className = '' }) {
  return (
    <div className={`k-dress ${className}`}>
      {note && <p className="k-dress-note rv">{note}</p>}
      {palette.length > 0 && (
        <ul className="k-swatches rv d1" aria-label="Colour palette">
          {palette.map((c) => (
            <li key={c.name} className="k-swatch">
              <Swatch hex={c.hex} shape={shape} />
              <span>{c.name}</span>
            </li>
          ))}
        </ul>
      )}
      {attire.length > 0 && (
        <div className="k-attire">
          {attire.map((a, i) => (
            <div key={a.who} className={`k-attire-card rv d${i + 2}`}>
              <Icon name={a.icon || 'suit'} size={46} stroke={1} />
              <h3>{a.who}</h3>
              <p>{a.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Entourage */

/**
 * groups = [{ title, pairs: [[left, right], ...] } | { title, names: [...] }]
 */
export function Entourage({ groups, className = '' }) {
  return (
    <div className={`k-entourage ${className}`}>
      {groups.map((g) => (
        <div key={g.title} className={`k-ent-group rv${g.wide ? ' is-wide' : ''}`}>
          <h3 className="k-ent-title">{g.title}</h3>
          {g.pairs ? (
            <ul className="k-ent-pairs">
              {g.pairs.map(([l, r]) => (
                <li key={l + r}>
                  <span>{l}</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className={`k-ent-names${g.names.length > 3 ? ' is-cols' : ''}`}>
              {g.names.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ Gifts */

function CopyButton({ value }) {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ''));
    } catch {
      /* clipboard can be blocked; the number is still visible to copy by hand */
    }
    setDone(true);
    setTimeout(() => setDone(false), 1800);
  };
  return (
    <button type="button" className={`k-copy${done ? ' is-done' : ''}`} onClick={copy} aria-live="polite">
      <Icon name={done ? 'check' : 'copy'} size={15} stroke={1.6} />
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

/** accounts = [{ label, name, number }] */
export function Gifts({ note, accounts = [], className = '' }) {
  return (
    <div className={`k-gifts ${className}`}>
      {note && <p className="k-gifts-note rv">{note}</p>}
      <div className="k-gift-cards">
        {accounts.map((a, i) => (
          <div key={a.label} className={`k-gift-card rv d${i + 1}`}>
            <p className="k-gift-label">{a.label}</p>
            <p className="k-gift-name">{a.name}</p>
            <p className="k-gift-number">{a.number}</p>
            <CopyButton value={a.number} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ FAQ */

/** items = [{ q, a }] */
export function Faq({ items, className = '', first = 0 }) {
  const [open, setOpen] = useState(first);
  return (
    <ul className={`k-faq ${className}`}>
      {items.map((f, i) => (
        <li key={f.q} className={`rv${open === i ? ' is-open' : ''}`}>
          <button type="button" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
            <span>{f.q}</span>
            <i aria-hidden="true" />
          </button>
          <div className="k-faq-a">
            <p>{f.a}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ Story timeline */

/** items = [{ when, title, text }] */
export function Timeline({ items, className = '' }) {
  return (
    <ol className={`k-timeline ${className}`}>
      {items.map((it, i) => (
        <li key={it.title} className={`rv d${(i % 3) + 1}`}>
          <span className="k-tl-dot" aria-hidden="true" />
          <p className="k-tl-when">{it.when}</p>
          <h3 className="k-tl-title">{it.title}</h3>
          <p className="k-tl-text">{it.text}</p>
        </li>
      ))}
    </ol>
  );
}

/* ------------------------------------------------------------------ Program */

/** items = [{ time, label, icon }] — a vertical order of the day. */
export function Program({ items, className = '' }) {
  return (
    <ol className={`k-program ${className}`}>
      {items.map((it, i) => (
        <li key={it.label} className={`rv d${(i % 4) + 1}`}>
          <span className="k-pg-time">{it.time}</span>
          <span className="k-pg-dot" aria-hidden="true">
            {it.icon && <Icon name={it.icon} size={22} stroke={1.2} />}
          </span>
          <span className="k-pg-label">
            {it.label}
            {it.note && <small>{it.note}</small>}
          </span>
        </li>
      ))}
    </ol>
  );
}
