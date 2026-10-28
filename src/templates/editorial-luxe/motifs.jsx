// Editorial Luxe motifs. Type-led on purpose: a running head, film grain and a quote mark.
import { useId } from 'react';

/**
 * Magazine running head: "04 — Contents" on the left, "Sofía & Rafael · Nº 01" on the right,
 * over a 1px antique-gold hairline. Style with .lx-run / .lx-run-l / .lx-run-r.
 */
export const RunningHead = ({ n, title, right }) => (
  <div className="lx-run" aria-hidden="true">
    <span className="lx-run-l">{`${n} — ${title}`}</span>
    {right && <span className="lx-run-r">{right}</span>}
  </div>
);

/** Film-grain overlay for photos. Put inside a position:relative wrapper. */
export function Grain({ opacity = 0.18, blend = 'multiply', ...p }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, mixBlendMode: blend, pointerEvents: 'none' }}
      {...p}
    >
      <filter id={`g${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${id})`} />
    </svg>
  );
}

/** Opening quote mark (gold), 100 x 80 viewBox. */
export const QuoteMark = (p) => (
  <svg viewBox="0 0 100 80" aria-hidden="true" {...p}>
    <path
      fill="currentColor"
      d="M8 78 C8 46 20 18 44 4 L48 10 C34 22 28 36 28 50 C40 50 46 58 46 66 C46 74 39 80 29 80 C17 80 8 72 8 78 Z M58 78 C58 46 70 18 94 4 L98 10 C84 22 78 36 78 50 C90 50 96 58 96 66 C96 74 89 80 79 80 C67 80 58 72 58 78 Z"
    />
  </svg>
);
