import {
  Countdown,
  DressCode,
  Entourage,
  Faq,
  Gifts,
  Program,
  Rsvp,
  TemplateRoot,
  demo,
  initials,
  mapsUrl,
  useDetails,
  useEntourage,
  useGifts,
  useLightbox,
  usePhoto,
  useSchedule,
} from '../kit/index.js';
import './heritage-filipiniana.css';

const P = '/templates/heritage-filipiniana/';

const DEFAULTS = {
  a: 'Sofia',
  aLast: 'Reyes',
  b: 'Gabriel',
  bLast: 'Lim',
  hashtag: '#SofiaAndGabriel',
  start: '2026-11-21T14:00:00+08:00',
  end: '2026-11-21T23:00:00+08:00',
  date: 'November 21, 2026',
  place: 'Makati City',
  replyBy: 'November 7, 2026',
  ceremony: 'St. Alphonsus Mary de Liguori Parish',
  ceremonyShort: 'The Church',
  ceremonyAddress: 'Magallanes Village, Makati City, Metro Manila, Philippines',
  ceremonyNote: 'Where we exchange our sacred vows.',
  venue: 'The Peninsula Manila',
  venueShort: 'The Reception',
  venueAddress: 'Ayala Avenue, Makati City, Metro Manila, Philippines',
  venueNote: 'An evening of dinner, dancing, and beautiful memories.',
  receptionTime: '6:00 PM',
  subtitle: 'Two stories. One forever.',
  tagline: 'Same roots, brighter tomorrows',
  intro: 'In the beautiful spaces between yesterday and tomorrow, we found our forever in each other.',
  welcome: 'We have saved a place in our hearts, and at our table, just for you.',
  invitation:
    'Together with our beloved families, we joyfully invite you to share in the celebration of our marriage. Your presence is our greatest blessing as we begin a beautiful new chapter.',
  storyTitle: 'A love written in time',
  storyIntro: 'Every love story is special, but ours is our favorite.',
  story1Year: '2019',
  story1Title: 'A serendipitous hello',
  story1Text: 'A chance meeting became the beginning of something extraordinary.',
  story2Year: '2021',
  story2Title: 'Our little adventures',
  story2Text: 'Through new places and ordinary days, we learned to call each other home.',
  story3Year: '2025',
  story3Title: 'A promise of forever',
  story3Text: 'One meaningful question. One joyful yes. A lifetime of promises ahead.',
  parentsNote: 'With the love, guidance, and blessings of our parents',
  aParent1: 'Mr. Antonio Reyes',
  aParent2: 'Mrs. Elena Reyes',
  bParent1: 'Mr. Roberto Lim',
  bParent2: 'Mrs. Isabel Lim',
  dressTitle: 'Formal Filipiniana & Black Tie',
  dressNote:
    'We would love to see you in elegant Filipiniana, Barong Tagalog, modern ternos, or formal eveningwear. Kindly reserve white and ivory for the bride.',
  paletteNote: 'Please choose muted, earthy, and champagne-inspired tones.',
  giftTitle: 'Your presence is our present',
  giftDetails: 'A wedding gift box will be available at the reception.',
  travelIntro: 'For guests traveling from outside Metro Manila, these details may help you plan your visit.',
  hotel: 'The Peninsula Manila',
  hotelNote: 'Conveniently located at our reception venue. Please contact the hotel directly for availability.',
  transport: 'Ride-hailing services such as Grab are widely available in Makati. Allow extra travel time for city traffic.',
  airport: 'Ninoy Aquino International Airport (MNL) serves Metro Manila.',
  reminder1: 'Kindly arrive at least 30 minutes before the ceremony.',
  reminder2: 'Our celebration is an intimate gathering; please follow the guest count indicated on your invitation.',
  reminder3: 'We would love an unplugged ceremony. Please keep phones away while we exchange vows.',
  closing: 'With hearts full of gratitude, we cannot wait to celebrate this once-in-a-lifetime moment with you.',
};

// Phone menu (the desktop bar shows the shorter TOP list, like the original site).
const NAV = [
  { id: 'story', label: 'Our Story' },
  { id: 'entourage', label: 'Entourage' },
  { id: 'details', label: 'The Wedding' },
  { id: 'dress', label: 'Attire' },
  { id: 'itinerary', label: 'Timeline' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'travel', label: 'Travel' },
  { id: 'faq', label: 'Questions' },
  { id: 'rsvp', label: 'RSVP' },
];
const TOP = ['story', 'details', 'entourage', 'gallery', 'rsvp'];

const SCHEDULE = [
  { time: '1:30 PM', label: 'Guest arrival', note: 'Please be seated before the ceremony', icon: 'users' },
  { time: '2:00 PM', label: 'Wedding ceremony', note: 'A sacred promise of forever', icon: 'rings' },
  { time: '4:00 PM', label: 'Cocktail hour', note: 'A little time to mingle and celebrate', icon: 'cheers' },
  { time: '6:00 PM', label: 'Wedding reception', note: 'Dinner, toasts, and dancing', icon: 'dinner' },
  { time: '9:00 PM', label: 'Dance the night away', note: 'The best memories are made together', icon: 'music' },
];

const PALETTE = [
  { name: 'Mocha', hex: '#8B735C' },
  { name: 'Camel', hex: '#AE9277' },
  { name: 'Champagne', hex: '#CFBFA7' },
  { name: 'Taupe', hex: '#6B6055' },
  { name: 'Sand', hex: '#B9A486' },
];

const DRESS = {
  note: DEFAULTS.dressNote,
  shape: 'circle',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'Filipiniana, a modern terno or a formal evening gown in muted, earthy tones.' },
    { who: 'Gentlemen', icon: 'barong', text: 'Barong Tagalog or a black-tie suit.' },
  ],
};

// Principal sponsors are written as pairs so "Mr. & Mrs. Miguel Santos" survives the Customize editor.
const ENTOURAGE = [
  {
    title: 'Our honored principal sponsors',
    wide: true,
    pairs: [
      ['Mr.', 'Mrs. Miguel Santos'],
      ['Mr.', 'Mrs. Victoria Cruz'],
      ['Mr.', 'Mrs. Rafael Mendoza'],
      ['Mr.', 'Mrs. Angela Villanueva'],
    ],
  },
  { title: 'Maid of Honor', names: ['Isabella Reyes'] },
  { title: 'Best Man', names: ['Daniel Lim'] },
  { title: 'Bridesmaids', names: ['Camila Torres', 'Bianca Garcia', 'Nina Castillo', 'Andrea Flores'] },
  { title: 'Groomsmen', names: ['Marco Villanueva', 'Luis Mendoza', 'Enzo Santos', 'Adrian Cruz'] },
  { title: 'Little Celebrants', names: ['Amelia Cruz — Flower Girl', 'Lucas Reyes — Ring Bearer', 'Mia Lim — Coin Bearer', 'Noah Santos — Bible Bearer'] },
];

const FAQ = [
  { q: 'May I bring a plus-one?', a: 'We have reserved seats for the guests named in your invitation. Please check the guest allowance in your RSVP.' },
  { q: 'Are children welcome?', a: 'We adore your little ones; however, our celebration is primarily an adults-only gathering, apart from children in our entourage.' },
  { q: 'What time should I arrive?', a: 'Please be at the church by 1:30 PM to be comfortably seated before our 2:00 PM ceremony.' },
  { q: 'Is there parking available?', a: 'Parking options may be available at the church and reception hotel. Please check directly with the venues before your visit.' },
];

const GIFT_NOTE =
  'The greatest gift is celebrating with the people we love. Should you wish to give something more, a monetary gift toward our new beginning would be warmly appreciated.';

const dayOf = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const weekdayOf = (iso) => dayOf(iso).toLocaleDateString('en-US', { weekday: 'long' });
function timeOf(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = Number(m[1]);
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}
// A CSS string for the gate's monogram (the curtain gate has no monogram slot of its own).
const cssString = (s) => `"${String(s).replace(/[\\"<>{};]/g, '')}"`;

function Ornament({ className = '' }) {
  return (
    <div className={`hf-orn ${className}`} aria-hidden="true">
      <span>✧</span>
    </div>
  );
}

function Head({ eyebrow, title, children }) {
  return (
    <div className="hf-center">
      <p className="hf-eyebrow rv">{eyebrow}</p>
      <h2 className="hf-title rv d1">{title}</h2>
      <Ornament className="rv d2" />
      {children && <p className="hf-copy hf-narrow rv d2">{children}</p>}
    </div>
  );
}

/** Line drawing of a Filipino church (ceremony) or a heritage hotel (reception), after the original site. */
function Building({ hotel }) {
  return (
    <svg className="hf-building" viewBox="0 0 480 195" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.15">
      <path d="M20 177 H460 M35 167H445 M50 151H430" />
      <path d="M95 160V89H385V160M115 89V72H365V89M140 72V56H340V72" />
      <path d="M205 160V102Q240 69 275 102V160 M215 160V105Q240 82 265 105V160" />
      <path d="M240 96V32M217 46H263M240 23V12 M232 19H248" />
      <path d="M58 160V62H112V160 M368 160V62H422V160" />
      <path d="M58 62L85 34L112 62M368 62L395 34L422 62" />
      <path d="M72 51H98M381 51H408" />
      <path d="M78 39V23M389 39V23" />
      <path d="M68 88H102M378 88H412" />
      <path d="M74 102V139M94 102V139M385 102V139M405 102V139" />
      <path d="M125 108H181M299 108H355M125 120H181M299 120H355" />
      <path d="M134 160V130H173V160M308 160V130H347V160" />
      {hotel ? (
        <>
          <path d="M155 56V28H325V56M170 28V18H310V28M190 18V9H290V18M240 9V0M126 55H354 M155 45H325" />
          <path d="M183 80H203M277 80H297M157 80H176M304 80H323" />
        </>
      ) : (
        <path d="M158 56L240 12L322 56 M195 40H285M225 57V72 M255 57V72" />
      )}
      <path d="M30 176l8-19 8 19m-9-11h17M445 176l-8-19-8 19m-17-11h17" />
      <path d="M18 180H464" />
    </svg>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-hf', cover: `${P}hero.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function HeritageFilipiniana() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(ENTOURAGE);
  const gifts = useGifts({ ...demo.gifts(D), note: GIFT_NOTE });
  const [I1, I2] = initials(D);
  const mono = `${I1} & ${I2}`;
  const fullDate = `${weekdayOf(D.start)}, ${D.date}`;
  const ceremonyTime = timeOf(D.start);
  const hero = photo(`${P}hero.jpg`);
  const arch = photo(`${P}architecture.jpg`);

  const GALLERY = [
    { src: hero, alt: 'Our forever begins' },
    { src: arch, alt: 'A place where stories linger' },
    { src: photo(`${P}moment.svg`), alt: 'The beauty in every little moment' },
    { src: photo(`${P}celebration.svg`), alt: 'A lifetime of celebrations' },
    { src: photo(`${P}light.svg`), alt: 'All the love, all the light' },
  ];
  const lightbox = useLightbox(GALLERY);

  const STORY = [1, 2, 3].map((n) => ({ year: D[`story${n}Year`], title: D[`story${n}Title`], text: D[`story${n}Text`] }));
  const REMINDERS = [D.reminder1, D.reminder2, D.reminder3, `Please RSVP on or before ${D.replyBy}.`].filter(Boolean);
  const VENUES = [
    { key: 'ceremony', kind: 'The sacred vows', time: ceremonyTime, name: D.ceremony, note: D.ceremonyNote, address: D.ceremonyAddress },
    { key: 'reception', kind: 'The celebration', time: D.receptionTime, name: D.venue, note: D.venueNote, address: D.venueAddress, hotel: true },
  ];

  return (
    <TemplateRoot
      className="t-hf"
      nav={NAV}
      rsvp="rsvp"
      monogram={mono}
      music="canon"
      style={{ '--img-arch': `url("${arch}")` }}
      gate={{
        variant: 'curtain',
        names: `${D.a} & ${D.b}`,
        eyebrow: 'Together with our families',
        date: fullDate,
        image: arch,
        button: 'Open our invitation  ↗',
      }}
    >
      <style>{`.t-hf .k-gate { --hf-mono: ${cssString(mono)}; }`}</style>

      {/* Top bar (desktop) */}
      <header className="hf-nav k-topnav">
        <a href="#top" className="hf-brand">
          {mono}
        </a>
        <nav className="hf-navlinks" aria-label="Sections">
          {TOP.map((id) => NAV.find((n) => n.id === id)).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
      </header>

      {/* 1. Split hero */}
      <section className="hf-hero" id="home">
        <div className="hf-hero-photo">
          <img src={hero} alt={`${D.a} and ${D.b}`} />
          <div className="hf-hero-caption rv">
            <small>{D.subtitle}</small>A celebration
            <br />
            of love, family,
            <br />
            and the home
            <br />
            we build together.
          </div>
          <div className="hf-hero-bottom rv d2">
            A love for the ages · {D.hashtag}
          </div>
        </div>
        <div className="hf-hero-side hf-paper">
          <div className="hf-botanical" aria-hidden="true">
            ❦
          </div>
          <p className="hf-eyebrow hf-hero-top rv">
            Together with our families
            <br />
            we joyfully invite you
            <br />
            to the wedding of
          </p>
          <h1 className="hf-hero-title rv d1">
            {D.a}
            <span className="hf-surname">{D.aLast}</span>
            <span className="hf-amp">&amp;</span>
            <span className="hf-second">{D.b}</span>
            <span className="hf-surname">{D.bLast}</span>
          </h1>
          <p className="hf-hero-date rv d2">{fullDate}</p>
          <div className="hf-hero-info rv d3">
            <div>
              <p className="hf-eyebrow">Ceremony</p>
              <p>{ceremonyTime}</p>
              <p className="hf-eyebrow">{D.ceremonyShort}</p>
            </div>
            <div>
              <p className="hf-eyebrow">Reception</p>
              <p>{D.receptionTime}</p>
              <p className="hf-eyebrow">{D.venueShort}</p>
            </div>
          </div>
          <p className="hf-script hf-tagline rv d4">{D.tagline}</p>
        </div>
      </section>

      <main>
        {/* 2. Introduction */}
        <section className="hf-sec hf-intro" id="introduction">
          <div className="hf-inner hf-intro-grid">
            <div className="hf-intro-image rv">
              <img loading="lazy" src={arch} alt="Historic Filipino architecture" />
            </div>
            <div className="hf-intro-copy">
              <p className="hf-eyebrow rv">Our forever begins here</p>
              <h2 className="hf-title rv d1">
                The beauty of <em>us.</em>
              </h2>
              <p className="hf-script rv d2">A love worth celebrating</p>
              <p className="hf-intro-text rv d2">{D.intro}</p>
              <Ornament className="rv d3" />
              <p className="hf-copy rv d3">{D.welcome}</p>
            </div>
          </div>
        </section>

        {/* 3. Invitation */}
        <section className="hf-sec hf-paper" id="invitation">
          <div className="hf-inner">
            <div className="hf-panel">
              <p className="hf-eyebrow rv">With joyful hearts &amp; grateful families</p>
              <p className="hf-script hf-large-script rv d1">You are invited</p>
              <p className="hf-panel-names rv d2">
                {D.a} <span className="hf-script">&amp;</span> {D.b}
              </p>
              <Ornament className="rv d2" />
              <p className="hf-copy hf-narrow rv d3">{D.invitation}</p>
              <div className="hf-gold-rule" />
              <p className="hf-eyebrow rv">{fullDate}</p>
              <p className="hf-subtitle rv d1">{D.ceremony}</p>
            </div>
          </div>
        </section>

        {/* 4. Story */}
        <section className="hf-sec hf-paper" id="story">
          <div className="hf-inner">
            <Head eyebrow="How our forever began" title={D.storyTitle}>
              {D.storyIntro}
            </Head>
            <ol className="hf-story">
              {STORY.map((m, i) => (
                <li key={i} className={`rv d${i + 1}`}>
                  <span className="hf-story-year">{m.year}</span>
                  <h3>{m.title}</h3>
                  <p>{m.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 5. Parents */}
        <section className="hf-sec hf-paper" id="parents">
          <div className="hf-inner">
            <Head eyebrow="With heartfelt gratitude" title="Our beloved parents">
              {D.parentsNote}
            </Head>
            <div className="hf-parents">
              <div className="rv">
                <p className="hf-eyebrow">Parents of {D.a}</p>
                <p className="hf-parent">{D.aParent1}</p>
                <p className="hf-parent">{D.aParent2}</p>
              </div>
              <div className="rv d1">
                <p className="hf-eyebrow">Parents of {D.b}</p>
                <p className="hf-parent">{D.bParent1}</p>
                <p className="hf-parent">{D.bParent2}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Entourage */}
        <section className="hf-sec hf-ent-sec" id="entourage">
          <div className="hf-inner">
            <Head eyebrow="The people who stand beside us" title="Our wedding entourage" />
            <Entourage groups={entourage} className="hf-ent" />
          </div>
        </section>

        {/* 7. The wedding day */}
        <section className="hf-sec hf-paper" id="details">
          <div className="hf-inner">
            <Head eyebrow="Where our story becomes forever" title="The wedding day" />
            <div className="hf-venues">
              {VENUES.map((v, i) => (
                <article key={v.key} className={`hf-card rv d${i + 1}`}>
                  <p className="hf-eyebrow">{v.kind}</p>
                  <Building hotel={v.hotel} />
                  <p className="hf-eyebrow">{fullDate}</p>
                  <p className="hf-venue-time">{v.time}</p>
                  <h3>{v.name}</h3>
                  <p>{v.note}</p>
                  <p>{v.address}</p>
                  <div className="hf-venue-actions">
                    <a className="hf-btn" target="_blank" rel="noopener noreferrer" href={mapsUrl(`${v.name} ${v.address}`)}>
                      View map &amp; directions ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 8. Dress code */}
        <section className="hf-sec hf-dress-sec" id="dress">
          <div className="hf-inner">
            <Head eyebrow="A note on attire" title="Dressed in timeless elegance" />
            <div className="hf-center hf-narrow">
              <p className="hf-subtitle rv">{D.dressTitle}</p>
              <DressCode note={D.dressNote} palette={PALETTE} shape="circle" className="hf-dress" />
              <p className="hf-eyebrow hf-palette-label rv">Our suggested color palette</p>
              <p className="hf-copy rv">{D.paletteNote}</p>
            </div>
          </div>
        </section>

        {/* 9. Countdown */}
        <section className="hf-count-wrap" id="countdown">
          <p className="hf-eyebrow rv">Counting every moment until forever</p>
          <Countdown date={D.start} className="hf-count rv d1" />
          <p className="hf-script hf-count-script rv d2">Until our forever</p>
        </section>

        {/* 10. Itinerary */}
        <section className="hf-sec hf-paper" id="itinerary">
          <div className="hf-inner">
            <Head eyebrow="The day, beautifully unfolding" title="Our celebration timeline" />
            <Program items={schedule} className="hf-schedule" />
          </div>
        </section>

        {/* 11. Gallery */}
        <section className="hf-sec hf-paper" id="gallery">
          <div className="hf-inner">
            <Head eyebrow="Moments we treasure" title="A glimpse of our love" />
            <div className="hf-gallery">
              {GALLERY.map((g, i) => (
                <button key={g.src + i} type="button" className={`hf-gphoto rv d${(i % 3) + 1}`} onClick={() => lightbox.open(i)} aria-label={`View photo: ${g.alt}`}>
                  <img loading="lazy" src={g.src} alt={g.alt} />
                  <span>{g.alt}</span>
                </button>
              ))}
            </div>
            {lightbox.node}
          </div>
        </section>

        {/* 12. RSVP */}
        <section className="hf-sec hf-rsvp-sec" id="rsvp">
          <div className="hf-inner">
            <Head eyebrow="The joy of your company" title="Kindly respond">
              Please RSVP by {D.replyBy}.
            </Head>
            <div className="hf-rsvp-box rv">
              <Rsvp couple={D} deadline={D.replyBy} className="hf-rsvp" />
            </div>
          </div>
        </section>

        {/* 13. Gifts */}
        <section className="hf-sec hf-paper" id="gifts">
          <div className="hf-inner hf-duo">
            <div>
              <p className="hf-eyebrow rv">With love and gratitude</p>
              <h2 className="hf-title rv d1">
                A gift of <em>love.</em>
              </h2>
              <p className="hf-subtitle rv d2">{D.giftTitle}</p>
              <Gifts note={gifts.note} accounts={gifts.accounts} qr={gifts.qr} className="hf-gifts" />
              <p className="hf-copy rv">{D.giftDetails}</p>
            </div>
            <img className="hf-gift-photo rv d2" loading="lazy" src={arch} alt="Warm heritage architecture" />
          </div>
        </section>

        {/* 14. Travel */}
        <section className="hf-sec hf-paper" id="travel">
          <div className="hf-inner">
            <Head eyebrow="For those joining us from afar" title="Travel & stay">
              {D.travelIntro}
            </Head>
            <div className="hf-venues">
              <div className="hf-card rv d1">
                <p className="hf-eyebrow">Recommended stay</p>
                <h3>{D.hotel}</h3>
                <p>{D.hotelNote}</p>
              </div>
              <div className="hf-card rv d2">
                <p className="hf-eyebrow">Getting around</p>
                <h3>Travel notes</h3>
                <p>{D.transport}</p>
                <p>{D.airport}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 15. FAQ */}
        <section className="hf-sec hf-paper" id="faq">
          <div className="hf-inner">
            <Head eyebrow="A few helpful details" title="Questions & answers" />
            <Faq items={FAQ} first={-1} className="hf-faq" />
          </div>
        </section>

        {/* 16. Reminders */}
        <section className="hf-sec hf-paper" id="reminders">
          <div className="hf-inner">
            <Head eyebrow="A gentle note" title="Before the big day" />
            <ol className="hf-reminders">
              {REMINDERS.map((r, i) => (
                <li key={i} className={`rv d${(i % 4) + 1}`}>
                  <strong>{String(i + 1).padStart(2, '0')}</strong>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 17. Closing */}
        <section className="hf-sec hf-closing" id="closing">
          <div className="hf-inner">
            <p className="hf-eyebrow rv">From our hearts to yours</p>
            <h2 className="hf-title rv d1">With all our love,</h2>
            <p className="hf-script hf-closing-names rv d2">
              {D.a} &amp; {D.b}
            </p>
            <div className="hf-closing-mono rv d3">{mono}</div>
            <p className="hf-copy hf-narrow rv">{D.closing}</p>
            <Ornament className="rv" />
            <p className="hf-eyebrow rv">
              {D.hashtag} · {fullDate}
            </p>
          </div>
        </section>
      </main>

      <footer className="hf-foot">
        <span>
          {D.a} &amp; {D.b} · Made with love
        </span>
        <span>{D.hashtag}</span>
        <span>
          {D.date} · {D.place}
        </span>
      </footer>
    </TemplateRoot>
  );
}
