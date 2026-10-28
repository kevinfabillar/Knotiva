import Icon from '../shared/Icon.jsx';
import {
  CalendarButton,
  Countdown,
  DressCode,
  Entourage,
  Faq,
  Gifts,
  Rsvp,
  TemplateRoot,
  Venues,
  demo,
  initials,
  scrollToId,
  seatLine,
  useDetails,
  useEntourage,
  useGifts,
  useInvite,
  useLightbox,
  usePhoto,
  useSchedule,
} from '../kit/index.js';
import { Grain, Slug, Sprockets, Subtitle } from './motifs.jsx';
import './midnight-garden.css';

const P = '/templates/midnight-garden/';

const DEFAULTS = {
  a: 'Lucía',
  b: 'Gabriel',
  start: '2027-10-16T18:00:00+08:00',
  end: '2027-10-17T00:30:00+08:00',
  date: '16 October 2027',
  place: 'Silang, Cavite',
  venue: 'The Conservatory at Villa Noche',
  venueAddress: 'Aguinaldo Highway, Silang, Cavite',
  ceremony: 'The Garden Chapel',
  ceremonyAddress: 'Villa Noche, Aguinaldo Highway, Silang, Cavite',
  replyBy: '16 September 2027',
  tagline: 'Some stories are best told after dark.',
};

const NAV = [
  { id: 'scenes', label: 'The Scenes' },
  { id: 'running', label: 'Running Order' },
  { id: 'wardrobe', label: 'Wardrobe' },
  { id: 'stills', label: 'Stills' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'faq', label: 'Q & A' },
  { id: 'premiere', label: 'RSVP' },
  { id: 'credits', label: 'Credits' },
];

const SCHEDULE = [
  { time: '5:30 PM', label: 'Arrivals', note: 'Lanterns lit along the garden path', icon: 'users' },
  { time: '6:00 PM', label: 'The Ceremony', note: 'The Garden Chapel', icon: 'rings' },
  { time: '7:00 PM', label: 'Cocktails Among the Roses', note: 'The sunken garden', icon: 'cheers' },
  { time: '7:30 PM', label: 'Dinner by Candlelight', note: 'The Conservatory', icon: 'dinner' },
  { time: '9:30 PM', label: 'The First Dance', note: 'Strings, then the band', icon: 'music' },
  { time: '11:30 PM', label: 'The Last Scene', note: 'A send-off under the stars', icon: 'heart' },
];

const PALETTE = [
  { name: 'Midnight', hex: '#0e0f0d' },
  { name: 'Forest', hex: '#1f3328' },
  { name: 'Burgundy', hex: '#5a1625' },
  { name: 'Plum', hex: '#3d2c3e' },
  { name: 'Gold', hex: '#a8854e' },
];

const DRESS = {
  note: 'Black tie, after dark. Velvet, silk and satin in the deep tones of the garden at night. Please leave white and pastels for another film.',
  shape: 'square',
  attire: [
    { who: 'Her', icon: 'gown', text: 'Floor-length gowns in velvet or satin. A dark lip, a single statement earring.' },
    { who: 'Him', icon: 'suit', text: 'A black or forest-green tuxedo, or a dark barong. A burgundy boutonnière.' },
  ],
};

const FAQ = [
  { q: 'When should I reply by?', a: 'By the date on your invitation, through the form below.' },
  { q: 'Is the garden lit at night?', a: 'Yes: lanterns line every path and the conservatory glows all evening. Bring a wrap; gardens get cool.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'What shoes for the garden?', a: 'The paths are stone and gravel. Block heels or flats will serve you better than stilettos.' },
  { q: 'Is there parking?', a: 'Yes, inside the estate. Attendants will guide you from the gate.' },
];

const STILL_LINE = 'You looked at me like the lights had just gone down.';
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const WORDS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];

const dayDate = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const weekdayOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { weekday: 'long' });
const dotted = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d} · ${m} · ${y}`;
};
/** "5:30 PM" → "half past five", "6:00 PM" → "six" */
function spoken(t = '') {
  const m = /(\d{1,2})(?::(\d{2}))?/.exec(t);
  if (!m) return t;
  const w = WORDS[+m[1] % 12];
  if (m[2] === '30') return `half past ${w}`;
  if (m[2] === '15') return `quarter past ${w}`;
  return m[2] && m[2] !== '00' ? `${w} ${m[2]}` : w;
}
const hhmm = (iso) => {
  const h = +iso.slice(11, 13);
  return `${h % 12 || 12}:${iso.slice(14, 16)} ${h < 12 ? 'AM' : 'PM'}`;
};
const bareTime = (t = '') => t.replace(/\s*(AM|PM)$/i, '');
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const venueShort = (v) => (/ at /i.test(v) ? v.split(/ at /i).pop() : v);
const venueRoom = (v) => (/ at /i.test(v) ? v.split(/ at /i)[0] : v);

export const meta = { defaults: DEFAULTS, className: 't-midnight', cover: `${P}hero.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function MidnightGarden() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const [I1, I2] = initials(D);

  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };
  const dinner = schedule.find((s) => s.icon === 'dinner');
  const VENUES = [
    { kind: `Sc. 02 — Int. ${D.ceremony} — Dusk`, name: D.ceremony, time: `${cap(spoken(hhmm(D.start)))} in the evening`, address: D.ceremonyAddress, icon: 'rings' },
    { kind: `Sc. 03 — Int. ${venueRoom(D.venue)} — Night`, name: D.venue, time: `${cap(spoken(dinner?.time || '7:30 PM'))}, until late`, address: D.venueAddress, icon: 'dinner' },
  ];
  const accounts = gifts.accounts.map((a) => ({ ...a, label: a.name ? `${a.label} · ${a.name}` : a.label }));

  const PHOTOS = [
    { src: photo(`${P}still-1.jpg`), alt: `${D.a} and ${D.b} in silhouette against lit glass` },
    { src: photo(`${P}still-2.jpg`), alt: 'A Dutch still life of dark florals' },
    { src: photo(`${P}still-3.jpg`), alt: 'Hands in candlelight' },
    { src: photo(`${P}still-4.jpg`), alt: 'A dance in shadow' },
    { src: photo(`${P}still-5.jpg`), alt: 'A garden path lined with lanterns' },
    { src: photo(`${P}still-6.jpg`), alt: 'A toast' },
  ];
  const lightbox = useLightbox(PHOTOS);
  const url = (p) => `url("${photo(p)}")`;

  return (
    <TemplateRoot
      className="t-midnight"
      nav={NAV}
      rsvp="premiere"
      monogram={`${I1} & ${I2}`}
      music="reverie"
      style={{ '--img-venue-1': url(`${P}chapel.jpg`), '--img-venue-2': url(`${P}conservatory.jpg`) }}
      gate={{
        variant: 'seal',
        names: `${D.a} & ${D.b}`,
        monogram: `${I1}&${I2}`,
        eyebrow: 'You are invited to an evening with',
        date: dotted(D.start),
        button: 'Break the seal',
        hint: 'Break the seal',
      }}
    >
      <header className="mg-nav k-topnav">
        <a href="#top" className="mg-nav-names">
          {D.a} <em>&amp;</em> {D.b}
        </a>
        <nav aria-label="Sections">
          {NAV.filter((n) => ['scenes', 'running', 'wardrobe', 'stills', 'credits'].includes(n.id)).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#premiere" className="mg-nav-rsvp">
            RSVP
          </a>
        </nav>
      </header>

      {/* 1. Opening titles */}
      <section className="mg-hero">
        <div className="mg-frame">
          <img className="mg-frame-img mg-frame-img--wide" src={photo(`${P}hero.jpg`)} alt={`${D.a} and ${D.b} among dark blooms`} />
          <img className="mg-frame-img mg-frame-img--tall" src={photo(`${P}hero-phone.jpg`)} alt="" aria-hidden="true" />
          <Grain />
          <div className="mg-frame-text">
            <Slug className="mg-slug--light rv">A love story in one evening</Slug>
            <h1 className="mg-names rv d1">
              <span>{D.a}</span> <em>&amp;</em> <span>{D.b}</span>
            </h1>
            <p className="mg-hero-date rv d2">{dotted(D.start)}</p>
          </div>
        </div>
        <div className="mg-under">
          <Slug className="mg-under-slug">Sc. 01 — Ext. The garden — Night</Slug>
          {D.tagline ? <Subtitle className="mg-tagline rv">{D.tagline}</Subtitle> : <span />}
          <div className="mg-actions rv d1">
            <button type="button" className="mg-btn" onClick={() => scrollToId('premiere')}>
              Reserve your seat
            </button>
            <CalendarButton event={EVENT} className="mg-btn mg-btn--line" label="Save the date" icon={false} />
          </div>
        </div>
        <p className="mg-hero-foot">
          {venueShort(D.venue)} · {D.place} · {weekdayOf(D.start)} at {spoken(hhmm(D.start))}
        </p>
      </section>

      {/* 2. Countdown */}
      <section className="mg-count-sec">
        <Slug className="mg-center rv">The premiere begins in</Slug>
        <div className="mg-strip rv d1">
          <Sprockets />
          <Countdown date={D.start} className="mg-count" />
          <Sprockets />
        </div>
      </section>

      {/* 3. The Scenes */}
      <section className="mg-sec" id="scenes">
        <h2 className="mg-title mg-center rv">The Scenes</h2>
        <Venues className="mg-venues" items={VENUES} />
      </section>

      {/* 4. Running Order */}
      <section className="mg-sec mg-running" id="running">
        <div className="mg-running-l">
          <Slug className="rv">Sc. 04 — The night, in reels</Slug>
          <h2 className="mg-title rv d1">Running Order</h2>
          <p className="mg-p rv d2">Arrive by {spoken(schedule[0]?.time || '')}. The doors close when the music starts.</p>
        </div>
        <ol className="mg-reels">
          {schedule.map((s, i) => (
            <li key={`${s.time}${i}`} className={`rv d${(i % 4) + 1}${s.icon === 'rings' ? ' is-key' : ''}`}>
              <span className="mg-reel">Reel {ROMAN[i] || i + 1}</span>
              <span className="mg-reel-time">
                {bareTime(s.time)}
                <span className="mg-sr"> {s.time.slice(-2)}</span>
              </span>
              <span className="mg-reel-text">
                <span className="mg-reel-label">{s.label || s.tag}</span>
                {(s.note || s.sub) && <span className="mg-reel-note">{s.note || s.sub}</span>}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* 5. Wardrobe */}
      <section className="mg-sec mg-center" id="wardrobe">
        <Slug className="rv">Sc. 05 — The wardrobe department</Slug>
        <h2 className="mg-title rv d1">Wardrobe</h2>
        <DressCode className="mg-ward" note={DRESS.note} palette={PALETTE} attire={DRESS.attire} shape="square" />
      </section>

      {/* 6. Stills */}
      <section className="mg-sec mg-center mg-stills" id="stills">
        <Slug className="rv">Sc. 06 — Stills from the making of</Slug>
        <h2 className="mg-title rv d1">Stills</h2>
        <button type="button" className="mg-feature rv" onClick={() => lightbox.open(0)} aria-label="Open still 1">
          <img src={PHOTOS[0].src} alt={PHOTOS[0].alt} loading="lazy" />
          <Grain />
        </button>
        <Subtitle className="mg-still-line rv">{STILL_LINE}</Subtitle>
        <div className="mg-film rv">
          <Sprockets />
          <div className="mg-frames">
            {PHOTOS.slice(1).map((p, i) => (
              <button key={p.src} type="button" className="mg-frame-btn" onClick={() => lightbox.open(i + 1)} aria-label={`Open still ${i + 2}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
            ))}
          </div>
          <Sprockets />
        </div>
        <p className="mg-swipe">Swipe the strip →</p>
        {lightbox.node}
      </section>

      {/* 7. Gifts + Q & A */}
      <section className="mg-sec mg-two">
        <div id="gifts">
          <Slug className="rv">Sc. 07 — A gesture</Slug>
          <h2 className="mg-title mg-title--s rv d1">Gifts</h2>
          <p className="mg-p rv d2">{gifts.note}</p>
          <Gifts className="mg-gifts" accounts={accounts} qr={gifts.qr} />
        </div>
        <div id="faq">
          <Slug className="rv">Sc. 08 — Questions from the audience</Slug>
          <h2 className="mg-title mg-title--s rv d1">Q &amp; A</h2>
          <Faq items={FAQ} className="mg-faq" />
        </div>
      </section>

      {/* 8. The Premiere */}
      <section className="mg-premiere mg-center" id="premiere">
        <Slug className="mg-slug--light rv">Sc. 09 — The premiere</Slug>
        <h2 className="mg-premiere-h rv d1">Will you join us?</h2>
        <p className="mg-premiere-lead rv d2">
          {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved {seatLine(guest)} in your honour. Kindly reply by {D.replyBy}.
        </p>
        <div className="mg-rsvp-wrap rv d3">
          <Rsvp couple={D} deadline={D.replyBy} />
        </div>
      </section>

      {/* 9. End credits */}
      <section className="mg-credits-sec mg-center" id="credits">
        <Slug className="rv">End credits</Slug>
        <h2 className="mg-starring rv d1">Starring</h2>
        <p className="mg-stars rv d2">
          {D.a} <em>&amp;</em> {D.b}
        </p>
        <Entourage groups={entourage} className="mg-credits" />
      </section>

      {/* 10. Fin. */}
      <footer className="mg-fin mg-center">
        <p className="mg-fin-word">Fin.</p>
        <p className="mg-fin-meta">
          {D.a} &amp; {D.b} · {dotted(D.start)} · {D.place}
        </p>
        <div className="mg-social">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
            <Icon name="instagram" size={18} stroke={1.2} />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
            <Icon name="facebook" size={18} stroke={1.2} />
          </a>
        </div>
      </footer>
    </TemplateRoot>
  );
}
