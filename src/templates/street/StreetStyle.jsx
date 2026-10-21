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
  mapsUrl,
  scrollToId,
  seatLine,
  useInvite,
  useLightbox,
} from '../kit/index.js';
import './street.css';

const P = '/templates/street-style/';
const PAPER = '#efe7da';

const D = {
  a: 'Rafael',
  b: 'Joy',
  start: '2027-06-12T16:00:00+07:00',
  end: '2027-06-12T23:00:00+07:00',
  date: 'June 12, 2027',
  place: 'Yogyakarta, Indonesia',
  venue: 'Omah Kebon',
  replyBy: 'May 1, 2027',
};

const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.venue}, ${D.place}` };

const DETAILS = [
  { icon: 'calendar', tone: 'green', title: 'Date', lines: [D.date, '4:00 PM'], cal: true },
  { icon: 'pin', tone: 'green', title: 'Location', lines: ['Yogyakarta,', 'Indonesia'], map: `${D.venue} ${D.place}` },
  { icon: 'rings', tone: 'orange', title: 'Ceremony', lines: ['4:00 PM', 'Sacred space'] },
  { icon: 'music', tone: 'green', title: 'Celebration', lines: ['7:00 PM', 'Good vibes'] },
  { icon: 'cutlery', tone: 'pink', title: 'Dinner', lines: ['7:30 PM', "Let's eat!"] },
];

const SCHEDULE = [
  { icon: 'flower', time: '4:00 PM', tag: 'The Yes', sub: 'We say I do' },
  { icon: 'camera', time: '4:30 PM', tag: 'Snap Time', sub: 'Photos & good times' },
  { icon: 'cheers', time: '6:00 PM', tag: 'Cheers!', sub: 'Drinks & canapés' },
  { icon: 'dinner', time: '7:30 PM', tag: 'Feast', sub: 'Dinner is served' },
  { icon: 'globe', time: '9:00 PM', tag: 'Dance!', sub: 'Dance under the stars' },
];

const EATS = ['Angkringan Kopi Joss', 'Sate Klathak Pak Bungkus', 'Gudeg Yu Djum', 'House of Raminten'];
const TODO = ['Jalan-jalan di Malioboro', 'Explore Candi Prambanan', 'Sunset di Bukit Bintang', 'Visit Kotagede'];

const PHOTOS = [
  { src: `${P}story.jpg`, alt: `${D.a} and ${D.b} at a street café` },
  { src: `${P}pol1.jpg`, alt: 'Riding through the old town' },
  { src: `${P}pol2.jpg`, alt: 'On the scooter' },
];

const NAV = [
  { id: 'story', label: 'Our Story' },
  { id: 'details', label: 'Details' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'attire', label: 'What to Wear' },
  { id: 'eats', label: 'Good Eats' },
  { id: 'faq', label: 'FAQ' },
  { id: 'rsvp', label: 'RSVP' },
];

const PALETTE = [
  { name: 'Leaf', hex: '#3f5b3c' },
  { name: 'Mango', hex: '#d9922a' },
  { name: 'Guava', hex: '#d8677a' },
  { name: 'Linen', hex: '#efe2c9' },
  { name: 'Ink', hex: '#1d1b19' },
];

const gifts = demo.gifts(D);

function Tape({ tone = 'green', tilt = -2, as: Tag = 'span', className = '', children, ...rest }) {
  return (
    <Tag className={`st-tape st-tape--${tone} ${className}`} style={{ '--tilt': `${tilt}deg` }} {...rest}>
      {children}
    </Tag>
  );
}

function Scribble({ className }) {
  return (
    <svg viewBox="0 0 120 14" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
      <path d="M3 9 C 20 4, 38 12, 58 7 S 96 4, 117 8" />
    </svg>
  );
}

function DoodleHeart({ className }) {
  return (
    <svg viewBox="0 0 40 36" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 32 C 6 22, 2 14, 6 8 C 10 2, 18 4, 20 10 C 22 3, 31 1, 35 8 C 39 15, 32 23, 20 32 Z" />
      <path d="M22 30 C 30 24, 36 17, 33 10" opacity="0.6" />
    </svg>
  );
}

function DoodleArrow({ className }) {
  return (
    <svg viewBox="0 0 60 40" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 6 C 10 26, 30 34, 50 24" />
      <path d="M40 18 L 51 24 L 43 33" />
      <path d="M14 10 C 18 6, 22 12, 16 14" />
    </svg>
  );
}

function Heading({ tone, tilt = -2, children }) {
  return (
    <div className="st-center st-head rv">
      <Tape tone={tone} tilt={tilt} as="h2">
        {children}
      </Tape>
    </div>
  );
}

export default function StreetStyle() {
  const { guest } = useInvite();
  const lightbox = useLightbox(PHOTOS);

  return (
    <TemplateRoot
      className="t-str"
      nav={NAV}
      monogram="R + J"
      music="canon"
      gate={{ variant: 'card', names: `${D.a} & ${D.b}`, monogram: 'R+J', eyebrow: 'Psst! You got mail', date: D.date, hint: 'Tap to open' }}
    >
      <section className="st-hero">
        <header className="st-nav k-topnav">
          <nav className="nav-links st-links">
            {NAV.slice(0, 5).map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <button type="button" className="st-oval" onClick={() => scrollToId('rsvp')}>
            RSVP Now
          </button>
        </header>

        <div className="st-hero-text">
          <Icon name="smile" size={38} stroke={1.6} className="st-smile rv" />
          <Tape tone="green" tilt={-4} className="rv">
            We&rsquo;re getting married!
          </Tape>
          <h1 className="st-names rv d1">
            <span>{D.a}</span>
            <em>&amp;</em>
            <span>{D.b}</span>
            <DoodleHeart className="st-names-heart" />
          </h1>
          <Tape tone="orange" tilt={-3} className="st-tagline rv d2">
            A love that roams together
          </Tape>
          <p className="st-when rv d2">
            {D.date}
            <br />
            {D.place}
          </p>
          <div className="st-cta rv d3">
            <Tape tone="pink" tilt={-2} as="button" type="button" onClick={() => scrollToId('rsvp')}>
              RSVP Now
            </Tape>
            <DoodleArrow className="st-arrow" />
          </div>
        </div>
        <TornEdge color={PAPER} fiber="#faf6ef" seed={3} height={34} />
      </section>

      <section className="st-story st-paper" id="story">
        <div className="st-story-photo rv">
          <button type="button" className="st-pol" onClick={() => lightbox.open(0)} aria-label="Open photo">
            <img src={`${P}story.jpg`} alt={`${D.a} and ${D.b} at a street café`} loading="lazy" />
          </button>
          <span className="st-pol-tape" />
          <Icon name="flower" size={56} stroke={1.4} className="st-sticker" />
        </div>
        <div className="st-story-text rv d1">
          <h2 className="st-h">
            Our Story
            <Scribble className="st-under" />
          </h2>
          <p className="st-mono">
            Two hearts.
            <br />
            <b>One wild adventure.</b>
          </p>
          <p className="st-mono">
            From the moment we met,
            <br />
            our story began.
            <br />
            Now, we invite you to be part of
            <br />
            our biggest adventure yet.
          </p>
          <div className="st-countbox">
            <span className="st-countbox-label">Days to go</span>
            <Countdown date={D.start} className="st-countdown" labels={['Days', 'Hrs', 'Min', 'Sec']} />
          </div>
        </div>
        <div className="st-story-side rv d2">
          <div className="st-note">
            <p>
              Different
              <br />
              roads,
              <br />
              same
              <br />
              destination.
            </p>
            <DoodleHeart className="st-note-heart" />
          </div>
          <img className="st-palm" src={`${P}palm.png`} alt="" loading="lazy" />
          <img className="st-sun" src={`${P}sun.png`} alt="" loading="lazy" />
        </div>
      </section>

      <section className="st-details st-paper" id="details">
        <Heading tone="orange">The Details</Heading>
        <div className="st-cols">
          {DETAILS.map((d, i) => (
            <div key={d.title} className={`st-col rv d${(i % 4) + 1}`}>
              <Icon name={d.icon} size={40} stroke={1.3} className={`st-ic st-ic--${d.tone}`} />
              <h3>{d.title}</h3>
              {d.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
              {d.cal && <CalendarButton event={EVENT} className="st-col-link" label="Add to calendar" icon={false} />}
              {d.map && (
                <a className="st-col-link" href={mapsUrl(d.map)} target="_blank" rel="noreferrer">
                  Open map
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="st-sched" id="schedule">
        <TornEdge color={PAPER} fiber="#faf6ef" seed={13} height={30} flip />
        <Icon name="star" size={46} stroke={1.4} className="st-star st-star--a" />
        <Icon name="star" size={26} stroke={1.4} className="st-star st-star--b" />
        <div className="st-center rv">
          <Tape tone="pink" tilt={-3} as="h2">
            It&rsquo;s happening!
          </Tape>
          <DoodleHeart className="st-sched-heart" />
        </div>
        <ol className="st-timeline rv d1">
          {SCHEDULE.map((s) => (
            <li key={s.tag}>
              <Icon name={s.icon} size={44} stroke={1.25} />
              <b>{s.time}</b>
              <span className="st-dot" />
              <span className="st-sticker-label">{s.tag}</span>
              <span className="st-sub">{s.sub}</span>
            </li>
          ))}
        </ol>
        <TornEdge color={PAPER} fiber="#faf6ef" seed={23} height={30} />
      </section>

      <section className="st-sec st-paper" id="attire">
        <Heading tone="green" tilt={-3}>
          What to wear
        </Heading>
        <DressCode
          note="Smart casual with a splash of colour. Comfy shoes: we will be dancing on old stone floors!"
          palette={PALETTE}
          shape="square"
          attire={[
            { who: 'Ladies', text: 'Sundresses, jumpsuits or a breezy two-piece. Bright is right.', icon: 'gown' },
            { who: 'Gentlemen', text: 'Linen shirts, chinos and loafers. Batik is very welcome.', icon: 'barong' },
          ]}
        />
      </section>

      <section className="st-guide st-paper">
        <div className="st-guide-col rv" id="eats">
          <div className="st-guide-head">
            <Tape tone="green" tilt={-2} as="h2">
              Good Eats
            </Tape>
            <Icon name="smile" size={30} stroke={1.6} />
          </div>
          <p className="st-mono st-caps">
            Yogyakarta is a food lover&rsquo;s dream!
            <br />
            Here are some of our faves.
          </p>
          <ul className="st-list">
            {EATS.map((e) => (
              <li key={e}>
                <Icon name="star" size={13} stroke={1.6} />
                {e}
              </li>
            ))}
          </ul>
          <Tape tone="pink" tilt={-1} as="a" href={mapsUrl('best food Yogyakarta')} target="_blank" rel="noreferrer">
            Explore more
          </Tape>
          <img className="st-bowl" src={`${P}bowl.png`} alt="" loading="lazy" />
        </div>
        <div className="st-guide-col rv d1" id="todo">
          <div className="st-guide-head">
            <Tape tone="orange" tilt={-2} as="h2">
              Things to Do
            </Tape>
          </div>
          <p className="st-mono st-caps">
            Make the most of your trip!
            <br />
            Some places we love.
          </p>
          <ul className="st-list">
            {TODO.map((e) => (
              <li key={e}>
                <Icon name="star" size={13} stroke={1.6} />
                {e}
              </li>
            ))}
          </ul>
          <Tape tone="green" tilt={-1} as="a" href={mapsUrl('things to do Yogyakarta')} target="_blank" rel="noreferrer">
            Explore more
          </Tape>
          <img className="st-bike" src={`${P}bike.png`} alt="" loading="lazy" />
        </div>
      </section>

      <section className="st-sec st-paper st-sec--line" id="entourage">
        <Heading tone="pink" tilt={-2}>
          The Squad
        </Heading>
        <Entourage groups={demo.entourage(D)} />
      </section>

      <section className="st-sec st-paper st-sec--line" id="gifts">
        <Heading tone="orange" tilt={-3}>
          Gifts
        </Heading>
        <Gifts note={gifts.note} accounts={gifts.accounts} />
      </section>

      <section className="st-sec st-paper st-sec--line" id="faq">
        <Heading tone="green" tilt={-2}>
          FAQ
        </Heading>
        <Faq items={demo.faq} />
      </section>

      <section className="st-rsvp st-paper" id="rsvp">
        <button type="button" className="st-pol st-pol--sm st-pol--l rv" onClick={() => lightbox.open(1)} aria-label="Open photo">
          <img src={`${P}pol1.jpg`} alt="Riding through the old town" loading="lazy" />
        </button>
        <div className="st-rsvp-text rv d1">
          <h2 className="st-h st-h--big">
            <DoodleHeart className="st-rsvp-heart" />
            See you there!
            <DoodleHeart className="st-rsvp-heart st-rsvp-heart--pink" />
          </h2>
          <p className="st-mono st-caps">
            {guest?.name ? `Dear ${guest.name}, we` : 'We'} saved {seatLine(guest)} for you.
            <br />
            Kindly RSVP by {D.replyBy}.
          </p>
        </div>
        <button type="button" className="st-pol st-pol--sm st-pol--r rv d2" onClick={() => lightbox.open(2)} aria-label="Open photo">
          <img src={`${P}pol2.jpg`} alt="On the scooter" loading="lazy" />
        </button>
        <Rsvp couple={D} deadline={D.replyBy} className="st-rsvp-card rv d2" />
        {lightbox.node}
      </section>

      <footer className="st-foot">
        <span>
          {D.a} &amp; {D.b}
        </span>
        <i>•</i>
        <span>{D.date}</span>
        <i>•</i>
        <span>{D.place}</span>
        <span className="st-foot-icons">
          <Icon name="instagram" size={18} stroke={1.5} />
          <Icon name="mail" size={18} stroke={1.5} />
        </span>
      </footer>
    </TemplateRoot>
  );
}
