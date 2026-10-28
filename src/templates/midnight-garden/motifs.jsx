// Midnight Garden motifs. Film language + a few botanical silhouettes. All decorative pieces are aria-hidden.
import { useId } from 'react';

/** A row of 35mm sprocket holes. Style .mg-sprockets in CSS (see spec §3.4). */
export const Sprockets = () => <div className="mg-sprockets" aria-hidden="true" />;

/** Screenplay scene slug, e.g. "Sc. 02 — Int. The garden chapel — Dusk". */
export const Slug = ({ children, className = '' }) => <p className={`mg-slug ${className}`}>{children}</p>;

/** A centred subtitle line, wrapped in curly quotes. */
export const Subtitle = ({ children, className = '' }) => <p className={`mg-sub ${className}`}>{`\u201c${children}\u201d`}</p>;

const LEAVES = [
  'M40 820 C 60 600, 90 420, 160 250 C 120 420, 100 600, 90 820 Z',
  'M160 250 C 200 200, 260 190, 290 210 C 250 230, 200 240, 160 250 Z',
  'M120 420 C 170 380, 240 380, 270 410 C 220 420, 170 425, 120 420 Z',
  'M100 560 C 60 520, 0 520, -20 550 C 30 560, 70 565, 100 560 Z',
  'M140 330 C 100 280, 40 270, 10 290 C 60 310, 100 320, 140 330 Z',
];

/** Botanical silhouette for the gate edges (300 x 800). flip mirrors it for the right side. */
export const LeafShadow = ({ flip = false, ...p }) => (
  <svg viewBox="0 0 300 800" aria-hidden="true" {...p}>
    <g transform={flip ? 'translate(300 0) scale(-1 1)' : undefined}>
      <g fill="#13201a">
        {LEAVES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path fill="#1c2a22" d="M0 700 C 80 640, 160 640, 220 690 C 150 700, 80 705, 0 700 Z" />
      <circle cx="200" cy="200" r="42" fill="#3a0f1a" />
      <circle cx="200" cy="200" r="28" fill="#4a1220" />
      <circle cx="194" cy="194" r="12" fill="#5d1a29" />
    </g>
  </svg>
);

/** Pressed leaf for the wax seal (100 x 100). */
export const SealLeaf = (p) => (
  <svg viewBox="0 0 100 100" aria-hidden="true" {...p}>
    <path
      d="M50 88 C 50 60, 50 40, 50 14 M50 30 C 40 24, 32 26, 28 32 M50 30 C 60 24, 68 26, 72 32 M50 48 C 38 42, 28 46, 24 54 M50 48 C 62 42, 72 46, 76 54 M50 66 C 40 62, 32 66, 30 72 M50 66 C 60 62, 68 66, 70 72"
      fill="none"
      stroke="#1a0409"
      strokeOpacity=".35"
      strokeWidth="2"
    />
  </svg>
);

/** Film-grain overlay. Put inside a position:relative wrapper. */
export function Grain({ opacity = 0.2, blend = 'screen', ...p }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity, mixBlendMode: blend, pointerEvents: 'none' }} {...p}>
      <filter id={`g${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#g${id})`} />
    </svg>
  );
}
