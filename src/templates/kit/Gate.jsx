import { useEffect, useRef, useState } from 'react';
import { Layer, useInvite } from './context.jsx';
import ScratchReveal from './ScratchReveal.jsx';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Step timings (ms) for each variant: [start, ..., done]. Every step adds a data-step the CSS animates.
const TIMINGS = {
  envelope: [0, 320, 900, 1750, 2450],
  doors: [0, 420, 1900],
  curtain: [0, 380, 1300],
  card: [0, 380, 1500, 2150],
  seal: [0, 750, 1450],
  ribbon: [0, 420, 1150, 1850],
  ticket: [0, 750, 1550],
  scratch: [0, 750],
};

function Petals({ count = 16 }) {
  const items = Array.from({ length: count }, (_, i) => {
    const r = (n) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1;
    return {
      left: `${(r(1) * 100).toFixed(1)}%`,
      size: `${(5 + r(2) * 9).toFixed(1)}px`,
      dur: `${(9 + r(3) * 9).toFixed(1)}s`,
      delay: `${(-r(4) * 14).toFixed(1)}s`,
      drift: `${(r(5) * 60 - 30).toFixed(0)}px`,
      spin: `${(r(6) * 360).toFixed(0)}deg`,
    };
  });
  return (
    <div className="k-petals" aria-hidden="true">
      {items.map((p, i) => (
        <span
          key={i}
          style={{ left: p.left, width: p.size, height: p.size, animationDuration: p.dur, animationDelay: p.delay, '--drift': p.drift, '--spin': p.spin }}
        />
      ))}
    </div>
  );
}

function Bow() {
  return (
    <svg className="k-rb-bow" viewBox="0 0 120 80" aria-hidden="true">
      <path className="k-rb-tail" d="M54 44 L34 78 L44 74 L48 82 L60 48 Z" />
      <path className="k-rb-tail" d="M66 44 L86 78 L76 74 L72 82 L60 48 Z" />
      <path className="k-rb-loop" d="M58 40 C 40 16, 6 14, 8 34 C 10 52, 40 50, 58 42 Z" />
      <path className="k-rb-loop" d="M62 40 C 80 16, 114 14, 112 34 C 110 52, 80 50, 62 42 Z" />
      <path className="k-rb-shade" d="M56 40 C 42 26, 20 24, 18 34 C 30 30, 44 34, 56 41 Z" />
      <path className="k-rb-shade" d="M64 40 C 78 26, 100 24, 102 34 C 90 30, 76 34, 64 41 Z" />
      <rect className="k-rb-knot" x="52" y="33" width="16" height="16" rx="5" />
    </svg>
  );
}

function Barcode() {
  const bars = [3, 1, 2, 1, 1, 3, 1, 2, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2];
  let x = 0;
  return (
    <svg className="k-tk-code" viewBox="0 0 80 26" preserveAspectRatio="none" aria-hidden="true">
      {bars.map((w, i) => {
        const rect = i % 2 === 0 ? <rect key={i} x={x} y="0" width={w} height="26" /> : null;
        x += w + 0.6;
        return rect;
      })}
    </svg>
  );
}

/**
 * The opening screen a guest taps through.
 *
 * variant   'envelope' wax-sealed envelope · 'doors' two doors swing open · 'curtain' full-screen photo lifts away
 *           'card' a folded card opens · 'seal' break a wax seal · 'ribbon' untie a ribbon
 *           'ticket' tear a boarding pass · 'scratch' scratch off the date
 * eyebrow   line above the names, e.g. "You have an invitation from"
 * names     couple names as shown, e.g. "Nathan & Louise"
 * date      optional date line
 * monogram  letters on the seal / door / card front
 * button    label of the open button
 * image     background image (curtain)
 * petals    falling petals in the background
 * ticket    { from: ['SGL', 'Single'], to: ['MRD', 'Married'], flight, airline, gate,
 *             labels: { head, passenger, flight, date, gate, seat, tear } (optional wording),
 *             namesAbove: show the big names above the pass too (default false) }
 * scratch   [{ value: '14', label: 'Feb' }, ...]
 */
export default function Gate({
  variant = 'envelope',
  eyebrow = 'You have an invitation from',
  names,
  date,
  monogram,
  button = 'Open invitation',
  hint = 'Tap to open',
  image,
  petals = false,
  ticket = {},
  scratch = [],
  onOpen,
  onBegin,
}) {
  const { guest } = useInvite();
  const [step, setStep] = useState(0);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const begin = () => {
    if (step) return;
    onBegin?.();
    const times = TIMINGS[variant] || TIMINGS.curtain;
    const scale = reduced() ? 0.25 : 1;
    times.slice(1).forEach((t, i) => {
      const id = setTimeout(() => {
        if (i === times.length - 2) onOpen?.();
        else setStep(i + 2);
      }, t * scale);
      timers.current.push(id);
    });
    setStep(1);
  };

  const [a, b] = (names || '').split(/\s*&\s*/);
  const nameLine = (
    <h1 className={`k-gate-names${(names || '').length > 15 ? ' is-long' : ''}`}>
      {b ? (
        <>
          <span>{a}</span> <em>&amp;</em> <span>{b}</span>
        </>
      ) : (
        names
      )}
    </h1>
  );
  const dear = guest?.name ? <p className="k-gate-dear">Dear {guest.name},</p> : null;
  const tapVariants = ['envelope', 'card', 'seal', 'ribbon', 'ticket'];
  const t = {
    from: ['SGL', 'Single'],
    to: ['MRD', 'Married'],
    flight: 'KN 2027',
    airline: 'Forever Airways',
    gate: 'I DO',
    ...ticket,
  };
  // Optional ticket.labels override the printed words on the pass (merged over the defaults).
  const L = { head: 'Boarding pass', passenger: 'Passenger', flight: 'Flight', date: 'Date', gate: 'Gate', seat: 'Seat', tear: 'Tear to board', ...(ticket.labels || {}) };

  return (
    <Layer>
      <div
        className={`k-gate k-gate--${variant}`}
        data-step={step}
        style={image ? { '--g-image': `url("${image}")` } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={`Invitation from ${names}`}
      >
        {variant === 'curtain' && <div className="k-gate-photo" aria-hidden="true" />}
        {variant === 'doors' && (
          <>
            <div className="k-door k-door--l" aria-hidden="true">
              <span className="k-door-panel" />
              <span className="k-door-handle" />
            </div>
            <div className="k-door k-door--r" aria-hidden="true">
              <span className="k-door-panel" />
              <span className="k-door-handle" />
            </div>
          </>
        )}
        {petals && <Petals />}

        <div className="k-gate-inner">
          {dear}
          <p className="k-gate-eyebrow">{eyebrow}</p>
          {variant === 'card' || (variant === 'ticket' && !ticket.namesAbove) ? null : nameLine}
          {date && !['envelope', 'ticket', 'scratch'].includes(variant) && <p className="k-gate-date">{date}</p>}

          {variant === 'envelope' && (
            <button type="button" className="k-env" onClick={begin} aria-label={button}>
              <span className="k-env-back" />
              <span className="k-env-letter">
                <span className="k-env-letter-text">
                  <small>You&rsquo;re invited</small>
                  {monogram}
                </span>
              </span>
              <span className="k-env-pocket">
                <svg viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
                  <path className="k-env-fill" d="M0 0 L80 56 L160 0 V100 H0 Z" />
                  <path className="k-env-side" d="M0 0 L80 56 L0 100 Z" />
                  <path className="k-env-side" d="M160 0 L80 56 L160 100 Z" />
                  <path className="k-env-fold" d="M0 100 L80 56 L160 100" />
                </svg>
              </span>
              <span className="k-env-flap">
                <svg viewBox="0 0 160 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 0 H160 L86 57 Q80 61 74 57 Z" />
                </svg>
              </span>
              <span className="k-env-seal">
                <span>{monogram}</span>
              </span>
            </button>
          )}

          {variant === 'card' && (
            <button type="button" className="k-card" onClick={begin} aria-label={button}>
              <span className="k-card-inside">
                {nameLine}
                {date && <span className="k-gate-date">{date}</span>}
              </span>
              <span className="k-card-cover">
                <span className="k-card-cover-front">
                  <span className="k-card-mono">{monogram}</span>
                  <span className="k-card-sub">The wedding of</span>
                </span>
                <span className="k-card-cover-back" />
              </span>
            </button>
          )}

          {variant === 'seal' && (
            <button type="button" className="k-seal" onClick={begin} aria-label={button}>
              <span className="k-seal-half k-seal-half--l">
                <span>{monogram}</span>
              </span>
              <span className="k-seal-half k-seal-half--r">
                <span>{monogram}</span>
              </span>
            </button>
          )}

          {variant === 'ribbon' && (
            <button type="button" className="k-rb" onClick={begin} aria-label={button}>
              <span className="k-rb-card">
                <span className="k-rb-mono">{monogram}</span>
                {date && <span className="k-rb-date">{date}</span>}
              </span>
              <span className="k-rb-band k-rb-band--h" />
              <span className="k-rb-band k-rb-band--v" />
              <Bow />
            </button>
          )}

          {variant === 'ticket' && (
            <button type="button" className="k-tk" onClick={begin} aria-label={button}>
              <span className="k-tk-main">
                <span className="k-tk-head">
                  <span>{t.airline}</span>
                  <span>{L.head}</span>
                </span>
                <span className="k-tk-route">
                  <span>
                    <b>{t.from[0]}</b>
                    <small>{t.from[1]}</small>
                  </span>
                  <svg viewBox="0 0 24 24" className="k-tk-plane" aria-hidden="true">
                    <path d="M21 15.5v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V8.5l-8 5v2l8-2.5V18l-2 1.5V21l3.5-1 3.5 1v-1.5L13 18v-5z" />
                  </svg>
                  <span>
                    <b>{t.to[0]}</b>
                    <small>{t.to[1]}</small>
                  </span>
                </span>
                <span className="k-tk-grid">
                  <span>
                    <small>{L.passenger}</small>
                    {guest?.name || 'Our favourite guest'}
                  </span>
                  <span>
                    <small>{L.flight}</small>
                    {t.flight}
                  </span>
                  <span>
                    <small>{L.date}</small>
                    {date}
                  </span>
                  <span>
                    <small>{L.gate}</small>
                    {t.gate}
                  </span>
                </span>
                <span className="k-tk-names">{names}</span>
              </span>
              <span className="k-tk-stub">
                <small>{L.seat}</small>
                <b>{guest?.seats ? `${guest.seats}×` : 'VIP'}</b>
                <Barcode />
                <em>{L.tear}</em>
              </span>
            </button>
          )}

          {variant === 'scratch' && <ScratchReveal items={scratch} button={button} onOpen={begin} />}

          {tapVariants.includes(variant) ? (
            <p className="k-gate-hint">
              <i /> {hint} <i />
            </p>
          ) : (
            variant !== 'scratch' && (
              <button type="button" className="k-gate-btn" onClick={begin}>
                {button}
              </button>
            )
          )}
        </div>
      </div>
    </Layer>
  );
}
