// Modern Haciendera motifs: calamansi branch, menu leaf rule, the estate map, roof tiles and Roman dates.

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** "20 · II · 2027" from an ISO date. */
export const romanDate = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${+d} · ${ROMAN[+m - 1]} · ${y}`;
};

const LEAVES = [
  'M60 118 C 50 96, 54 80, 70 70 C 76 90, 72 106, 60 118 Z',
  'M100 98 C 104 74, 120 64, 138 66 C 128 86, 116 96, 100 98 Z',
  'M150 72 C 146 50, 158 36, 176 34 C 172 56, 164 66, 150 72 Z',
  'M200 50 C 210 32, 228 28, 242 34 C 230 48, 216 52, 200 50 Z',
  'M120 86 C 128 104, 124 120, 110 128 C 104 110, 108 96, 120 86 Z',
];

/** Fine-line calamansi branch (260 x 160): olive leaves, amber fruit. */
export const Calamansi = (p) => (
  <svg viewBox="0 0 260 160" aria-hidden="true" {...p}>
    <g fill="none" stroke="#5f6640" strokeWidth="1.3" strokeLinecap="round">
      <path d="M10 140 C 70 110, 140 80, 250 30" />
      {LEAVES.map((d) => (
        <path key={d} d={d} />
      ))}
    </g>
    <g fill="#c98a3a" stroke="#8d6a2a" strokeWidth="1">
      <circle cx="86" cy="124" r="9" />
      <circle cx="170" cy="86" r="8" />
      <circle cx="182" cy="96" r="7" />
    </g>
  </svg>
);

/** Menu-card divider (60 x 14). */
export const LeafRule = (p) => (
  <svg viewBox="0 0 60 14" width="60" height="14" aria-hidden="true" {...p}>
    <path d="M2 7 H22 M38 7 H58 M30 2 C 26 6, 26 8, 30 12 C 34 8, 34 6, 30 2 Z" fill="none" stroke="#5f6640" strokeWidth="1" />
  </svg>
);

/** Terracotta roof-tile edge between sections. Style .ha-tiles in CSS (spec §5.4). */
export const Tiles = ({ flip = false }) => <div className={`ha-tiles${flip ? ' is-flip' : ''}`} aria-hidden="true" />;

const CANE = Array.from({ length: 34 }, (_, i) => {
  const row = Math.floor(i / 12);
  const col = i % 12;
  const x = 20 + col * 12 + (row === 2 ? 0 : 0);
  const y = 330 + row * 46 + (col % 2 ? 4 : 0);
  return `M${x} ${y} v${row === 2 ? 22 : 24}`;
}).join(' ');

/**
 * The illustrated estate map (580 x 460). Pins: 1 = chapel, 2 = house.
 * estate: the estate name for the accessible label.
 */
export const EstateMap = ({ estate = 'the estate', ...p }) => (
  <svg viewBox="0 0 580 460" role="img" aria-label={`Illustrated map of ${estate}: the gate, the chapel (1) and the house (2)`} {...p}>
    <rect width="580" height="460" fill="#f6efe1" />
    <path d={CANE} stroke="#5f6640" strokeWidth="1.2" strokeLinecap="round" opacity="0.55" />
    <g fill="#a7a77e" fillOpacity="0.45" stroke="#5f6640" strokeWidth="1">
      <circle cx="220" cy="70" r="22" />
      <circle cx="256" cy="56" r="18" />
      <circle cx="470" cy="300" r="24" />
      <circle cx="500" cy="330" r="18" />
      <circle cx="80" cy="120" r="20" />
      <circle cx="420" cy="80" r="16" />
    </g>
    <path d="M330 380 C 360 360, 420 362, 440 390 C 450 410, 410 430, 370 422 C 340 416, 318 398, 330 380 Z" fill="#cfdcd6" stroke="#8aa29a" strokeWidth="1" />
    <path d="M290 450 C 290 400, 250 360, 200 330 S 150 250, 190 210 S 300 170, 360 160 S 430 130, 440 100" fill="none" stroke="#b65f3e" strokeWidth="1.6" strokeDasharray="6 6" />
    <g transform="translate(176 180)">
      <rect x="-22" y="0" width="44" height="40" fill="#f3eada" stroke="#5a4232" strokeWidth="1.4" />
      <path d="M-28 2 L0 -24 L28 2 Z" fill="#b65f3e" stroke="#5a4232" strokeWidth="1.4" />
      <path d="M0 -36 V-24 M-5 -31 H5" stroke="#5a4232" strokeWidth="1.4" />
      <path d="M-6 40 V24 a6 6 0 0 1 12 0 V40" fill="none" stroke="#5a4232" strokeWidth="1.2" />
    </g>
    <g transform="translate(440 70)">
      <rect x="-56" y="0" width="112" height="44" fill="#f3eada" stroke="#5a4232" strokeWidth="1.4" />
      <path d="M-64 2 L-40 -20 H40 L64 2 Z" fill="#b65f3e" stroke="#5a4232" strokeWidth="1.4" />
      <path d="M-40 14 v16 M-20 14 v16 M0 14 v16 M20 14 v16 M40 14 v16" stroke="#5a4232" strokeWidth="1.2" />
    </g>
    <path d="M274 444 V430 M306 444 V430 M274 430 a16 10 0 0 1 32 0" fill="none" stroke="#5a4232" strokeWidth="1.4" />
    <g fontFamily="Karla, sans-serif" fontStyle="italic" fontSize="12" fill="#5a4232">
      <text x="306" y="440">the gate</text>
      <text x="60" y="318">cane fields</text>
      <text x="344" y="440">pond</text>
      <text x="474" y="132">the house</text>
      <text x="120" y="244">the chapel</text>
    </g>
    <g fontFamily="Gloock, serif" fontSize="15" fill="#f3eada" textAnchor="middle">
      <circle cx="208" cy="168" r="14" fill="#a3512f" />
      <text x="208" y="173">1</text>
      <circle cx="400" cy="52" r="14" fill="#a3512f" />
      <text x="400" y="57">2</text>
    </g>
    <g transform="translate(530 410)" stroke="#5a4232" strokeWidth="1" fill="none">
      <circle r="18" />
      <path d="M0 -24 L4 0 L0 24 L-4 0 Z" fill="#5a4232" />
    </g>
    <text x="526" y="380" fontFamily="Karla, sans-serif" fontSize="10" fill="#5a4232">N</text>
  </svg>
);
