import Icon from '../shared/Icon.jsx';
import { Peaks, Sprig, TornEdge } from '../shared/Decor.jsx';
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
import './mountain.css';

const P = '/templates/mountain/';
const PAPER = '#efe9df';

const D = {
  a: 'Ethan',
  b: 'Clara',
  start: '2027-09-18T16:00:00-06:00',
  end: '2027-09-18T23:30:00-06:00',
  date: 'September 18, 2027',
  place: 'Banff, Canada',
  venue: 'Alpine Ridge Lodge',
  replyBy: 'August 1, 2027',
};

const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.venue}, ${D.place}` };

const DETAILS = [
  { icon: 'calendar', title: 'Date', lines: [D.date, '4:00 PM'], cal: true },
  { icon: 'pin', title: 'Location', lines: [D.place, 'Mountain view'], map: `${D.venue} ${D.place}` },
  { icon: 'mountain', title: 'Ceremony', lines: ['4:30 PM', 'Cliffside'] },
  { icon: 'cheers', title: 'Reception', lines: ['6:00 PM', 'Dinner & drinks'] },
  { icon: 'music', title: 'After', lines: ['8:30 PM', 'Bonfire & stars'] },
];

const SCHEDULE = [
  { icon: 'rings', time: '4:00 PM', label: 'Ceremony' },
  { icon: 'camera', time: '4:30 PM', label: 'Photos' },
  { icon: 'cheers', time: '6:00 PM', label: 'Reception' },
  { icon: 'dinner', time: '7:30 PM', label: 'Dinner' },
  { icon: 'music', time: '9:00 PM', label: 'Celebration' },
];

const GALLERY = [
  { src: `${P}g1.jpg`, alt: 'Mountain lake at dusk' },
  { src: `${P}g2.jpg`, alt: 'The couple with a wildflower bouquet' },
  { src: `${P}g3.jpg`, alt: 'Valley below snowy peaks' },
  { src: `${P}g4.jpg`, alt: 'Walking the mountain trail' },
  { src: `${P}g5.jpg`, alt: 'Campfire under the peaks' },
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
  { name: 'Moss', hex: '#5f6b4e' },
  { name: 'Pine', hex: '#2f3d33' },
  { name: 'Rust', hex: '#9a5734' },
  { name: 'Sand', hex: '#cdb894' },
  { name: 'Stone', hex: '#8b8478' },
];

const gifts = demo.gifts(D);

function Heading({ children, light }) {
  return (
    <div className={`mt-heading rv${light ? ' mt-heading--light' : ''}`}>
      <span />
      <h2>{children}</h2>
      <span />
      <Sprig width={64} className="mt-heading-sprig" />
    </div>
  );
}

export default function Mountain() {
  const { guest } = useInvite();
  const lightbox = useLightbox(GALLERY);

  return (
    <TemplateRoot
      className="t-mtn"
      nav={NAV}
      monogram="E & C"
      music="canon"
      gate={{
        variant: 'curtain',
        image: `${P}hero.jpg`,
        eyebrow: 'Together in adventure',
        names: `${D.a} & ${D.b}`,
        date: `${D.date} · ${D.place}`,
        button: 'Open invitation',
      }}
    >
      <section className="mt-hero">
        <header className="mt-nav k-topnav">
          <a href="#top" className="mt-logo" aria-label="Home">
            <Peaks size={58} stroke={1.3} />
          </a>
          <nav className="nav-links mt-links">
            {NAV.slice(0, 6).map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <button type="button" className="mt-btn-ghost" onClick={() => scrollToId('rsvp')}>
            RSVP Now
          </button>
        </header>

        <div className="mt-hero-text">
          <p className="mt-eyebrow rv">Together in adventure</p>
          <h1 className="mt-names rv d1">
            <span>{D.a}</span>
            <em>
              <i />
              &amp;
              <i />
            </em>
            <span>{D.b}</span>
          </h1>
          <p className="mt-tagline rv d2">A love that moves mountains</p>
          <Peaks size={44} stroke={1.1} className="mt-hero-peaks rv d2" />
          <p className="mt-when rv d3">
            <b>{D.date}</b>
            <span>{D.place}</span>
          </p>
          <div className="mt-hero-actions rv d4">
            <button type="button" className="mt-btn" onClick={() => scrollToId('rsvp')}>
              RSVP Now
            </button>
            <CalendarButton event={EVENT} className="mt-btn-ghost" label="Save the date" icon={false} />
          </div>
        </div>
        <TornEdge color={PAPER} seed={11} height={34} />
      </section>

      <section className="mt-story mt-paper" id="story">
        <div className="mt-story-text rv">
          <Peaks size={52} stroke={1.1} className="mt-ink" />
          <h2 className="mt-h">Our Story</h2>
          <p className="mt-story-lead">
            Two hearts.
            <br />
            One wild adventure.
          </p>
          <p className="mt-body">
            From the moment we met,
            <br />
            our story began.
            <br />
            Now, we invite you to be part of
            <br />
            our biggest adventure yet.
          </p>
          <Sprig width={66} className="mt-ink" />
        </div>
        <div className="mt-story-photo rv d1">
          <figure className="mt-polaroid">
            <img src={`${P}story.jpg`} alt="Ethan and Clara resting on a summit" loading="lazy" />
          </figure>
          <img className="mt-grass" src={`${P}grass.png`} alt="" loading="lazy" />
        </div>
      </section>

      <section className="mt-count mt-paper">
        <p className="mt-h rv">The summit is near</p>
        <Countdown date={D.start} className="mt-countdown rv d1" />
      </section>

      <section className="mt-details mt-paper" id="details">
        <Heading>The Details</Heading>
        <div className="mt-cols">
          {DETAILS.map((d, i) => (
            <div key={d.title} className={`mt-col rv d${(i % 4) + 1}`}>
              <Icon name={d.icon} size={34} stroke={1.1} />
              <h3>{d.title}</h3>
              {d.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
              {d.cal && <CalendarButton event={EVENT} className="mt-col-link" label="Add to calendar" icon={false} />}
              {d.map && (
                <a className="mt-col-link" href={mapsUrl(d.map)} target="_blank" rel="noreferrer">
                  Open map
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-gallery mt-paper" id="gallery">
        <Heading>Gallery</Heading>
        <div className="mt-strip">
          {GALLERY.map((g, i) => (
            <button key={g.src} type="button" className={`mt-shot rv d${(i % 4) + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
              <img src={g.src} alt={g.alt} loading="lazy" />
            </button>
          ))}
        </div>
        {lightbox.node}
      </section>

      <section className="mt-schedule" id="schedule">
        <div className="mt-schedule-head rv">
          <h2>Schedule of Events</h2>
          <Sprig width={64} />
        </div>
        <ol className="mt-timeline rv d1">
          {SCHEDULE.map((s) => (
            <li key={s.label}>
              <Icon name={s.icon} size={38} stroke={1.05} />
              <span className="mt-dot" />
              <b>{s.time}</b>
              <span>{s.label}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-sec mt-paper" id="attire">
        <Heading>Dress Code</Heading>
        <DressCode
          note="Mountain formal: elegant, but ready for a breeze. Think earthy tones, layers and shoes that can handle a grassy ridge."
          palette={PALETTE}
          attire={[
            { who: 'Ladies', text: 'Long dresses in earthy tones, with a shawl for the evening.', icon: 'gown' },
            { who: 'Gentlemen', text: 'Suits in tweed, olive or brown. Ties optional.', icon: 'suit' },
          ]}
        />
      </section>

      <section className="mt-sec mt-paper mt-sec--tint" id="entourage">
        <Heading>The Entourage</Heading>
        <Entourage groups={demo.entourage(D)} />
      </section>

      <section className="mt-sec mt-paper" id="gifts">
        <Heading>Gifts</Heading>
        <Gifts note={gifts.note} accounts={gifts.accounts} />
      </section>

      <section className="mt-sec mt-paper mt-sec--tint" id="faq">
        <Heading>Questions</Heading>
        <Faq items={demo.faq} />
      </section>

      <section className="mt-rsvp mt-paper" id="rsvp">
        <div className="mt-rsvp-fog" aria-hidden="true" />
        <img className="mt-rsvp-flowers" src={`${P}rsvp-flowers.png`} alt="" loading="lazy" />
        <div className="mt-rsvp-text rv">
          <h2 className="mt-h">Kindly Respond</h2>
          <p className="mt-body">
            {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved <u>{seatLine(guest)}</u> in your honor.
            <br />
            Please reply by {D.replyBy}.
          </p>
        </div>
        <Rsvp couple={D} deadline={D.replyBy} className="mt-rsvp-card rv d1" />
      </section>

      <footer className="mt-foot">
        <div className="mt-foot-mark">
          <Peaks size={60} stroke={1.2} />
          <span>
            {D.a[0]} &amp; {D.b[0]}
          </span>
        </div>
        <div>
          <p className="mt-foot-names">
            {D.a} &amp; {D.b}
          </p>
          <p className="mt-foot-meta">
            {D.date} <i>•</i> {D.place}
          </p>
        </div>
        <div className="mt-social">
          <Icon name="instagram" size={19} stroke={1.3} />
          <Icon name="facebook" size={19} stroke={1.3} />
          <Icon name="mail" size={19} stroke={1.3} />
        </div>
      </footer>
    </TemplateRoot>
  );
}
