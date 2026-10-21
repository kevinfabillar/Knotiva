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
  demo,
  mapsUrl,
  scrollToId,
  seatLine,
  useInvite,
  useLightbox,
} from '../kit/index.js';
import './minimal.css';

const P = '/templates/street-minimal/';

const D = {
  a: 'Leo',
  b: 'Mika',
  start: '2027-08-21T16:00:00+07:00',
  end: '2027-08-21T23:00:00+07:00',
  date: 'August 21, 2027',
  place: 'Yogyakarta, Indonesia',
  venue: 'Rumah Kayu',
  replyBy: 'July 10, 2027',
};

const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.venue}, ${D.place}` };

const DETAILS = [
  { icon: 'calendar', title: 'Date', lines: [D.date, '4:00 PM'], cal: true },
  { icon: 'pin', title: 'Location', lines: ['Yogyakarta,', 'Indonesia'], map: `${D.venue} ${D.place}` },
  { icon: 'rings', title: 'Ceremony', lines: ['4:00 PM', 'Sacred space'] },
  { icon: 'cheers', title: 'Celebration', lines: ['7:00 PM', 'Good vibes'] },
  { icon: 'cutlery', title: 'Dinner', lines: ['7:30 PM', "Let's eat!"] },
];

const EATS = ['Angkringan Kopi Joss', 'Sate Klathak Pak Bungkus', 'Gudeg Yu Djum', 'House of Raminten'];
const TODO = ['Jalan-jalan di Malioboro', 'Explore Candi Prambanan', 'Sunset di Bukit Bintang', 'Visit Kotagede'];

const PHOTOS = [
  { src: `${P}story.jpg`, alt: `${D.a} and ${D.b} laughing on a street corner` },
  { src: `${P}food.jpg`, alt: 'A bowl of noodles with satay' },
  { src: `${P}becak.jpg`, alt: 'A becak parked on a quiet street' },
];

const NAV = [
  { id: 'story', label: 'Our Story' },
  { id: 'details', label: 'Details' },
  { id: 'attire', label: 'Dress Code' },
  { id: 'eat', label: 'Eat & Drink' },
  { id: 'todo', label: 'Things to Do' },
  { id: 'faq', label: 'FAQ' },
  { id: 'rsvp', label: 'RSVP' },
];

const PALETTE = [
  { name: 'Blush', hex: '#efb1aa' },
  { name: 'Olive', hex: '#b4b14a' },
  { name: 'Sand', hex: '#e2d4bd' },
  { name: 'White', hex: '#fbfaf6' },
  { name: 'Black', hex: '#151515' },
];

const gifts = demo.gifts(D);

function Arrow({ className }) {
  return (
    <svg viewBox="0 0 70 60" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M62 52 C 54 22, 36 8, 8 10" />
      <path d="M17 3 L 7 10 L 16 18" />
    </svg>
  );
}

function Dots({ className }) {
  const dots = [
    [6, 8, 2.4], [18, 4, 1.8], [30, 10, 2.6], [12, 20, 2], [26, 24, 2.8], [40, 18, 1.8], [8, 34, 2.2], [22, 38, 1.6], [36, 32, 2.4], [48, 28, 2],
    [44, 42, 2.6], [30, 48, 1.8], [56, 40, 1.6], [16, 50, 2.2],
  ];
  return (
    <svg viewBox="0 0 60 56" className={className} aria-hidden="true">
      {dots.map(([x, y, r]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="currentColor" />
      ))}
    </svg>
  );
}

function Sparkle({ className }) {
  return (
    <svg viewBox="0 0 30 30" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <path d="M15 3 V11 M15 19 V27 M3 15 H11 M19 15 H27 M7 7 L11.5 11.5 M18.5 18.5 L23 23 M23 7 L18.5 11.5 M11.5 18.5 L7 23" />
    </svg>
  );
}

function OutlineHeart({ className }) {
  return (
    <svg viewBox="0 0 40 38" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 34 C 8 25, 3 17, 6 10 C 9 3, 17 4, 20 11 C 23 3, 32 2, 35 9 C 38 17, 31 25, 20 34 Z" />
    </svg>
  );
}

function Head({ n, children }) {
  return (
    <div className="mn-head rv">
      <span className="mn-num">{n}</span>
      <h2 className="mn-h">{children}</h2>
    </div>
  );
}

export default function StreetMinimal() {
  const { guest } = useInvite();
  const lightbox = useLightbox(PHOTOS);

  return (
    <TemplateRoot
      className="t-min"
      nav={NAV}
      monogram="L & M"
      music="canon"
      gate={{
        variant: 'curtain',
        image: `${P}hero.jpg`,
        eyebrow: 'We’re getting married!',
        names: `${D.a} & ${D.b}`,
        date: `${D.date} · ${D.place}`,
        button: 'Open invitation',
      }}
    >
      <section className="mn-hero">
        <header className="mn-nav k-topnav">
          <nav className="nav-links mn-links">
            {NAV.slice(0, 5).map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <button type="button" className="mn-oval" onClick={() => scrollToId('rsvp')}>
            RSVP Now
          </button>
        </header>
        <div className="mn-hero-text">
          <p className="mn-eyebrow rv">
            We&rsquo;re getting married!
            <Sparkle className="mn-sparkle" />
          </p>
          <h1 className="mn-names rv d1">
            <span>{D.a}</span>
            <em>&amp;</em>
            <span>{D.b}</span>
          </h1>
          <svg className="mn-swoosh rv d2" viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true">
            <path d="M2 8 C 80 3, 200 2, 298 6" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" />
          </svg>
          <p className="mn-when rv d2">
            {D.date.toLowerCase()}
            <br />
            {D.place.toLowerCase()}
          </p>
          <div className="mn-hero-cta rv d3">
            <button type="button" className="mn-btn mn-btn--pink" onClick={() => scrollToId('rsvp')}>
              RSVP Now <Icon name="arrow" size={18} stroke={1.8} />
            </button>
            <CalendarButton event={EVENT} className="mn-btn mn-btn--glass" label="Save the date" icon={false} />
          </div>
        </div>
        <svg className="mn-curve" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 60 L0 34 Q 520 -14 1000 30 L1000 60 Z" />
        </svg>
      </section>

      <section className="mn-sec mn-story" id="story">
        <div className="mn-story-text rv">
          <Head n="01">Our Story</Head>
          <p className="mn-strong">
            Two hearts.
            <br />
            One wild adventure.
          </p>
          <p className="mn-body">
            From the moment we met,
            <br />
            our story began.
            <br />
            Now, we invite you to be part of
            <br />
            our biggest adventure yet.
          </p>
          <div className="mn-count">
            <Countdown date={D.start} className="mn-countdown" labels={['days', 'hrs', 'min', 'sec']} />
            <span className="mn-count-label">until the big day</span>
          </div>
        </div>
        <div className="mn-story-photo rv d1">
          <span className="mn-blob" />
          <Dots className="mn-dots" />
          <Arrow className="mn-arrow" />
          <button type="button" className="mn-pol" onClick={() => lightbox.open(0)} aria-label="Open photo">
            <img src={`${P}story.jpg`} alt={`${D.a} and ${D.b} laughing on a street corner`} loading="lazy" />
          </button>
        </div>
      </section>

      <section className="mn-sec mn-details" id="details">
        <Head n="02">The Details</Head>
        <div className="mn-cols">
          {DETAILS.map((d, i) => (
            <div key={d.title} className={`mn-col rv d${(i % 4) + 1}`}>
              <Icon name={d.icon} size={34} stroke={1.25} />
              <h3>{d.title}</h3>
              {d.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
              {d.cal && <CalendarButton event={EVENT} className="mn-col-link" label="Add to calendar" icon={false} />}
              {d.map && (
                <a className="mn-col-link" href={mapsUrl(d.map)} target="_blank" rel="noreferrer">
                  Open map
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mn-sec mn-attire" id="attire">
        <Head n="03">Dress Code</Head>
        <DressCode
          note="Clean, relaxed and a little bit cool. Whites, creams and soft pastels. Sneakers are fine!"
          palette={PALETTE}
          shape="arch"
          attire={[
            { who: 'Ladies', text: 'Slip dresses, linen sets or a sharp white suit.', icon: 'gown' },
            { who: 'Gentlemen', text: 'Linen shirt, light trousers, clean sneakers or loafers.', icon: 'suit' },
          ]}
        />
      </section>

      <section className="mn-sec mn-eat" id="eat">
        <div className="mn-eat-photo rv">
          <div className="mn-eat-head">
            <Head n="04">Eat &amp; Drink</Head>
          </div>
          <Arrow className="mn-arrow mn-arrow--down" />
          <button type="button" className="mn-plate" onClick={() => lightbox.open(1)} aria-label="Open photo">
            <img src={`${P}food.jpg`} alt="A bowl of noodles with satay" loading="lazy" />
          </button>
          <span className="mn-tape" />
        </div>
        <div className="mn-eat-text rv d1">
          <p className="mn-strong mn-caps">
            Yogyakarta is a food lover&rsquo;s dream!
            <br />
            Here are some of our faves.
          </p>
          <ul className="mn-list">
            {EATS.map((e) => (
              <li key={e}>
                <Icon name="heart" size={14} stroke={1.4} className="mn-li-heart" />
                {e}
              </li>
            ))}
          </ul>
          <a className="mn-btn mn-btn--olive" href={mapsUrl('best food Yogyakarta')} target="_blank" rel="noreferrer">
            Explore more <Icon name="arrow" size={18} stroke={1.8} />
          </a>
        </div>
      </section>

      <section className="mn-sec mn-todo" id="todo">
        <div className="mn-todo-text rv">
          <Head n="05">Things to Do</Head>
          <ul className="mn-list">
            {TODO.map((e) => (
              <li key={e}>
                <Icon name="star" size={14} stroke={1.4} />
                {e}
              </li>
            ))}
          </ul>
          <a className="mn-btn mn-btn--pink" href={mapsUrl('things to do Yogyakarta')} target="_blank" rel="noreferrer">
            Explore more <Icon name="arrow" size={18} stroke={1.8} />
          </a>
        </div>
        <div className="mn-todo-photo rv d1">
          <button type="button" className="mn-pol mn-pol--r" onClick={() => lightbox.open(2)} aria-label="Open photo">
            <img src={`${P}becak.jpg`} alt="A becak parked on a quiet street" loading="lazy" />
          </button>
          <Dots className="mn-dots mn-dots--r" />
        </div>
        {lightbox.node}
      </section>

      <section className="mn-sec mn-ent" id="entourage">
        <Head n="06">The Entourage</Head>
        <Entourage groups={demo.entourage(D)} />
      </section>

      <section className="mn-sec mn-gifts" id="gifts">
        <Head n="07">Gifts</Head>
        <Gifts note={gifts.note} accounts={gifts.accounts} />
      </section>

      <section className="mn-sec mn-faq" id="faq">
        <Head n="08">FAQ</Head>
        <Faq items={demo.faq} />
      </section>

      <section className="mn-sec mn-rsvp" id="rsvp">
        <span className="mn-blob mn-blob--rsvp" />
        <div className="mn-rsvp-text rv">
          <div className="mn-head">
            <span className="mn-num">09</span>
            <h2 className="mn-h">
              RSVP <OutlineHeart className="mn-rsvp-heart" />
            </h2>
          </div>
          <p className="mn-caps mn-small">
            {guest?.name ? `Dear ${guest.name}, we` : 'We'} saved {seatLine(guest)} for you.
            <br />
            Kindly RSVP by <b>{D.replyBy}.</b>
          </p>
        </div>
        <Rsvp couple={D} deadline={D.replyBy} className="mn-rsvp-card rv d1" />
      </section>

      <footer className="mn-foot">
        <div>
          <p className="mn-foot-names">
            {D.a} &amp; {D.b}
          </p>
          <p className="mn-foot-meta">
            {D.date} <i>•</i> {D.place}
          </p>
        </div>
        <div className="mn-social">
          <Icon name="instagram" size={19} stroke={1.4} />
          <Icon name="facebook" size={19} stroke={1.4} />
          <Icon name="mail" size={19} stroke={1.4} />
        </div>
      </footer>
    </TemplateRoot>
  );
}
