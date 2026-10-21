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
import './cinematic.css';

const P = '/templates/cinematic/';

const D = {
  a: 'Nathan',
  b: 'Louise',
  start: '2027-03-13T16:30:00-07:00',
  end: '2027-03-13T23:30:00-07:00',
  date: 'March 13, 2027',
  place: 'Los Cabos, Mexico',
  venue: 'One&Only Palmilla',
  replyBy: 'February 1, 2027',
};

const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.venue}, ${D.place}` };

const SCHEDULE = [
  { icon: 'rings', time: '4:30 PM', label: 'Ceremony' },
  { icon: 'camera', time: '5:00 PM', label: 'Photos' },
  { icon: 'cocktail', time: '6:00 PM', label: 'Cocktail Hour' },
  { icon: 'dinner', time: '7:30 PM', label: 'Dinner' },
  { icon: 'music', time: '9:00 PM', label: 'Dancing' },
];

const GALLERY = [
  { src: `${P}g1.jpg`, alt: 'White rose bouquet' },
  { src: `${P}g2.jpg`, alt: 'Candlelit reception table' },
  { src: `${P}g3.jpg`, alt: 'The couple, forehead to forehead' },
  { src: `${P}g4.jpg`, alt: 'Bridal bouquet of garden roses' },
  { src: `${P}g5.jpg`, alt: 'Place setting with a printed menu' },
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
  { name: 'Ivory', hex: '#f4efe6' },
  { name: 'Champagne', hex: '#e3d3bc' },
  { name: 'Taupe', hex: '#b5a596' },
  { name: 'Sage', hex: '#a9b29c' },
  { name: 'Charcoal', hex: '#3d3935' },
];

const gifts = demo.gifts(D);

function Title({ children }) {
  return (
    <div className="cine-head rv">
      <h2 className="cine-title">{children}</h2>
      <span className="cine-rule" />
    </div>
  );
}

export default function Cinematic() {
  const { guest } = useInvite();
  const lightbox = useLightbox(GALLERY);

  return (
    <TemplateRoot
      className="t-cine"
      nav={NAV}
      monogram="n / L"
      music="canon"
      gate={{ variant: 'envelope', names: `${D.a} & ${D.b}`, monogram: 'N·L', petals: true }}
    >
      <header className="cine-nav k-topnav">
        <a className="cine-mono" href="#top">
          n<span>/</span>L
        </a>
        <nav className="nav-links cine-links">
          {NAV.slice(0, 5).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <button type="button" className="cine-btn" onClick={() => scrollToId('rsvp')}>
          RSVP Now
        </button>
      </header>

      <section className="cine-hero">
        <div className="cine-hero-text">
          <p className="cine-eyebrow rv">Together with their families</p>
          <h1 className="cine-names rv d1">
            <span>{D.a}</span>
            <em>and</em>
            <span>{D.b}</span>
          </h1>
          <span className="cine-rule rv d2" />
          <p className="cine-when rv d2">
            {D.date}
            <br />
            {D.place}
          </p>
          <p className="cine-invite rv d3">
            We invite you to celebrate
            <br />
            the beginning of our forever.
          </p>
          <div className="cine-hero-actions rv d4">
            <button type="button" className="cine-btn cine-btn--lg" onClick={() => scrollToId('rsvp')}>
              RSVP Now
            </button>
            <CalendarButton event={EVENT} className="cine-btn cine-btn--line" label="Save the date" icon={false} />
          </div>
        </div>
        <div className="cine-hero-img">
          <img src={`${P}hero.jpg`} alt={`${D.a} and ${D.b} on the beach`} />
        </div>
      </section>

      <section className="cine-story" id="story">
        <div className="cine-story-text rv">
          <p className="cine-label">Our Story</p>
          <span className="cine-rule cine-rule--left" />
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
        <div className="cine-story-img rv d1">
          <img src={`${P}story.jpg`} alt="Walking along the shore" loading="lazy" />
        </div>
      </section>

      <section className="cine-count">
        <p className="cine-label rv">Until we say I do</p>
        <Countdown date={D.start} className="cine-countdown rv d1" />
      </section>

      <section className="cine-details" id="details">
        <Title>The Details</Title>
        <div className="cine-cards">
          <div className="cine-card rv d1">
            <Icon name="calendar" size={32} stroke={1.1} />
            <h3>{D.date}</h3>
            <p>Four thirty in the afternoon</p>
            <CalendarButton event={EVENT} className="cine-cardlink" label="Add to calendar" icon={false} />
          </div>
          <div className="cine-card rv d2">
            <Icon name="pin" size={32} stroke={1.1} />
            <h3>{D.venue}</h3>
            <p>{D.place}</p>
            <a className="cine-cardlink" href={mapsUrl(`${D.venue} ${D.place}`)} target="_blank" rel="noreferrer">
              View map
            </a>
          </div>
          <div className="cine-card rv d3">
            <Icon name="cocktail" size={32} stroke={1.1} />
            <h3>Cocktail Hour</h3>
            <p>Immediately following the ceremony</p>
            <span className="cine-rule cine-rule--sm" />
          </div>
          <div className="cine-card rv d4">
            <Icon name="cheers" size={32} stroke={1.1} />
            <h3>Reception</h3>
            <p>Dinner, drinks &amp; dancing</p>
            <span className="cine-rule cine-rule--sm" />
          </div>
        </div>
      </section>

      <section className="cine-schedule" id="schedule">
        <Title>Schedule of Events</Title>
        <ol className="cine-timeline rv d1">
          {SCHEDULE.map((s) => (
            <li key={s.label}>
              <Icon name={s.icon} size={34} stroke={1.05} />
              <span className="cine-dot" />
              <b>{s.time}</b>
              <span>{s.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="cine-sec" id="attire">
        <Title>Dress Code</Title>
        <DressCode
          note="Formal beach attire in soft, neutral tones. Please leave the stilettos at home: the ceremony is on the sand."
          palette={PALETTE}
          attire={[
            { who: 'Ladies', text: 'Flowing long dresses or elegant cocktail dresses.', icon: 'gown' },
            { who: 'Gentlemen', text: 'Light suits or a barong with linen trousers.', icon: 'suit' },
          ]}
        />
      </section>

      <section className="cine-sec cine-sec--tint" id="entourage">
        <Title>The Entourage</Title>
        <Entourage groups={demo.entourage(D)} />
      </section>

      <section className="cine-gallery" id="gallery">
        {GALLERY.map((g, i) => (
          <button key={g.src} type="button" className={`cine-shot rv d${(i % 4) + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
            <img src={g.src} alt={g.alt} loading="lazy" />
          </button>
        ))}
        {lightbox.node}
      </section>

      <section className="cine-sec" id="gifts">
        <Title>Gifts</Title>
        <Gifts note={gifts.note} accounts={gifts.accounts} />
      </section>

      <section className="cine-sec cine-sec--tint" id="faq">
        <Title>Questions</Title>
        <Faq items={demo.faq} />
      </section>

      <section className="cine-rsvp" id="rsvp">
        <img className="cine-olive cine-olive--l" src={`${P}olive-l.png`} alt="" loading="lazy" />
        <img className="cine-olive cine-olive--r" src={`${P}olive-r.png`} alt="" loading="lazy" />
        <div className="cine-rsvp-text rv">
          <h2>Kindly Respond</h2>
          <p>
            {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved <u>{seatLine(guest)}</u> in your honor.
            <br />
            Please reply by {D.replyBy}.
          </p>
        </div>
        <Rsvp couple={D} deadline={D.replyBy} className="cine-rsvp-card rv d1" />
      </section>

      <footer className="cine-foot">
        <span className="cine-mono">
          n<span>/</span>L
        </span>
        <div>
          <p className="cine-foot-names">
            {D.a} &amp; {D.b}
          </p>
          <p className="cine-foot-meta">
            {D.date} <i>•</i> {D.place}
          </p>
        </div>
        <div className="cine-social">
          <Icon name="instagram" size={18} stroke={1.4} />
          <Icon name="facebook" size={18} stroke={1.4} />
          <Icon name="mail" size={18} stroke={1.4} />
        </div>
      </footer>
    </TemplateRoot>
  );
}
