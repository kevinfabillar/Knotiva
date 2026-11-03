// Maison motifs: the house monogram, the seal, the gate stage and a few hairline icons.
// Everything is decorative (aria-hidden) unless a `title` is passed.
//
// Fonts: the monogram is live text in Noto Serif Display 300 (roman + italic) and the seal text is Archivo
// expanded 500. Both come from the catalog's Google Fonts link. Render the gate only after
// `document.fonts.ready` (see Union.jsx in the spec) or the letters flash in a fallback serif.
import { useId } from 'react';

/* ------------------------------------------------------------------ Monogram geometry */

// Ink boxes of Noto Serif Display 300 capitals, measured from the Google Fonts files:
// [inkLeft, inkRight, inkTop, inkBottom] in 1/1000 em from the left-baseline origin.
// ROMAN is used for the first initial (D.a), ITALIC for the second (D.b).
const ROMAN = { A: [-2, 670, -714, 0], B: [44, 568, -714, 0], C: [57, 551, -724, 10], D: [43, 645, -714, 0], E: [43, 558, -714, 0], F: [43, 525, -714, 0], G: [58, 669, -724, 10], H: [44, 735, -714, 0], I: [43, 304, -714, 0], J: [4, 314, -714, 240], K: [43, 700, -714, 0], L: [43, 558, -714, 0], M: [43, 865, -714, 0], N: [43, 714, -714, 0], O: [57, 659, -725, 10], P: [43, 540, -714, 0], Q: [57, 659, -725, 225], R: [43, 634, -714, 0], S: [60, 468, -724, 10], T: [25, 564, -714, 0], U: [14, 681, -714, 10], V: [0, 653, -714, 0], W: [14, 996, -714, 0], X: [7, 614, -714, 0], Y: [-8, 594, -714, 0], Z: [32, 509, -714, 0] };
const ITALIC = { A: [-62, 621, -714, 0], B: [-14, 601, -714, 0], C: [61, 627, -724, 10], D: [-14, 668, -714, 0], E: [-14, 619, -714, 0], F: [-14, 614, -714, 0], G: [61, 674, -724, 10], H: [-14, 829, -714, 0], I: [-14, 398, -714, 0], J: [-149, 392, -714, 240], K: [-14, 738, -714, 0], L: [-14, 539, -714, 0], M: [-14, 981, -714, 0], N: [-14, 797, -714, 0], O: [61, 695, -725, 11], P: [-14, 586, -714, 0], Q: [61, 695, -725, 218], R: [-14, 588, -714, 0], S: [1, 523, -724, 10], T: [86, 654, -714, 0], U: [109, 787, -714, 10], V: [85, 748, -714, 0], W: [97, 1096, -714, 0], X: [-50, 683, -714, 0], Y: [86, 687, -714, 0], Z: [-21, 600, -714, 0] };

/**
 * The monogram rule. The second initial is italic, 4% larger, 0.05em lower, and overlaps the first by 36% of the
 * narrower glyph. Where it crosses the first initial it is cut free by a gap of 0.022em (`gap` is the SVG stroke
 * width, painted under the fill in the ground colour, so half of it shows).
 */
export const MONO = { scaleB: 1.04, dropB: 50, overlap: 0.36, gap: 44 };

const FONT = "'Noto Serif Display', Didot, 'Bodoni 72', Georgia, serif";
const CAPS = "'Archivo', 'Helvetica Neue', Arial, sans-serif";

/** Accent-free capital used for the metrics (É → E, Ñ → N). The letter shown is still the original. */
const baseOf = (ch) => (ch || 'O').normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().charAt(0);

/**
 * Ink box of one initial as [left, right, top, bottom] in 1/1000 em from its left-baseline origin.
 * `italic` true for the second initial (D.b). The gate uses it to park the letters on the margins at rest:
 *   A.x = margin − inkOf(a)[0] × size / 1000            (ink starts exactly on the left margin)
 *   B.x = w − margin − inkOf(b, true)[1] × size × MONO.scaleB / 1000
 */
export const inkOf = (ch, italic = false) => (italic ? ITALIC : ROMAN)[baseOf(ch)] || (italic ? ITALIC.O : ROMAN.O);

/**
 * Where the two letters go, in a box centred on (0, 0), at font-size 1000 (units are 1/1000 em).
 * Returns { ax, bx, by, W, H }: origin x of A and B (left baseline), A's baseline y (B sits at by + MONO.dropB),
 * and the ink width and height of the pair.
 * Example, M + J: { ax: -634.1, bx: 183.4, by: 207.2, W: 1182.1, H: 1013.6 }.
 */
export function monoLayout(a, b) {
  const ra = ROMAN[baseOf(a)] || ROMAN.O;
  const ib = ITALIC[baseOf(b)] || ITALIC.O;
  const { scaleB: s, dropB: dy, overlap: k } = MONO;
  const wA = ra[1] - ra[0];
  const bl = ib[0] * s;
  const wB = ib[1] * s - bl;
  const ov = k * Math.min(wA, wB);
  const W = wA + wB - ov;
  const x0 = -W / 2;
  const top = Math.min(ra[2], ib[2] * s + dy);
  const bottom = Math.max(ra[3], ib[3] * s + dy);
  return { ax: x0 - ra[0], bx: x0 + wA - ov - bl, by: -(top + bottom) / 2, W, H: bottom - top };
}

const r1 = (v) => Math.round(v * 10) / 10;

/** The two letters at font-size 1000, centred on (0, 0). `gap` is the ground colour (any CSS colour or var()). */
function Letters({ a, b, L, fill, gap }) {
  return (
    <g style={{ fontFamily: FONT, fontWeight: 300 }}>
      <text x={r1(L.ax)} y={r1(L.by)} fontSize="1000" style={{ fill }}>
        {a}
      </text>
      <text
        x={r1(L.bx)}
        y={r1(L.by + MONO.dropB)}
        fontSize={1000 * MONO.scaleB}
        fontStyle="italic"
        strokeWidth={MONO.gap}
        strokeLinejoin="round"
        style={{ fill, stroke: gap, paintOrder: 'stroke' }}
      >
        {b}
      </text>
    </g>
  );
}

/**
 * Palladium foil as an SVG gradient. `sheen` (0–1) slides the bright band across the letters; drive it from
 * scroll, pointer or tilt (see the spec, "Foil that catches the light"). `span` is the width the band crosses.
 * The sheen hook can also move it without a React render: it finds `linearGradient[data-sheen]` inside a foil
 * element and sets gradientTransform = translate((sheen × 2 − 1) × data-span, 0).
 */
export function FoilGradient({ id, span = 1200, sheen = 0.5, x = -600 }) {
  const shift = r1((sheen * 2 - 1) * span);
  return (
    <linearGradient id={id} data-sheen="" data-span={r1(span)} gradientUnits="userSpaceOnUse" x1={x} y1="0" x2={x + span} y2={span * 0.18} spreadMethod="reflect" gradientTransform={`translate(${shift} 0)`}>
      <stop offset="0" stopColor="#8C847C" />
      <stop offset="0.3" stopColor="#C9C2BA" />
      <stop offset="0.46" stopColor="#F4F0EB" />
      <stop offset="0.56" stopColor="#D3CCC4" />
      <stop offset="0.78" stopColor="#A39B93" />
      <stop offset="1" stopColor="#8C847C" />
    </linearGradient>
  );
}

/**
 * The house monogram: first initial roman, second italic, interlocked.
 *   <Monogram a="M" b="J" className="ma-mark" />              ink: currentColor, cut in var(--ma-gap)
 *   <Monogram a="M" b="J" foil sheen={0.4} gap="#561925" />   palladium foil, for bordeaux grounds only
 * Size it with CSS height (the viewBox is tight around the ink, plus `pad`).
 */
export function Monogram({ a, b, foil = false, sheen = 0.5, fill = 'currentColor', gap = 'var(--ma-gap, #F3EEE8)', pad = 40, title, className, style }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const L = monoLayout(a, b);
  const vb = [-L.W / 2 - pad, -L.H / 2 - pad, L.W + pad * 2, L.H + pad * 2].map(r1).join(' ');
  const paint = foil ? `url(#${uid}f)` : fill;
  return (
    <svg viewBox={vb} className={className} style={style} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : 'true'} focusable="false">
      {foil && (
        <defs>
          <FoilGradient id={`${uid}f`} sheen={sheen} span={L.W + 200} x={-L.W / 2 - 100} />
        </defs>
      )}
      <Letters a={a} b={b} L={L} fill={paint} gap={gap} />
    </svg>
  );
}

/** Roman numerals for "Est. MMXXVIII". */
export function toRoman(n) {
  const map = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ];
  let v = Math.max(1, Math.floor(Number(n) || 0));
  let out = '';
  map.forEach(([k, s]) => {
    while (v >= k) {
      out += s;
      v -= k;
    }
  });
  return out;
}

/**
 * The house seal (viewBox 1000): two outer rings, the names on the top arc, "EST. <year>" on the bottom arc,
 * an inner ring and the monogram. Used in the footer (foil, 240px), the reply-card stamp (blind emboss) and
 * the countdown band (foil, 120px).
 *   top    e.g. "MARIEL · JOAQUIN"   bottom e.g. "EST. MMXXVIII"
 *   ink    colour of rings and ring text; with `foil` the monogram and rings use the palladium gradient.
 */
export function Seal({ a, b, top, bottom, foil = false, sheen = 0.5, ink = 'currentColor', gap = 'var(--ma-gap, #F3EEE8)', title, className, style }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const L = monoLayout(a, b);
  const k = Math.min(0.46, 520 / L.W, 520 / L.H);
  const paint = foil ? `url(#${uid}f)` : ink;
  const capStyle = (text) => {
    const n = (text || '').length;
    return { fontFamily: CAPS, fontStretch: '125%', fontWeight: 500, fontSize: n > 24 ? 25 : 30, letterSpacing: n > 18 ? 6 : 10, fill: paint };
  };
  return (
    <svg viewBox="0 0 1000 1000" className={className} style={style} role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : 'true'} focusable="false">
      <defs>
        {/* top arc runs clockwise over the top, bottom arc anticlockwise under it, so both read left to right */}
        <path id={`${uid}t`} d="M 90 500 A 410 410 0 0 1 910 500" />
        <path id={`${uid}b`} d="M 60 500 A 440 440 0 0 0 940 500" />
        {foil && <FoilGradient id={`${uid}f`} sheen={sheen} span={1200} x={-100} />}
      </defs>
      <g fill="none" style={{ stroke: paint }}>
        <circle cx="500" cy="500" r="482" strokeWidth="4" />
        <circle cx="500" cy="500" r="466" strokeWidth="1.4" />
        <circle cx="500" cy="500" r="386" strokeWidth="1.4" />
      </g>
      <circle cx="74" cy="500" r="5" style={{ fill: paint }} />
      <circle cx="926" cy="500" r="5" style={{ fill: paint }} />
      {top && (
        <text style={capStyle(top)}>
          <textPath href={`#${uid}t`} startOffset="50%" textAnchor="middle">
            {top}
          </textPath>
        </text>
      )}
      {bottom && (
        <text style={capStyle(bottom)}>
          <textPath href={`#${uid}b`} startOffset="50%" textAnchor="middle">
            {bottom}
          </textPath>
        </text>
      )}
      <g transform={`translate(500 500) scale(${r1(k * 1000) / 1000})`}>
        <Letters a={a} b={b} L={L} fill={paint} gap={gap} />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ The gate stage ("The Union") */

/**
 * Full-viewport SVG for the gate. A bordeaux lacquer field with the two initials CUT OUT of it (a mask), so the
 * page underneath shows through the letters, plus the same letters in foil drawn on top of the holes.
 * Union.jsx animates the props; this component only draws them.
 *
 *   w, h       viewport size in px
 *   size       font-size of the initials in px (desktop 300, phone 230)
 *   A, B       { x, y } origin (left baseline) of each letter in px. B is drawn at size × MONO.scaleB, italic.
 *   gapOn      0–1: how much of the knockout gap shows (it grows in as the letters lock)
 *   foil       0–1: opacity of the foil letters (fade to 0 to turn the letters into windows)
 *   zoom       fly-through scale around (ox, oy), 1 → zoomEnd (see findAnchor). Applied as a CSS transform on the
 *              <svg> element, so the browser scales the already-drawn layer on the GPU: no repaint per frame, and
 *              no giant glyphs (masked SVG text stops rendering at very large sizes in Chrome).
 *   sheen      0–1: position of the bright band on the foil
 *   fade       0–1: opacity of the whole field (drops to 0 at the very end)
 *   seal       optional { x, y, r, draw, text, textOn }: the ring that draws around the locked monogram.
 *              x, y = monogram centre; r = Math.min(1.1 × size, 0.47 × Math.min(w, h)) (desktop 330, phone 183);
 *              draw 0–1 (stroke-dashoffset); text e.g. "EST. MMXXVIII"
 *              sits inside the bottom of the ring; textOn 0–1 is its opacity. The ring fades with `foil`.
 */
export function UnionStage({ w, h, a, b, size, A, B, gapOn = 0, foil = 1, zoom = 1, ox = 0, oy = 0, sheen = 0.5, fade = 1, seal = null }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const sB = size * MONO.scaleB;
  const gapPx = (MONO.gap / 1000) * size * gapOn;
  const zoomStyle = zoom === 1 ? {} : { transform: `scale(${zoom})`, transformOrigin: `${r1(ox)}px ${r1(oy)}px` };
  const letter = (fill, stroke, k) => (
    <>
      <text key={`a${k}`} x={r1(A.x)} y={r1(A.y)} fontSize={size} style={{ fill }}>
        {a}
      </text>
      <text key={`b${k}`} x={r1(B.x)} y={r1(B.y)} fontSize={sB} fontStyle="italic" strokeWidth={r1(gapPx)} strokeLinejoin="round" style={{ fill, stroke, paintOrder: 'stroke' }}>
        {b}
      </text>
    </>
  );
  const lacquer = `url(#${uid}l)`;
  return (
    <svg className="ma-union-svg" width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true" focusable="false" style={{ display: 'block', opacity: fade, fontFamily: FONT, fontWeight: 300, willChange: 'transform, opacity', ...zoomStyle }}>
      <defs>
        {/* user-space units, so the field and the foil letters' gap stroke share one continuous gradient */}
        <radialGradient id={`${uid}l`} gradientUnits="userSpaceOnUse" cx={r1(w / 2)} cy={r1(h * 0.42)} r={r1(Math.max(w, h) * 0.75)}>
          <stop offset="0" stopColor="#6B2333" />
          <stop offset="0.55" stopColor="#561925" />
          <stop offset="1" stopColor="#3E101A" />
        </radialGradient>
        <FoilGradient id={`${uid}f`} sheen={sheen} span={size * 2.4} x={w / 2 - size * 1.2} />
        <mask id={`${uid}m`} maskUnits="userSpaceOnUse" x="0" y="0" width={w} height={h}>
          <rect width={w} height={h} fill="#fff" />
          {/* holes: black letters; the white stroke keeps the gap solid, exactly like the foil letters.
              Cut only once the foil starts to fade, so no anti-aliased fringe of the page shows at rest. */}
          {foil < 1 && letter('#000', '#fff', 'm')}
        </mask>
      </defs>
      <rect width={w} height={h} fill={lacquer} mask={`url(#${uid}m)`} />
      <g opacity={foil}>
        {letter(`url(#${uid}f)`, lacquer, 'f')}
        {seal && (
          <g fill="none" style={{ stroke: `url(#${uid}f)` }}>
            <circle cx={r1(seal.x)} cy={r1(seal.y)} r={r1(seal.r)} strokeWidth="1.4" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - (seal.draw || 0)} transform={`rotate(-90 ${r1(seal.x)} ${r1(seal.y)})`} />
            <circle cx={r1(seal.x)} cy={r1(seal.y)} r={r1(seal.r * 0.965)} strokeWidth="0.6" pathLength="1" strokeDasharray="1" strokeDashoffset={1 - (seal.draw || 0)} transform={`rotate(-90 ${r1(seal.x)} ${r1(seal.y)})`} />
            {seal.text && (
              <text x={r1(seal.x)} y={r1(seal.y + seal.r * 0.82)} textAnchor="middle" opacity={seal.textOn ?? 1} style={{ fill: '#C9C2BA', stroke: 'none', fontFamily: CAPS, fontStretch: '125%', fontWeight: 500, fontSize: r1(seal.r * 0.06), letterSpacing: r1(seal.r * 0.024) }}>
                {seal.text}
              </text>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}

/**
 * Picks the zoom origin for the fly-through: the point deepest inside the letter-shaped holes (the knockout gap
 * is cut out exactly as in the mask), near the monogram's centre, so the camera flies THROUGH a stroke instead of
 * into the bordeaux. Call once after fonts load, with the final (locked) letter positions and the monogram centre.
 * Returns { x, y, r, zoomEnd } in px: r is the clear radius around the point; zoomEnd is the scale at which that
 * clear disc covers the whole viewport, capped at 48 (the field is fading out by then anyway).
 */
export function findAnchor({ w, h, a, b, size, A, B, center }) {
  const scale = 0.5;
  const c = document.createElement('canvas');
  c.width = Math.ceil(w * scale);
  c.height = Math.ceil(h * scale);
  const g = c.getContext('2d', { willReadFrequently: true });
  g.scale(scale, scale);
  g.fillStyle = '#000';
  g.font = `300 ${size}px ${FONT}`;
  g.fillText(a, A.x, A.y);
  g.font = `italic 300 ${size * MONO.scaleB}px ${FONT}`;
  // cut the gap out of the first letter, then fill the second: the same geometry as the mask's holes
  g.globalCompositeOperation = 'destination-out';
  g.lineWidth = (MONO.gap / 1000) * size;
  g.lineJoin = 'round';
  g.strokeText(b, B.x, B.y);
  g.globalCompositeOperation = 'source-over';
  g.fillText(b, B.x, B.y);
  const { data, width, height } = g.getImageData(0, 0, c.width, c.height);
  const on = (fx, fy) => {
    const x = Math.round(fx);
    const y = Math.round(fy);
    return x >= 0 && y >= 0 && x < width && y < height && data[(y * width + x) * 4 + 3] > 128;
  };
  const D = Math.SQRT1_2;
  const clear = (x, y, r) =>
    on(x + r, y) && on(x - r, y) && on(x, y + r) && on(x, y - r) && on(x + r * D, y + r * D) && on(x - r * D, y - r * D) && on(x + r * D, y - r * D) && on(x - r * D, y + r * D);
  const cx = (center ? center.x : (A.x + B.x) / 2 + size * 0.3) * scale;
  const cy = (center ? center.y : A.y - size * 0.36) * scale;
  let best = { x: cx, y: cy, r: 1, score: -Infinity };
  const step = Math.max(2, Math.round(size * scale * 0.02));
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      if (!on(x, y)) continue;
      let r = 1;
      while (r < 60 && clear(x, y, r)) r += 1;
      const score = r - Math.hypot(x - cx, y - cy) * 0.08;
      if (score > best.score) best = { x, y, r, score };
    }
  }
  const px = best.x / scale;
  const py = best.y / scale;
  const pr = Math.max(1, (best.r - 1) / scale);
  const far = Math.max(Math.hypot(px, py), Math.hypot(w - px, py), Math.hypot(px, h - py), Math.hypot(w - px, h - py));
  return { x: px, y: py, r: pr, zoomEnd: Math.min(48, far / pr) };
}

/* ------------------------------------------------------------------ Small marks and icons */

/** Thin arrow for text links ("View map →"), 22 × 10, stroke currentColor. */
export const Arrow = (p) => (
  <svg viewBox="0 0 22 10" width="22" height="10" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>
    <path d="M1 5h19M16 1.5 20 5l-4 3.5" />
  </svg>
);

/** Speaker with two waves, 18 × 14: the gate's "Best with sound" hint. */
export const Speaker = (p) => (
  <svg viewBox="0 0 18 14" width="18" height="14" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false" {...p}>
    <path d="M1.5 5h3l4-3.2v10.4L4.5 9h-3z" />
    <path d="M11.5 4.2a4 4 0 0 1 0 5.6M13.8 2.2a7 7 0 0 1 0 9.6" />
  </svg>
);

/** Hairline plus that turns into a minus (FAQ), 16 × 16. Rotate the vertical bar to 90° when open. */
export const PlusMinus = ({ open = false, ...p }) => (
  <svg viewBox="0 0 16 16" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" aria-hidden="true" focusable="false" {...p}>
    <path d="M1 8h14" />
    <path d="M8 1v14" style={{ transformOrigin: '8px 8px', transform: open ? 'rotate(90deg)' : 'none', transition: 'transform .45s cubic-bezier(.65,0,.35,1)' }} />
  </svg>
);

/** Copy icon for the gift cards, 14 × 14. */
export const CopyMark = (p) => (
  <svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true" focusable="false" {...p}>
    <rect x="4.5" y="4.5" width="8" height="8" />
    <path d="M9.5 4.5v-3h-8v8h3" />
  </svg>
);
