// Small decorative pieces shared by the paper-style templates.

// Deterministic pseudo-random numbers, so the torn edge looks the same on every render.
function rand(seed) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function tornPath(seed, depth) {
  const r = rand(seed);
  let d = 'M0 40 L0 ' + (depth * r()).toFixed(1);
  for (let x = 0; x <= 1000; x += 6 + r() * 10) {
    d += ` L${x.toFixed(1)} ${(depth * (0.15 + r() * 0.85)).toFixed(1)}`;
  }
  return d + ' L1000 ' + (depth * r()).toFixed(1) + ' L1000 40 Z';
}

/**
 * A ripped-paper edge laid over the bottom (or top, with `flip`) of a section.
 * `color` is the colour of the paper that tears into view.
 */
export function TornEdge({ color, fiber = '#fbf8f2', flip = false, seed = 7, height = 28, className = '' }) {
  return (
    <svg
      className={`torn-edge ${className}`}
      viewBox="0 0 1000 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: 0,
        width: '100%',
        height,
        [flip ? 'top' : 'bottom']: -1,
        transform: flip ? 'scaleY(-1)' : undefined,
        zIndex: 2,
        pointerEvents: 'none',
        filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.18))',
      }}
    >
      <path d={tornPath(seed + 3, 22)} fill={fiber} transform="translate(0 4)" />
      <path d={tornPath(seed, 18)} fill={color} transform="translate(0 12)" />
    </svg>
  );
}

/** A small line-art mountain range, used as the Mountain template's mark. */
export function Peaks({ size = 64, stroke = 1.2, className }) {
  return (
    <svg viewBox="0 0 64 26" width={size} height={(size * 26) / 64} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M2 24 L16 9 L22 15 L32 3 L44 16 L50 11 L62 24" />
      <path d="M13 12.2 L16 9 L19 12 M29.4 6.4 L32 3 L35 7 L32.6 6.2 Z" />
      <path d="M8 24 L16 16.5 M38 24 L46 17" opacity="0.6" />
    </svg>
  );
}

/** A thin branch ornament, drawn left to right. */
export function Sprig({ width = 70, stroke = 1, className }) {
  return (
    <svg viewBox="0 0 70 14" width={width} height={(width * 14) / 70} fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" className={className} aria-hidden="true">
      <path d="M2 7 H68" />
      <path d="M14 7 C16 3 20 2 22 3 C20 6 17 7 14 7 Z M14 7 C16 11 20 12 22 11 C20 8 17 7 14 7 Z" />
      <path d="M26 7 C28 3 32 2 34 3 C32 6 29 7 26 7 Z M26 7 C28 11 32 12 34 11 C32 8 29 7 26 7 Z" />
      <path d="M38 7 C40 3 44 2 46 3 C44 6 41 7 38 7 Z M38 7 C40 11 44 12 46 11 C44 8 41 7 38 7 Z" />
      <path d="M50 7 C52 4 55 3.5 57 4.5 C55 6.5 52.5 7 50 7 Z" />
    </svg>
  );
}
