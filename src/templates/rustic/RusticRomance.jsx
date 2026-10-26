import Icon from '../shared/Icon.jsx';
import { TornEdge } from '../shared/Decor.jsx';
import {
  CalendarButton,
  Countdown,
  DressCode,
  Entourage,
  Faq,
  Gifts,
  Rsvp,
  TemplateRoot,
  demo,
  initials,
  useDetails,
  useEntourage,
  useGifts,
  usePhoto,
  useSchedule,
  mapsUrl,
  scrollToId,
  seatLine,
  useInvite,
  useLightbox,
} from '../kit/index.js';
import './rustic.css';

const P = '/templates/rustic-romance/';
const LIGHT = '#ece2d2';
const FIBER = '#f6efe4';

const DEFAULTS = {
  a: 'Daniel',
  b: 'Sofia',
  start: '2027-04-24T15:00:00+08:00',
  end: '2027-04-24T22:30:00+08:00',
  month: 'Apr',
  day: '24',
  year: '2027',
  date: 'April 24, 2027',
  place: 'Silang, Cavite',
  venue: 'Casa Verde Farm',
  replyBy: 'March 10, 2027',
};

const SCHEDULE = [
  { icon: 'rings', time: '3:00 PM', label: 'Ceremony' },
  { icon: 'camera', time: '4:00 PM', label: 'Photos' },
  { icon: 'cocktail', time: '5:30 PM', label: 'Cocktail Hour' },
  { icon: 'dinner', time: '7:00 PM', label: 'Dinner' },
  { icon: 'music', time: '8:30 PM', label: 'Dancing' },
];

const NAV = [
  { id: 'story', label: 'Our Story' },
  { id: 'details', label: 'Details' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'attire', label: 'Attire' },
  { id: 'gallery', label: 'Moments' },
  { id: 'faq', label: 'FAQ' },
  { id: 'rsvp', label: 'RSVP' },
];

const PALETTE = [
  { name: 'Blush', hex: '#d9a99a' },
  { name: 'Dusty Rose', hex: '#b9827a' },
  { name: 'Terracotta', hex: '#a35f45' },
  { name: 'Olive', hex: '#7c7a52' },
  { name: 'Cream', hex: '#efe4d0' },
];

const DRESS = {
  note: 'Garden formal in soft, romantic tones. Block heels are your friend on the lawn.',
  shape: 'petal',
  attire: [{ who: 'Ladies', text: 'Flowy midi or long dresses in florals, blush or terracotta.', icon: 'gown' }, { who: 'Gentlemen', text: 'Barong or a light suit with suspenders. No tie needed.', icon: 'barong' }],
};

// Bulbs hanging on sagging strands of wire.
function StringLights() {
  // The side strands sag; the middle one stays high so it never crosses the nav links.
  const strands = [
    [-30, 0, 200, 210, 430, 2],
    [410, 2, 720, 26, 1030, 2],
    [1010, 2, 1240, 210, 1470, 0],
  ];
  const bulbs = [];
  strands.forEach(([x0, y0, cx, cy, x1, y1], s) => {
    const n = Math.round((x1 - x0) / 56);
    for (let k = 0; k < n; k += 1) {
      const t = (k + 0.5) / n;
      const x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1;
      const y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y1;
      bulbs.push({ x, y, k: `${s}-${t.toFixed(2)}` });
    }
  });
  return (
    <svg className="ru-lights" viewBox="0 0 1440 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
      <defs>
        <radialGradient id="ru-glow">
          <stop offset="0" stopColor="#ffe7a8" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#ffd27a" stopOpacity="0.45" />
          <stop offset="1" stopColor="#ffc861" stopOpacity="0" />
        </radialGradient>
      </defs>
      {strands.map(([x0, y0, cx, cy, x1, y1]) => (
        <path key={x0} d={`M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`} fill="none" stroke="#1b120c" strokeWidth="1.6" />
      ))}
      {bulbs.map((b, i) => (
        <g key={b.k} className={i % 3 === 0 ? 'ru-twinkle' : undefined} style={{ animationDelay: `${(i % 5) * 0.7}s` }}>
          <circle cx={b.x} cy={b.y + 9} r="22" fill="url(#ru-glow)" />
          <rect x={b.x - 2.4} y={b.y - 1} width="4.8" height="5" rx="1" fill="#2a1d14" />
          <ellipse cx={b.x} cy={b.y + 9} rx="4.6" ry="6" fill="#fff4d2" />
        </g>
      ))}
    </svg>
  );
}

// Hand-drawn botanical sprig that frames the names.
function Botanical({ className }) {
  const leaves = [
    [44, 128, 205],
    [52, 112, -25],
    [40, 96, 200],
    [50, 80, -35],
    [38, 64, 195],
    [47, 48, -40],
    [38, 34, 210],
  ];
  return (
    <svg viewBox="0 0 90 170" className={className} fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" aria-hidden="true">
      <path d="M58 166 C 36 130, 34 80, 46 18" />
      {leaves.map(([x, y, a]) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${a})`}>
          <path d="M0 0 C 6 -7 17 -7 24 0 C 17 7 6 7 0 0 Z" />
          <path d="M2 0 L 21 0" opacity="0.6" />
        </g>
      ))}
      <circle cx="47" cy="14" r="2.2" />
      <circle cx="54" cy="20" r="1.8" />
      <circle cx="40" cy="20" r="1.6" />
    </svg>
  );
}

function Heart() {
  return (
    <span className="ru-heart" aria-hidden="true">
      <i />
      <Icon name="heart" size={12} stroke={1.6} />
      <i />
    </span>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-rus', cover: `${P}hero.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function RusticRomance() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const [I1, I2] = initials(D);
  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.venue}, ${D.place}` };
  const DETAILS = [
    { icon: 'calendar', title: 'Date', lines: [D.date, '3:00 PM'], cal: true },
    { icon: 'pin', title: 'Location', lines: [D.venue, D.place], map: `${D.venue} ${D.place}` },
    { icon: 'wreath', title: 'Ceremony', lines: ['Garden Chapel', '3:00 PM'] },
    { icon: 'cheers', title: 'Reception', lines: ['Dinner, drinks & dancing', 'to follow'] },
  ];
  const GALLERY = [
    { src: photo(`${P}g1.jpg`), alt: 'Daniel and Sofia in the meadow', tilt: -4 },
    { src: photo(`${P}g2.jpg`), alt: 'A quiet kiss', tilt: 3 },
    { src: photo(`${P}g3.jpg`), alt: 'Candlelit table with roses', tilt: -2 },
    { src: photo(`${P}g4.jpg`), alt: 'Dancing by the sea', tilt: 4 },
    { src: photo(`${P}g5.jpg`), alt: 'Long table under string lights', tilt: -3 },
  ];
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const lightbox = useLightbox(GALLERY);

  return (
    <TemplateRoot
      className="t-rus"
      nav={NAV}
      monogram={`${I1} / ${I2}`}
      music="canon"
      gate={{ variant: 'envelope', names: `${D.a} & ${D.b}`, monogram: `${I1}·${I2}` }}
    >
      <section className="ru-hero ru-wood">
        <StringLights />
        <header className="ru-nav k-topnav">
          <a href="#top" className="ru-mono">
            {D.a[0]} <span>/</span> {D.b[0]}
          </a>
          <nav className="nav-links ru-links">
            {NAV.slice(0, 6).map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <div className="ru-social">
            <Icon name="instagram" size={19} stroke={1.3} />
            <Icon name="facebook" size={19} stroke={1.3} />
            <Icon name="mail" size={19} stroke={1.3} />
          </div>
        </header>

        <div className="ru-hero-grid">
          <div className="ru-hero-text">
            <p className="ru-eyebrow rv">Together with their families</p>
            <div className="ru-names-wrap rv d1">
              <Botanical className="ru-bot ru-bot--l" />
              <h1 className="ru-names">
                <span>{D.a}</span>
                <em>&amp;</em>
                <span>{D.b}</span>
              </h1>
              <Botanical className="ru-bot ru-bot--r" />
            </div>
            <div className="ru-date rv d2">
              <span>{D.month}</span>
              <b>{D.day}</b>
              <span>{D.year}</span>
            </div>
            <p className="ru-time rv d2">· 3:00 PM ·</p>
            <p className="ru-place rv d3">{D.place}</p>
            <p className="ru-invite rv d3">
              We invite you to celebrate
              <br />
              love, laughter &amp; happily ever after
            </p>
            <div className="ru-hero-actions rv d4">
              <button type="button" className="ru-btn" onClick={() => scrollToId('rsvp')}>
                RSVP
              </button>
              <CalendarButton event={EVENT} className="ru-btn ru-btn--line" label="Save the date" icon={false} />
            </div>
          </div>
          <div className="ru-hero-photo rv d2">
            <div className="ru-pile">
              <span className="ru-sheet" />
              <span className="ru-sheet ru-sheet--2" />
              <figure className="ru-stack">
                <img src={photo(`${P}hero.jpg`)} alt={`${D.a} and ${D.b} holding a bouquet`} />
              </figure>
            </div>
          </div>
        </div>
        <TornEdge color={LIGHT} fiber={FIBER} seed={5} height={30} />
      </section>

      <section className="ru-story ru-light" id="story">
        <div className="ru-story-photo rv">
          <figure className="ru-deckle">
            <img src={photo(`${P}story.jpg`)} alt="Walking hand in hand through the field" loading="lazy" />
          </figure>
        </div>
        <div className="ru-story-text rv d1">
          <h2 className="ru-h">Our Story</h2>
          <Heart />
          <p className="ru-script">
            Every love story is beautiful,
            <br />
            but ours is our favorite.
          </p>
          <p className="ru-body">
            From the moment we met, our story began.
            <br />
            Now, we invite you to be part of our journey
            <br />
            as we say &ldquo;I do&rdquo; and start our forever.
          </p>
          <div className="ru-story-count">
            <p className="ru-h ru-h--sm">Counting the days</p>
            <Countdown date={D.start} className="ru-countdown" />
          </div>
        </div>
        <img className="ru-jar" src={photo(`${P}jar.jpg`)} alt="" loading="lazy" />
      </section>

      <section className="ru-details ru-wood" id="details">
        <TornEdge color={LIGHT} fiber={FIBER} seed={9} height={26} flip />
        <h2 className="ru-h ru-h--light rv">The Details</h2>
        <Heart />
        <div className="ru-cols">
          {DETAILS.map((d, i) => (
            <div key={d.title} className={`ru-col rv d${i + 1}`}>
              <Icon name={d.icon} size={38} stroke={1.05} />
              <h3>{d.title}</h3>
              {d.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
              {d.cal && <CalendarButton event={EVENT} className="ru-col-link" label="Add to calendar" icon={false} />}
              {d.map && (
                <a className="ru-col-link" href={mapsUrl(d.map)} target="_blank" rel="noreferrer">
                  Open map
                </a>
              )}
            </div>
          ))}
        </div>
        <TornEdge color={LIGHT} fiber={FIBER} seed={21} height={26} />
      </section>

      <section className="ru-schedule ru-light" id="schedule">
        <h2 className="ru-h rv">Schedule of Events</h2>
        <Heart />
        <ol className="ru-timeline rv d1">
          {schedule.map((s) => (
            <li key={s.label}>
              <Icon name={s.icon} size={40} stroke={1.05} />
              <span className="ru-dot" />
              <b>{s.time}</b>
              <span>{s.label}</span>
            </li>
          ))}
        </ol>
        <img className="ru-roses" src={photo(`${P}flowers.jpg`)} alt="" loading="lazy" />
      </section>

      <section className="ru-sec ru-light ru-light--alt" id="attire">
        <h2 className="ru-h rv">Dress Code</h2>
        <Heart />
        <DressCode {...DRESS} palette={PALETTE} />
      </section>

      <section className="ru-gallery ru-wood" id="gallery">
        <TornEdge color={LIGHT} fiber={FIBER} seed={31} height={26} flip />
        <h2 className="ru-h ru-h--light rv">Moments</h2>
        <Heart />
        <div className="ru-pols">
          {GALLERY.map((g, i) => (
            <button
              key={g.src}
              type="button"
              className={`ru-pol rv d${(i % 4) + 1}`}
              style={{ '--tilt': `${g.tilt}deg` }}
              onClick={() => lightbox.open(i)}
              aria-label={`Open photo ${i + 1}`}
            >
              <img src={g.src} alt={g.alt} loading="lazy" />
            </button>
          ))}
        </div>
        {lightbox.node}
        <TornEdge color={LIGHT} fiber={FIBER} seed={41} height={26} />
      </section>

      <section className="ru-sec ru-light" id="entourage">
        <h2 className="ru-h rv">The Entourage</h2>
        <Heart />
        <Entourage groups={entourage} />
      </section>

      <section className="ru-sec ru-light ru-light--alt" id="gifts">
        <h2 className="ru-h rv">Gifts</h2>
        <Heart />
        <Gifts note={gifts.note} accounts={gifts.accounts} qr={gifts.qr} />
      </section>

      <section className="ru-sec ru-wood ru-faq" id="faq">
        <TornEdge color={LIGHT} fiber={FIBER} seed={61} height={26} flip />
        <h2 className="ru-h ru-h--light rv">Questions</h2>
        <Heart />
        <Faq items={demo.faq} />
        <TornEdge color={LIGHT} fiber={FIBER} seed={71} height={26} />
      </section>

      <section className="ru-rsvp ru-light" id="rsvp">
        <div className="ru-seal rv" aria-hidden="true">
          <span>
            {D.a[0]}
            <i>/</i>
            {D.b[0]}
          </span>
        </div>
        <h2 className="ru-h rv d1">Kindly Reply</h2>
        <p className="ru-body rv d1">
          {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved <u>{seatLine(guest)}</u> in your honor.
          <br />
          Please reply by {D.replyBy}.
        </p>
        <Rsvp couple={D} deadline={D.replyBy} className="ru-rsvp-card rv d2" />
        <p className="ru-script ru-thanks rv d3">We can&rsquo;t wait to celebrate with you!</p>
      </section>

      <footer className="ru-foot ru-wood">
        <TornEdge color={LIGHT} fiber={FIBER} seed={51} height={22} flip />
        <span className="ru-mono">
          {D.a[0]} <span>/</span> {D.b[0]}
        </span>
        <div>
          <p className="ru-foot-names">
            {D.a} &amp; {D.b}
          </p>
          <p className="ru-foot-meta">
            {D.date} <i>•</i> {D.place}
          </p>
        </div>
        <div className="ru-social">
          <Icon name="instagram" size={19} stroke={1.3} />
          <Icon name="facebook" size={19} stroke={1.3} />
          <Icon name="mail" size={19} stroke={1.3} />
        </div>
      </footer>
    </TemplateRoot>
  );
}
