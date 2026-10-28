// Line art and small icons for Next Chapter. Everything draws in currentColor unless noted.

/** A single olive branch in fine line art. */
export function Sprig({ className = '' }) {
  const leaves = [
    [22, 70, -38],
    [34, 58, 32],
    [44, 50, -44],
    [57, 41, 26],
    [66, 33, -50],
    [80, 26, 18],
    [88, 18, -58],
    [102, 14, 8],
  ];
  return (
    <svg className={`nc-sprig ${className}`} viewBox="0 0 120 84" fill="none" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" aria-hidden="true">
      <path d="M8 80 C 30 62, 58 40, 112 12" />
      {leaves.map(([x, y, r], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${r - 30})`}>
          <path d="M0 0 C 4 -5, 14 -6, 20 -2 C 14 3, 4 4, 0 0 Z" />
          <path d="M1 -0.4 L 16 -2" strokeWidth="0.5" />
        </g>
      ))}
    </svg>
  );
}

/** "G/A" monogram: first initial upper left, second lower right, a hairline slash between. */
export function Monogram({ a, b, className = '' }) {
  return (
    <span className={`nc-mono ${className}`} aria-hidden="true">
      <span className="nc-mono-a">{a}</span>
      <i className="nc-mono-slash" />
      <span className="nc-mono-b">{b}</span>
    </span>
  );
}

/** A quiet street map with a bronze pin. `seed` shifts the streets so each venue looks different. */
export function MapArt({ seed = 0, className = '' }) {
  const t = seed ? 1 : 0;
  return (
    <svg className={`nc-map-art ${className}`} viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="400" height="240" fill="#e9e5de" />
      {/* river */}
      <path d={t ? 'M-10 60 C 80 40, 140 96, 230 70 S 360 20, 420 44' : 'M-10 196 C 70 168, 150 214, 240 186 S 360 150, 420 170'} fill="none" stroke="#d3d7d3" strokeWidth="18" />
      {/* parks */}
      <path d={t ? 'M250 140 h70 v58 h-70 z' : 'M40 30 h64 v46 h-64 z'} fill="#dcdfd0" />
      <path d={t ? 'M40 170 h46 v40 h-46 z' : 'M300 70 h56 v40 h-56 z'} fill="#dcdfd0" />
      {/* blocks */}
      <g fill="#e2ddd4">
        {Array.from({ length: 24 }, (_, i) => {
          const x = (i % 6) * 70 + (t ? 18 : 6);
          const y = Math.floor(i / 6) * 62 + (t ? 6 : 14);
          return <rect key={i} x={x} y={y} width="52" height="44" rx="2" />;
        })}
      </g>
      {/* streets */}
      <g stroke="#fbfaf7" strokeLinecap="round" fill="none">
        <path d={t ? 'M0 128 L 400 112' : 'M0 118 L 400 132'} strokeWidth="9" />
        <path d={t ? 'M150 0 L 176 240' : 'M206 0 L 186 240'} strokeWidth="9" />
        <path d={t ? 'M0 30 L 400 196' : 'M0 210 L 400 40'} strokeWidth="5" />
        <path d="M74 0 L 70 240 M 284 0 L 296 240 M 0 62 L 400 70 M 0 182 L 400 176" strokeWidth="3" />
      </g>
      {/* pin */}
      <g transform="translate(200 104)">
        <ellipse cx="0" cy="22" rx="9" ry="3" fill="#2b2925" fillOpacity="0.18" />
        <path d="M0 22 C -4 14, -15 4, -15 -8 a15 15 0 0 1 30 0 C 15 4, 4 14, 0 22 Z" fill="#a5733f" />
        <circle cx="0" cy="-8" r="5.4" fill="#f3eee6" />
      </g>
    </svg>
  );
}

/** Soft watercolour figures: a man in an olive suit, a woman in a sage gown, a leaf behind. */
export function AttireArt({ className = '' }) {
  return (
    <svg className={`nc-attire-art ${className}`} viewBox="0 0 320 300" role="img" aria-label="Illustration of guests in cocktail formal attire">
      <defs>
        <filter id="nc-wc" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="5" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        <radialGradient id="nc-wash" cx="0.5" cy="0.55" r="0.5">
          <stop offset="0" stopColor="#d9cbb4" stopOpacity="0.55" />
          <stop offset="1" stopColor="#d9cbb4" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="160" cy="170" rx="150" ry="128" fill="url(#nc-wash)" />
      {/* leaf behind */}
      <g filter="url(#nc-wc)" opacity="0.5">
        <path d="M70 250 C 120 190, 190 120, 270 40" fill="none" stroke="#8a8f6a" strokeWidth="2" />
        {[
          [110, 206, -30],
          [140, 172, 40],
          [168, 142, -36],
          [196, 116, 36],
          [222, 90, -40],
          [248, 64, 30],
        ].map(([x, y, r], i) => (
          <ellipse key={i} cx={x} cy={y} rx="26" ry="9" transform={`rotate(${r - 40} ${x} ${y})`} fill="#a9ad8a" />
        ))}
      </g>
      <g filter="url(#nc-wc)">
        {/* woman, sage gown */}
        <circle cx="128" cy="78" r="15" fill="#e3c4ac" />
        <path d="M113 76 C 110 60, 140 52, 144 72 C 146 90, 150 104, 142 112 C 140 96, 136 86, 128 84 C 120 86, 116 96, 116 108 C 108 100, 112 88, 113 76 Z" fill="#5a4636" opacity="0.9" />
        <path d="M118 98 C 116 112, 114 124, 116 134 L 90 270 C 120 280, 160 280, 176 270 L 144 134 C 146 122, 142 110, 138 98 Z" fill="#8a8f6a" opacity="0.85" />
        <path d="M118 98 C 116 112, 114 124, 116 134 L 100 270 L 112 272 L 128 134 Z" fill="#6b6b4e" opacity="0.25" />
        <path d="M116 102 C 110 118, 108 140, 112 160" fill="none" stroke="#e3c4ac" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
        {/* man, olive suit */}
        <circle cx="196" cy="66" r="16" fill="#d9b393" />
        <path d="M180 62 C 180 46, 212 44, 212 62 C 206 54, 190 54, 180 62 Z" fill="#3b2f26" />
        <path d="M172 92 C 182 84, 210 84, 220 92 L 226 170 L 166 170 Z" fill="#6b6b4e" opacity="0.92" />
        <path d="M190 88 L 196 118 L 202 88 Z" fill="#f3eee6" />
        <path d="M194 92 L 196 112 L 198 92 Z" fill="#3a3a2c" />
        <path d="M170 168 L 222 168 L 216 276 L 200 276 L 196 196 L 192 276 L 176 276 Z" fill="#5b5b41" opacity="0.92" />
        <path d="M172 96 C 160 120, 158 146, 164 166" fill="none" stroke="#6b6b4e" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
        <path d="M220 96 C 232 120, 232 146, 226 166" fill="none" stroke="#6b6b4e" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
      </g>
      <ellipse cx="160" cy="282" rx="96" ry="6" fill="#6e665c" opacity="0.12" />
    </svg>
  );
}

const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function DressIcon({ crossed = false }) {
  return (
    <svg viewBox="0 0 40 40" {...S} aria-hidden="true">
      <path d="M16 7 L 17 12 C 15 15, 15 17, 16 19 L 11 33 H 29 L 24 19 C 25 17, 25 15, 23 12 L 24 7" />
      <path d="M17 12 H 23 M 16 19 H 24" />
      {crossed && <path d="M8 8 L 32 32" />}
    </svg>
  );
}

export function JeansIcon() {
  return (
    <svg viewBox="0 0 40 40" {...S} aria-hidden="true">
      <path d="M13 8 H 27 L 28 33 H 22 L 20 17 L 18 33 H 12 Z" />
      <path d="M13 12 H 27 M 20 12 V 16" />
      <path d="M8 8 L 32 32" />
    </svg>
  );
}

export function PlaneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" {...S} strokeWidth="1.4" aria-hidden="true">
      <path d="M21 3 L 10 14" />
      <path d="M21 3 L 14 21 L 10 14 L 3 10 Z" />
    </svg>
  );
}

export function Chevron({ up = false }) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...S} strokeWidth="1.3" aria-hidden="true">
      <path d={up ? 'M6 15 L 12 9 L 18 15' : 'M6 9 L 12 15 L 18 9'} />
    </svg>
  );
}

export function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...S} strokeWidth="1.3" aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="3.5" />
      <path d="M10.5 9.5 L 14.5 12 L 10.5 14.5 Z" />
    </svg>
  );
}
