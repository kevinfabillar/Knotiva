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
import './europe.css';

const P = '/templates/europe-style/';

const DEFAULTS = {
  a: 'Julien',
  b: 'Camille',
  start: '2027-08-28T16:00:00+02:00',
  end: '2027-08-29T00:30:00+02:00',
  date: '28 August 2027',
  place: 'Provence, France',
  venue: 'Château de Tourreau',
  replyBy: '15 June 2027',
};

const GUIDE = [
  { icon: 'house', title: 'Stay', text: 'Our favorite places to stay', href: mapsUrl('boutique hotels Provence') },
  { icon: 'map', title: 'Things to do', text: 'Local spots & recommendations', href: mapsUrl('things to do Provence') },
  { icon: 'cutlery', title: 'Restaurants', text: 'Our favorite places to eat', href: mapsUrl('restaurants Provence') },
];

const EATS = [
  { img: 'e1.jpg', name: 'Le Petit Café', text: 'Great coffee & pastries in the morning.' },
  { img: 'e2.jpg', name: 'La Table du Village', text: 'Our go-to for lunch & local flavors.' },
  { img: 'e3.jpg', name: 'Le Bistrot', text: 'Perfect for dinner & wine.' },
];

const NAV = [
  { id: 'story', label: 'Our Story' },
  { id: 'details', label: 'Details' },
  { id: 'attire', label: 'Dress Code' },
  { id: 'weekend', label: 'Weekend' },
  { id: 'eat', label: 'Restaurants' },
  { id: 'faq', label: 'FAQ' },
  { id: 'rsvp', label: 'RSVP' },
];

const PALETTE = [
  { name: 'Linen', hex: '#efe7da' },
  { name: 'Stone', hex: '#c9bba6' },
  { name: 'Lavender', hex: '#a9a0bd' },
  { name: 'Olive', hex: '#8d8d6a' },
  { name: 'Taupe', hex: '#857761' },
];

const DRESS = {
  note: 'Summer formal in the colours of Provence: linen, stone, lavender and olive. The courtyard is cobbled, so choose your heels wisely.',
  shape: 'arch',
  attire: [{ who: 'Ladies', text: 'Long, light dresses in soft neutrals or lavender.', icon: 'gown' }, { who: 'Gentlemen', text: 'Linen suits in stone or sand. Loafers welcome.', icon: 'suit' }],
};

function Mono({ D, className = '' }) {
  return (
    <span className={`eu-mono ${className}`} aria-hidden="true">
      <span>{D.a[0]}</span>
      <i />
      <span>{D.b[0]}</span>
    </span>
  );
}

function Num({ n, children }) {
  return (
    <div className="eu-head">
      <span className="eu-num">{n}</span>
      <h2>{children}</h2>
      <span className="eu-rule" />
    </div>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-eu', cover: `${P}hero.jpg`, schedule: demo.program, palette: PALETTE, dress: DRESS };

export default function EuropeStyle() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(demo.program);
  const entourage = useEntourage(demo.entourage(D));
  const [I1, I2] = initials(D);
  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.venue}, ${D.place}` };
  const DETAILS = [
    { icon: 'calendar', title: 'Date', lines: [D.date, '4:00 PM'], cal: true },
    { icon: 'pin', title: 'Location', lines: ['Provence,', 'France'], map: `${D.venue} Provence` },
    { icon: 'rings', title: 'Ceremony', lines: ['4:00 PM', D.venue] },
    { icon: 'cheers', title: 'Celebration', lines: ['7:00 PM', 'Dinner & dancing'] },
    { icon: 'cutlery', title: 'After Party', lines: ['11:00 PM', "Let's dance!"] },
  ];
  const PHOTOS = [
    { src: photo(`${P}story.jpg`), alt: 'Coffee at a café table' },
    { src: photo(`${P}weekend.jpg`), alt: 'An old car parked in a narrow Provençal street' },
    { src: photo(`${P}hero.jpg`), alt: `${D.a} and ${D.b} walking down a cobbled lane` },
  ];
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const lightbox = useLightbox(PHOTOS);

  return (
    <TemplateRoot
      className="t-eu"
      nav={NAV}
      monogram={`${I1} / ${I2}`}
      music="reverie"
      gate={{ variant: 'seal', names: `${D.a} & ${D.b}`, monogram: `${I1}·${I2}`, eyebrow: 'You have an invitation from', hint: 'Break the seal' }}
    >
      <header className="eu-nav k-topnav">
        <a href="#top" aria-label="Home">
          <Mono D={D} />
        </a>
        <nav className="nav-links eu-links">
          {NAV.slice(0, 5).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <button type="button" className="eu-outline" onClick={() => scrollToId('rsvp')}>
          RSVP Now
        </button>
      </header>

      <section className="eu-hero">
        <div className="eu-hero-text">
          <p className="eu-eyebrow rv">We&rsquo;re getting married</p>
          <span className="eu-rule rv" />
          <h1 className="eu-names rv d1">
            <span>{D.a}</span>
            <span>
              <em>&amp;</em> {D.b}
            </span>
          </h1>
          <p className="eu-script rv d2">
            A love that
            <br />
            wanders, stays.
          </p>
          <p className="eu-where rv d3">
            <Icon name="pin" size={26} stroke={1.1} />
            <span>
              {D.date}
              <br />
              {D.place}
            </span>
          </p>
          <div className="eu-hero-actions rv d4">
            <button type="button" className="eu-btn" onClick={() => scrollToId('rsvp')}>
              RSVP Now
            </button>
            <CalendarButton event={EVENT} className="eu-outline" label="Save the date" icon={false} />
          </div>
        </div>
        <div className="eu-hero-photo">
          <img src={photo(`${P}hero.jpg`)} alt={`${D.a} and ${D.b} walking down a cobbled lane`} />
        </div>
      </section>

      <section className="eu-story" id="story">
        <div className="eu-story-text rv">
          <Num n="01">Our Story</Num>
          <p className="eu-body">
            Two hearts.
            <br />
            One wild adventure.
          </p>
          <p className="eu-body">
            From the moment we met,
            <br />
            our story began.
            <br />
            Now, we invite you to be part of
            <br />
            our biggest adventure yet.
          </p>
        </div>
        <div className="eu-story-art rv d1">
          <button type="button" className="eu-print" onClick={() => lightbox.open(0)} aria-label="Open photo">
            <img src={photo(`${P}story.jpg`)} alt="Coffee at a café table" loading="lazy" />
          </button>
          <img className="eu-stamp" src={photo(`${P}stamp.png`)} alt="" loading="lazy" />
          <svg className="eu-sprig" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 54 C 22 40, 36 26, 54 6" />
            <path d="M18 43 C 12 40, 10 34, 12 30 C 17 33, 19 38, 18 43 Z" />
            <path d="M27 34 C 21 31, 19 25, 21 21 C 26 24, 28 29, 27 34 Z" />
            <path d="M36 25 C 30 22, 28 16, 30 12 C 35 15, 37 20, 36 25 Z" />
            <path d="M22 40 C 26 44, 32 45, 36 43 C 33 39, 27 38, 22 40 Z" />
            <path d="M31 31 C 35 35, 41 36, 45 34 C 42 30, 36 29, 31 31 Z" />
          </svg>
        </div>
      </section>

      <section className="eu-count">
        <p className="eu-eyebrow rv">À bientôt</p>
        <Countdown date={D.start} className="eu-countdown rv d1" labels={['Jours', 'Heures', 'Minutes', 'Secondes']} />
      </section>

      <section className="eu-details" id="details">
        <div className="rv">
          <Num n="02">The Details</Num>
        </div>
        <div className="eu-cols">
          {DETAILS.map((d, i) => (
            <div key={d.title} className={`eu-col rv d${(i % 4) + 1}`}>
              <Icon name={d.icon} size={34} stroke={1.05} />
              <h3>{d.title}</h3>
              {d.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
              {d.cal && <CalendarButton event={EVENT} className="eu-col-link" label="Add to calendar" icon={false} />}
              {d.map && (
                <a className="eu-col-link" href={mapsUrl(d.map)} target="_blank" rel="noreferrer">
                  Open map
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="eu-sec" id="attire">
        <div className="rv">
          <Num n="03">Dress Code</Num>
        </div>
        <DressCode {...DRESS} palette={PALETTE} />
      </section>

      <section className="eu-guide">
        <div className="eu-weekend rv" id="weekend">
          <Num n="04">Weekend Guide</Num>
          <ul className="eu-guide-list">
            {GUIDE.map((g) => (
              <li key={g.title}>
                <Icon name={g.icon} size={34} stroke={1} />
                <div>
                  <h3>{g.title}</h3>
                  <p>{g.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <a className="eu-more" href={GUIDE[1].href} target="_blank" rel="noreferrer">
            View guide <Icon name="arrow" size={16} stroke={1.3} />
          </a>
        </div>
        <button type="button" className="eu-tall rv d1" onClick={() => lightbox.open(1)} aria-label="Open photo">
          <img src={photo(`${P}weekend.jpg`)} alt="An old car parked in a narrow Provençal street" loading="lazy" />
        </button>
        <div className="eu-eat rv d2" id="eat">
          <Num n="05">Eat &amp; Drink</Num>
          <p className="eu-body">
            A few of our favorite
            <br />
            places in Provence.
          </p>
          <ul className="eu-eat-list">
            {EATS.map((e) => (
              <li key={e.name}>
                <img src={photo(`${P}${e.img}`)} alt="" loading="lazy" />
                <div>
                  <h3>{e.name}</h3>
                  <p>{e.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <a className="eu-more" href={GUIDE[2].href} target="_blank" rel="noreferrer">
            See more <Icon name="arrow" size={16} stroke={1.3} />
          </a>
        </div>
        {lightbox.node}
      </section>

      <section className="eu-sec eu-sec--tint" id="entourage">
        <div className="rv">
          <Num n="06">The Entourage</Num>
        </div>
        <Entourage groups={entourage} />
      </section>

      <section className="eu-sec" id="gifts">
        <div className="rv">
          <Num n="07">Gifts</Num>
        </div>
        <Gifts note={gifts.note} accounts={gifts.accounts} qr={gifts.qr} />
      </section>

      <section className="eu-sec eu-sec--tint" id="faq">
        <div className="rv">
          <Num n="08">Questions</Num>
        </div>
        <Faq items={demo.faq} />
      </section>

      <section className="eu-rsvp" id="rsvp">
        <div className="eu-rsvp-text rv">
          <Num n="09">RSVP</Num>
          <p className="eu-body">
            {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved {seatLine(guest)} for you.
            <br />
            Kindly RSVP by
            <br />
            <b>{D.replyBy}.</b>
          </p>
          <figure className="eu-wall">
            <img src={photo(`${P}rsvp.jpg`)} alt="" loading="lazy" />
            <figcaption>
              We can&rsquo;t wait
              <br />
              to celebrate
              <br />
              with you!
              <Icon name="heart" size={22} stroke={1.3} />
            </figcaption>
          </figure>
        </div>
        <Rsvp couple={D} deadline={D.replyBy} className="eu-rsvp-card rv d1" />
      </section>

      <footer className="eu-foot">
        <div>
          <p className="eu-foot-names">
            {D.a} &amp; {D.b}
          </p>
          <p className="eu-foot-meta">
            {D.date} <i>•</i> {D.place}
          </p>
        </div>
        <div className="eu-social">
          <Icon name="instagram" size={19} stroke={1.3} />
          <Icon name="facebook" size={19} stroke={1.3} />
          <Icon name="mail" size={19} stroke={1.3} />
        </div>
      </footer>
    </TemplateRoot>
  );
}
