import { useRef } from 'react';
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
import { Chevron, Divider, Fan, HeroArch, PhoneArch, Skyline } from './motifs.jsx';
import './deco.css';

const P = '/templates/gilded-deco/';

const DEFAULTS = {
  a: 'Theodore',
  b: 'Vivienne',
  start: '2027-12-31T16:00:00+08:00',
  end: '2028-01-01T01:00:00+08:00',
  date: 'December 31, 2027',
  month: 'Dec',
  day: '31',
  year: '2027',
  place: 'Binondo, Manila',
  venue: 'The Escolta Grand Ballroom',
  venueAddress: 'Escolta Street, Binondo, Manila',
  ceremony: 'St. Cecilia’s Chapel',
  ceremonyAddress: 'Real Street, Intramuros, Manila',
  replyBy: 'December 1, 2027',
};

const NAV = [
  { id: 'affair', label: 'The Affair' },
  { id: 'evening', label: 'Programme' },
  { id: 'attire', label: 'Attire' },
  { id: 'party', label: 'Wedding Party' },
  { id: 'portraits', label: 'Portraits' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'faq', label: 'Enquiries' },
  { id: 'rsvp', label: 'Kindly Reply' },
];

const SCHEDULE = [
  { time: '4:00 PM', label: 'The Ceremony', note: 'St. Cecilia’s Chapel', icon: 'rings' },
  { time: '5:30 PM', label: 'Cocktails & Jazz', note: 'On the mezzanine', icon: 'cocktail' },
  { time: '7:00 PM', label: 'Dinner is Served', note: 'The Grand Ballroom', icon: 'dinner' },
  { time: '9:00 PM', label: 'First Dance', note: 'A foxtrot, of course', icon: 'music' },
  { time: '10:00 PM', label: 'The Party', note: 'Big band, then the DJ', icon: 'cheers' },
  { time: '11:59 PM', label: 'The Countdown', note: 'Champagne at midnight', icon: 'clock' },
];

const PALETTE = [
  { name: 'Onyx', hex: '#121212' },
  { name: 'Emerald', hex: '#1f5c48' },
  { name: 'Gold', hex: '#d9c08c' },
  { name: 'Pearl', hex: '#ece4d2' },
  { name: 'Silver', hex: '#b9bcc0' },
];

const DRESS = {
  note: 'Think 1920s glamour: sequins, fringe, pearls and velvet in the colours below. Gold accents are warmly encouraged.',
  shape: 'square',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'Floor-length gowns or beaded cocktail dresses. Fringe, sequins and feathers are all welcome.' },
    { who: 'Gentlemen', icon: 'suit', text: 'Black tuxedo, bow tie and polished shoes. A pocket square in gold or emerald.' },
  ],
};

const FAQ = [
  { q: 'When should I reply by?', a: 'Please reply through the form below by the date on your invitation, so we can confirm numbers with the ballroom.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'What does black tie mean for this evening?', a: 'Floor-length gowns or dressy cocktail dresses, and tuxedos or dark suits with a bow tie. Sequins, fringe and a little gold are very welcome.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but apart from our entourage this will be an adults-only evening.' },
  { q: 'Is there parking at the ballroom?', a: 'Yes. Valet parking is available at the Escolta Street entrance from 3:00 PM.' },
];

const GIFT_NOTE = 'Your presence is our greatest gift. Should you wish to honour us further, a monetary gift toward our first home would be warmly appreciated.';

/* ---------- date helpers (read the ISO string as written, no time-zone shifts) ---------- */

const dayOf = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const weekdayOf = (iso) => dayOf(iso).toLocaleDateString('en-US', { weekday: 'long' });
const longDate = (iso) => dayOf(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const hourOf = (iso) => Number((/T(\d{2})/.exec(iso || '') || [0, 0])[1]);

/** '4 PM' (or '4:30 PM') from the ISO string. */
function timeOf(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = Number(m[1]);
  return `${((h + 11) % 12) + 1}${m[2] === '00' ? '' : `:${m[2]}`} ${h < 12 ? 'AM' : 'PM'}`;
}

const WORDS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
const oclock = (iso) => `${WORDS[hourOf(iso) % 12]} o’clock`;

function roman(n) {
  const map = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
  let out = '';
  let x = n;
  map.forEach(([v, s]) => {
    while (x >= v) {
      out += s;
      x -= v;
    }
  });
  return out;
}

const romanDate = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-').map(Number);
  return `${d} · ${roman(m)} · ${roman(y)}`;
};

/* ---------- small pieces ---------- */

function Crest({ D }) {
  const [I1, I2] = initials(D);
  return (
    <span className="dc-crest" aria-hidden="true">
      <i />
      <i />
      <b>
        {I1}·{I2}
      </b>
    </span>
  );
}

function Head({ title, sub }) {
  return (
    <div className="dc-head rv">
      <Fan className="dc-fan" />
      <h2>{title}</h2>
      <Divider className="dc-divider" />
      {sub && <p>{sub}</p>}
    </div>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-deco', cover: `${P}portrait.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function GildedDeco() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts({ ...demo.gifts(D), note: GIFT_NOTE });
  const { guest } = useInvite();
  const [I1, I2] = initials(D);
  const weekday = weekdayOf(D.start);
  const [area, ...rest] = D.place.split(',');
  const city = rest.join(',').trim();

  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.venue}, ${D.venueAddress}` };
  const VENUES = [
    { kind: 'The Ceremony', name: D.ceremony, time: 'Four o’clock in the afternoon', address: D.ceremonyAddress, icon: 'rings' },
    { kind: 'The Reception', name: D.venue, time: 'Seven o’clock until the New Year', address: D.venueAddress, icon: 'cheers' },
  ];
  const PHOTOS = [
    { src: photo(`${P}toast.jpg`), alt: 'Two champagne coupes touching' },
    { src: photo(`${P}rings.jpg`), alt: 'Wedding rings on black velvet' },
    { src: photo(`${P}portrait.jpg`), alt: `${D.a} and ${D.b} on a hotel staircase` },
    { src: photo(`${P}dance.jpg`), alt: `${D.a} and ${D.b} dancing` },
    { src: photo(`${P}lobby.jpg`), alt: 'An Art Deco hotel lobby' },
  ];
  const lightbox = useLightbox(PHOTOS);
  const track = useRef(null);
  const nudge = (d) => {
    const el = track.current;
    const item = el?.querySelector('button');
    if (el) el.scrollBy({ left: d * (item ? item.offsetWidth + 14 : el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <TemplateRoot
      className="t-deco"
      nav={NAV}
      monogram={`${I1} & ${I2}`}
      music="reverie"
      gate={{
        variant: 'scratch',
        names: `${D.a} & ${D.b}`,
        eyebrow: 'The pleasure of your company is requested',
        button: 'Enter the ballroom',
        scratch: [
          { value: D.day, label: D.month },
          { value: D.year, label: 'Year' },
          { value: timeOf(D.start), label: weekday },
        ],
      }}
    >
      {/* 1. Hero */}
      <section className="dc-hero">
        <header className="dc-nav k-topnav">
          <nav className="dc-nav-l" aria-label="Sections">
            {NAV.slice(0, 3).map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <a href="#top" className="dc-nav-crest" aria-label="Home">
            <Crest D={D} />
          </a>
          <nav className="dc-nav-r" aria-label="More sections">
            {NAV.slice(3, 5).map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
            <a href="#rsvp" className="dc-nav-rsvp">
              RSVP
            </a>
          </nav>
        </header>

        <Skyline className="dc-sky dc-sky--l" />
        <Skyline className="dc-sky dc-sky--r" />
        <HeroArch className="dc-arch" />
        <PhoneArch className="dc-arch-phone" />

        <div className="dc-hero-text">
          <p className="dc-eyebrow rv">Together with their families</p>
          <h1 className="dc-names rv d1">
            <span className="dc-foil">{D.a}</span>
            <em>&amp;</em>
            <span className="dc-foil">{D.b}</span>
          </h1>
          <Divider className="dc-divider rv d2" />
          <p className="dc-hero-date rv d2">
            {weekday} · {D.date}
          </p>
          <p className="dc-hero-venue rv d3">
            <span>{D.venue}</span>
            <i> · </i>
            <span>{D.place}</span>
          </p>
          <div className="dc-hero-actions rv d4">
            <button type="button" className="dc-btn" onClick={() => scrollToId('rsvp')}>
              RSVP
            </button>
            <CalendarButton event={EVENT} className="dc-btn dc-btn--line" label="Save the date" icon={false} />
          </div>
        </div>
      </section>

      {/* 2. Countdown */}
      <section className="dc-countdown dc-scale">
        <p className="dc-count-eyebrow rv">Until the clock strikes twelve</p>
        <Countdown date={D.start} className="dc-count rv d1" />
        <p className="dc-count-note rv d2">
          {weekday}, {longDate(D.start)} · {oclock(D.start)}
        </p>
      </section>

      {/* 3. The Affair */}
      <section className="dc-sec" id="affair">
        <Head title="The Affair" sub="Two addresses, one unforgettable night" />
        <Venues items={VENUES} className="dc-venues" />
      </section>

      {/* 4. The Evening */}
      <section className="dc-sec dc-evening" id="evening">
        <Chevron className="dc-chev dc-chev--top" />
        <Head title="The Evening" />
        <ol className="dc-prog">
          {schedule.map((s, i) => (
            <li key={`${s.time}${i}`} className={`rv d${(i % 4) + 1}${i === schedule.length - 1 ? ' is-last' : ''}`}>
              <span className="dc-prog-time">{s.time}</span>
              <span className="dc-prog-node" aria-hidden="true">
                <Icon name={s.icon || 'heart'} size={22} stroke={1.2} />
              </span>
              <span className="dc-prog-text">
                <span className="dc-prog-label">{s.label || s.tag}</span>
                {(s.note || s.sub) && <span className="dc-prog-note">{s.note || s.sub}</span>}
              </span>
            </li>
          ))}
        </ol>
        <Chevron className="dc-chev dc-chev--bottom" />
      </section>

      {/* 5. Attire */}
      <section className="dc-sec" id="attire">
        <Head title="Attire" sub="Black tie, and the more gilded the better" />
        <DressCode {...DRESS} palette={PALETTE} shape="square" className="dc-dress" />
      </section>

      {/* 6. The Wedding Party */}
      <section className="dc-sec dc-party dc-scale" id="party">
        <Head title="The Wedding Party" sub="With love to those who stand beside us" />
        <Entourage groups={entourage} className="dc-ent" />
      </section>

      {/* 7. Portraits */}
      <section className="dc-sec" id="portraits">
        <Head title="Portraits" />
        <div className="dc-gallery" ref={track}>
          {PHOTOS.map((p, i) => (
            <button
              key={p.src}
              type="button"
              className={`dc-ph dc-ph--${i + 1}${i === 2 ? ' is-arch' : ''} rv d${(i % 4) + 1}`}
              onClick={() => lightbox.open(i)}
              aria-label={`Open photo ${i + 1}`}
            >
              <img src={p.src} alt={p.alt} loading="lazy" />
            </button>
          ))}
        </div>
        <div className="dc-gallery-arrows">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous photo">
            <Icon name="left" size={20} stroke={1.4} />
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Next photo">
            <Icon name="right" size={20} stroke={1.4} />
          </button>
        </div>
        {lightbox.node}
      </section>

      {/* 8. Gifts */}
      <section className="dc-sec dc-gifts-sec" id="gifts">
        <Head title="Gifts" />
        <Gifts note={gifts.note} accounts={gifts.accounts} qr={gifts.qr} className="dc-gifts" />
      </section>

      {/* 9. Enquiries */}
      <section className="dc-sec" id="faq">
        <Head title="Enquiries" />
        <Faq items={FAQ} className="dc-faq" />
      </section>

      {/* 10. Kindly Reply */}
      <section className="dc-sec dc-rsvp" id="rsvp">
        <Head title="Kindly Reply" />
        <p className="dc-rsvp-lead rv">
          {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved {seatLine(guest)} in your honour.
          <br />
          Kindly reply by {D.replyBy}.
        </p>
        <Rsvp couple={D} deadline={D.replyBy} className="dc-rsvp-card rv d1" />
      </section>

      {/* 11. Footer */}
      <footer className="dc-foot">
        <Chevron className="dc-chev dc-chev--top" />
        <Crest D={D} />
        <p className="dc-foot-names">
          <span>{D.a}</span> <span>&amp; {D.b}</span>
        </p>
        <p className="dc-foot-meta">
          {romanDate(D.start)} · {city ? <span className="dc-foot-area">{area.trim()}, </span> : null}
          {city || area.trim()}
        </p>
        <div className="dc-social">
          <Icon name="instagram" size={18} stroke={1.3} />
          <Icon name="facebook" size={18} stroke={1.3} />
          <Icon name="mail" size={18} stroke={1.3} />
        </div>
      </footer>
    </TemplateRoot>
  );
}
