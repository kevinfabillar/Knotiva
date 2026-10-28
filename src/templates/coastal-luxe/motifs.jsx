// Coastal Luxe motifs: the page-long wave, short wave dividers, pebbles and the tide chart.

export const WAVE_PATH =
  'M1180 0 C 1240 300, 900 420, 700 520 S 160 700, 120 1000 S 520 1500, 900 1640 S 1240 2000, 1100 2300 S 300 2600, 160 2900 S 400 3500, 820 3600 S 1220 3900, 1120 4300 S 400 4600, 200 4900 S 600 5500, 1000 5700 S 1200 6100, 640 6400';

/** The wave that weaves down the page. Absolutely position it behind the sections (inset 0). */
export const WaveLine = ({ color = '#9db7bb', ...p }) => (
  <svg viewBox="0 0 1280 6400" preserveAspectRatio="none" aria-hidden="true" {...p}>
    <path d={WAVE_PATH} fill="none" stroke={color} strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
  </svg>
);

/** Short wave divider (160 x 14). */
export const WaveDivider = ({ color = '#9db7bb', width = 160, ...p }) => (
  <svg viewBox="0 0 160 14" width={width} height={(width * 14) / 160} aria-hidden="true" {...p}>
    <path d="M0 7 C 10 2, 20 12, 30 7 S 50 2, 60 7 S 80 12, 90 7 S 110 2, 120 7 S 140 12, 160 7" fill="none" stroke={color} strokeWidth="1.2" />
  </svg>
);

const RADII = {
  1: '48% 52% 46% 54% / 40% 42% 58% 60%',
  2: '58% 42% 50% 50% / 46% 54% 46% 54%',
  3: '42% 58% 60% 40% / 54% 44% 56% 46%',
  4: '50% 50% 44% 56% / 60% 50% 50% 40%',
};

/** An organic pebble-shaped box. shape 1–4. Use as a photo frame (overflow hidden). */
export const Pebble = ({ shape = 1, style, className = '', children, ...p }) => (
  <div className={`co-pebble ${className}`} style={{ borderRadius: RADII[shape] || RADII[1], overflow: 'hidden', ...style }} {...p}>
    {children}
  </div>
);

const hm = (t) => (t || '').replace(/\s*(AM|PM)$/i, '');

/**
 * The tide chart for the program.
 * items: schedule entries ({ time, label|tag, note|sub, icon }).
 * Horizontal (desktop): 1120 x 440 box. vertical (phone): 80px curve column + labels, 110px per item.
 */
export function TideChart({ items = [], vertical = false }) {
  const n = Math.max(items.length, 2);
  if (!vertical) {
    const W = 1120;
    const step = 1000 / (n - 1);
    const pts = items.map((_, i) => [60 + i * step, i % 2 ? 220 : 80]);
    let d = `M0 96 C 20 84, 40 80, ${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1];
      const [x1, y1] = pts[i];
      d += ` C ${x0 + step / 4} ${y0}, ${x1 - step / 4} ${y1}, ${x1} ${y1}`;
    }
    const fill = `${d} V300 H0 Z`;
    return (
      <div className="co-tide" style={{ position: 'relative', height: 440, width: W, maxWidth: '100%' }}>
        <svg viewBox={`0 0 ${W} 300`} aria-hidden="true" style={{ position: 'absolute', left: 0, top: 70, width: '100%', height: 300 }}>
          <path d={`M0 150 H${W}`} stroke="#e3dccd" strokeWidth="1" />
          <path d={fill} fill="#dde8e7" opacity="0.5" />
          <path d={d} fill="none" stroke="#2e4a52" strokeWidth="1.4" />
          {pts.map(([x, y], i) =>
            items[i].icon === 'rings' ? (
              <circle key={i} cx={x} cy={y} r="12" fill="#2e4a52" />
            ) : (
              <circle key={i} cx={x} cy={y} r="7" fill="#fbf9f4" stroke="#2e4a52" strokeWidth="1.4" />
            ),
          )}
        </svg>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {items.map((s, i) => (
            <li
              key={i}
              className="co-tide-item"
              style={{ position: 'absolute', left: `${((pts[i][0] - 60) / W) * 100}%`, top: i % 2 ? 310 : 0, width: 200 }}
            >
              <p className="co-tide-time">{hm(s.time)}</p>
              <p className="co-tide-label">{s.label || s.tag}</p>
              {(s.note || s.sub) && <p className="co-tide-note">{s.note || s.sub}</p>}
            </li>
          ))}
        </ol>
      </div>
    );
  }
  const H = 110 * items.length;
  const pts = items.map((_, i) => [i % 2 ? 62 : 18, 30 + i * 110]);
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    d += ` C ${x0} ${y0 + 40}, ${x1} ${y1 - 40}, ${x1} ${y1}`;
  }
  return (
    <div className="co-tide is-vertical" style={{ position: 'relative', height: H }}>
      <svg viewBox={`0 0 80 ${H}`} aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: 80, height: H }}>
        <path d={`M40 0 V${H}`} stroke="#e3dccd" strokeWidth="1" />
        <path d={d} fill="none" stroke="#2e4a52" strokeWidth="1.4" />
        {pts.map(([x, y], i) =>
          items[i].icon === 'rings' ? (
            <circle key={i} cx={x} cy={y} r="10" fill="#2e4a52" />
          ) : (
            <circle key={i} cx={x} cy={y} r="6" fill="#fbf9f4" stroke="#2e4a52" strokeWidth="1.4" />
          ),
        )}
      </svg>
      <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((s, i) => (
          <li key={i} className="co-tide-item" style={{ position: 'absolute', left: 96, top: pts[i][1] - 18 }}>
            <p className="co-tide-time">{hm(s.time)}</p>
            <p className="co-tide-label">{s.label || s.tag}</p>
            {(s.note || s.sub) && <p className="co-tide-note">{s.note || s.sub}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
