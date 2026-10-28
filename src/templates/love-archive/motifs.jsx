// Digital Love Archive motifs: file lines, the contact sheet, the grease-pencil loop, film date stamps.

/** Film-camera date imprint, e.g. "’27 2 14". */
export const stampOf = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `’${y.slice(2)} ${+m} ${d}`;
};

/** Section file line: "File 003 · locations.txt" + right-hand metadata. Style .ar-file / .ar-mono (spec §6.4). */
export const FileLine = ({ name, meta }) => (
  <div className="ar-file">
    <span className="ar-mono" style={{ color: 'var(--ink)' }}>{name}</span>
    {meta && <span className="ar-mono">{meta}</span>}
  </div>
);

const LOOP = 'M30 80 C 20 40, 80 14, 130 20 C 180 26, 190 70, 170 104 C 150 136, 70 140, 40 116 C 26 104, 24 90, 34 74';

/** Grease-pencil loop (200 x 150). */
export const GreaseCircle = ({ color = '#c99a93', width = 4, ...p }) => (
  <svg viewBox="0 0 200 150" aria-hidden="true" {...p}>
    <path d={LOOP} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" />
  </svg>
);

/** Sprocket holes for the negative strip; place one at the top and one at the bottom. */
export const Sprockets = ({ color = '#f4ecdf' }) => (
  <div
    aria-hidden="true"
    style={{ height: 18, background: `radial-gradient(ellipse 5px 4px at 10px 9px, ${color} 0 98%, transparent) 0 0 / 20px 18px repeat-x` }}
  />
);

/**
 * Hero contact sheet.
 * photos: [{ src, stamp? }] (12 on desktop; pass 9 on phone), circle: index of the circled frame,
 * note: handwritten note beside it, roll: caption text.
 */
export function ContactSheet({ photos = [], circle = 5, note, roll = 'Roll 27 · Portra 400', cols = 4 }) {
  return (
    <figure className="ar-sheet">
      <div className="ar-sheet-grid" style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
        {photos.map((p, i) => (
          <div key={i} className={`ar-frame${i === circle ? ' is-circled' : ''}`}>
            <img src={p.src} alt="" loading="lazy" />
            {p.stamp && <span className="ar-stamp ar-frame-stamp">{p.stamp}</span>}
            {i === circle && <GreaseCircle className="ar-loop" />}
          </div>
        ))}
      </div>
      <figcaption className="ar-sheet-cap">
        <span>{roll}</span>
        <span>contact-sheet.jpg</span>
      </figcaption>
      {note && <p className="ar-hand ar-sheet-note">{note}</p>}
    </figure>
  );
}
