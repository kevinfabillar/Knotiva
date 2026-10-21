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
import './dark.css';

const P = '/templates/dark-fiery-flowers/';

const D = {
  a: 'Adrian',
  b: 'Celeste',
  start: '2027-10-23T16:30:00+08:00',
  end: '2027-10-23T23:30:00+08:00',
  date: 'October 23, 2027',
  place: 'Tagaytay, Philippines',
  venue: 'Villa Isabella',
  replyBy: 'September 15, 2027',
};

const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.venue}, ${D.place}` };

const DETAILS = [
  { icon: 'calendar', title: D.date, sub: 'Four thirty in the afternoon', cal: true },
  { icon: 'pin', title: D.venue, sub: D.place, map: `${D.venue} ${D.place}` },
  { icon: 'cocktail', title: 'Cocktail Hour', sub: 'Immediately following the ceremony' },
  { icon: 'cheers', title: 'Reception', sub: 'Dinner, drinks & dancing' },
];

const SCHEDULE = [
  { icon: 'rings', time: '4:30 PM', label: 'Ceremony' },
  { icon: 'camera', time: '5:00 PM', label: 'Photos' },
  { icon: 'cocktail', time: '6:00 PM', label: 'Cocktail Hour' },
  { icon: 'dinner', time: '7:30 PM', label: 'Dinner' },
  { icon: 'music', time: '9:00 PM', label: 'Dancing' },
];

const GALLERY = [
  { src: `${P}g1.jpg`, alt: 'Burgundy rose bouquet' },
  { src: `${P}g2.jpg`, alt: 'Candlelit table' },
  { src: `${P}g3.jpg`, alt: 'The couple in silhouette' },
  { src: `${P}g4.jpg`, alt: 'Dark rose bouquet' },
  { src: `${P}g5.jpg`, alt: 'Place setting with a velvet menu' },
];

const FAQ = [
  { q: 'What should I wear?', a: 'Black-tie optional, in deep jewel tones. The garden path is gravel, so bring a second pair of shoes for the walk.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but this will be an adults-only evening.' },
  { q: 'Where should we stay?', a: 'We have a room block at the villa’s garden suites until September 1. Mention our names when you book.' },
  { q: 'Is there parking?', a: 'Yes. Free valet parking is available at the main gate from 3:30 PM.' },
];

const NAV = [
  { id: 'story', label: 'Our Story' },
  { id: 'details', label: 'Details' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'attire', label: 'Attire' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'faq', label: 'FAQ' },
  { id: 'rsvp', label: 'RSVP' },
];

const PALETTE = [
  { name: 'Plum', hex: '#4a1f35' },
  { name: 'Wine', hex: '#6d1f2c' },
  { name: 'Mauve', hex: '#9b6a7f' },
  { name: 'Copper', hex: '#b87c4c' },
  { name: 'Black', hex: '#121012' },
];

const gifts = demo.gifts(D);

function Title({ children }) {
  return (
    <div className="dk-head rv">
      <h2 className="dk-title">{children}</h2>
      <span className="dk-rule" />
    </div>
  );
}

export default function DarkFieryFlowers() {
  const { guest } = useInvite();
  const lightbox = useLightbox(GALLERY);

  return (
    <TemplateRoot
      className="t-dark"
      nav={NAV}
      monogram="A & C"
      music="reverie"
      gate={{ variant: 'doors', eyebrow: 'You are invited to the wedding of', names: `${D.a} & ${D.b}`, date: D.date, button: 'Open the doors' }}
    >
      <header className="dk-nav k-topnav">
        <a className="dk-mono" href="#top">
          A<span>&amp;</span>C
        </a>
        <nav className="nav-links dk-links">
          {NAV.slice(0, 6).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <button type="button" className="dk-btn dk-btn--sm" onClick={() => scrollToId('rsvp')}>
          RSVP
        </button>
      </header>

      <section className="dk-hero">
        <div className="dk-hero-text">
          <p className="dk-eyebrow rv">Welcome to our wedding</p>
          <h1 className="dk-names rv d1">
            <span>{D.a}</span>
            <em>and</em>
            <span>{D.b}</span>
          </h1>
          <span className="dk-rule rv d2" />
          <p className="dk-when rv d2">
            {D.date} <i>•</i> {D.place}
          </p>
          <div className="dk-hero-actions rv d3">
            <button type="button" className="dk-btn" onClick={() => scrollToId('rsvp')}>
              RSVP Now
            </button>
            <CalendarButton event={EVENT} className="dk-btn dk-btn--ghost" label="Save the date" icon={false} />
          </div>
        </div>
      </section>

      <section className="dk-story" id="story">
        <div className="dk-story-text rv">
          <p className="dk-label">Our Story</p>
          <span className="dk-rule dk-rule--left" />
          <h2>Two souls, one journey.</h2>
          <p>
            From the moment we met,
            <br />
            our story began.
            <br />
            Now, we invite you to be part
            <br />
            of our forever.
          </p>
        </div>
      </section>

      <section className="dk-countdown">
        <div className="dk-countdown-inner rv">
          <p className="dk-label">Counting down to forever</p>
          <Countdown date={D.start} className="dk-count" />
          <CalendarButton event={EVENT} className="dk-link" label="Save the date" icon={false} />
        </div>
      </section>

      <section className="dk-details" id="details">
        <Title>The Details</Title>
        <div className="dk-cols">
          {DETAILS.map((d, i) => (
            <div key={d.title} className={`dk-col rv d${i + 1}`}>
              <Icon name={d.icon} size={36} stroke={1} />
              <h3>{d.title}</h3>
              <p>{d.sub}</p>
              {d.cal && <CalendarButton event={EVENT} className="dk-link" label="Add to calendar" icon={false} />}
              {d.map && (
                <a className="dk-link" href={mapsUrl(d.map)} target="_blank" rel="noreferrer">
                  Open map
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="dk-schedule" id="schedule">
        <Title>Schedule of Events</Title>
        <ol className="dk-timeline rv d1">
          {SCHEDULE.map((s) => (
            <li key={s.label}>
              <Icon name={s.icon} size={38} stroke={1} />
              <span className="dk-dot" />
              <b>{s.time}</b>
              <span>{s.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="dk-sec dk-sec--attire" id="attire">
        <Title>Dress Code</Title>
        <DressCode
          note="Black-tie optional. We would love to see you in deep jewel tones: plum, wine, mauve and copper."
          palette={PALETTE}
          shape="petal"
          attire={[
            { who: 'Ladies', text: 'Floor-length gowns or elegant cocktail dresses in the palette.', icon: 'gown' },
            { who: 'Gentlemen', text: 'Black tuxedo or a dark suit with a jewel-tone tie.', icon: 'suit' },
          ]}
        />
      </section>

      <section className="dk-sec dk-sec--ent" id="entourage">
        <Title>The Entourage</Title>
        <Entourage groups={demo.entourage(D)} />
      </section>

      <section className="dk-gallery" id="gallery">
        <Title>Gallery</Title>
        <div className="dk-grid">
          {GALLERY.map((g, i) => (
            <button key={g.src} type="button" className={`dk-shot rv d${(i % 4) + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
              <img src={g.src} alt={g.alt} loading="lazy" />
            </button>
          ))}
        </div>
        {lightbox.node}
      </section>

      <section className="dk-sec dk-sec--gifts" id="gifts">
        <Title>Gifts</Title>
        <Gifts note={gifts.note} accounts={gifts.accounts} />
      </section>

      <section className="dk-faq" id="faq">
        <div className="dk-faq-card rv">
          <h2>Questions &amp; Answers</h2>
          <Faq items={FAQ} />
        </div>
      </section>

      <section className="dk-rsvp" id="rsvp">
        <div className="dk-rsvp-text rv">
          <h2 className="dk-label">Kindly Respond</h2>
          <p>
            {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved <u>{seatLine(guest)}</u> in your honor.
            <br />
            Please reply by {D.replyBy}.
          </p>
        </div>
        <Rsvp couple={D} deadline={D.replyBy} className="rv d1" />
      </section>

      <footer className="dk-foot">
        <span className="dk-foot-mono">
          A<span>&amp;</span>C
        </span>
        <div>
          <p className="dk-foot-names">
            {D.a} &amp; {D.b}
          </p>
          <p className="dk-foot-meta">
            {D.date} <i>•</i> {D.place}
          </p>
        </div>
        <div className="dk-social">
          <Icon name="instagram" size={18} stroke={1.3} />
          <Icon name="facebook" size={18} stroke={1.3} />
          <Icon name="mail" size={18} stroke={1.3} />
        </div>
      </footer>
    </TemplateRoot>
  );
}
