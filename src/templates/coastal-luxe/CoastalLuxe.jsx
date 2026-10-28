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
  mapsUrl,
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
import { Pebble, TideChart, WaveDivider, WaveLine } from './motifs.jsx';
import './coastal-luxe.css';

// Coastal Luxe: a private island resort in pearl, sand, sage and pale ocean. Pebble-shaped photos,
// one hand-drawn wave line that runs the length of the page, a tide-chart program and a boat pass to open.

const P = '/templates/coastal-luxe/';

const DEFAULTS = {
  a: 'Isa',
  b: 'Paolo',
  start: '2027-05-08T16:30:00+08:00',
  end: '2027-05-08T23:30:00+08:00',
  date: '8 May 2027',
  place: 'Calamian Islands · Palawan',
  venue: 'Casa Alon Island Resort',
  venueAddress: 'The Pavilion, Isla Alon, Busuanga, Palawan',
  ceremony: 'The Cliff Terrace at Casa Alon',
  ceremonyAddress: 'Isla Alon, Busuanga, Palawan',
  replyBy: '8 April 2027',
  fromCode: 'MNL',
  fromCity: 'Manila',
  toCode: 'USU',
  toCity: 'Busuanga',
  boat: '4:00 PM',
  jetty: 'Pier 2',
};

const NAV = [
  { id: 'where', label: 'Where' },
  { id: 'tide', label: 'The Day' },
  { id: 'wear', label: 'What to Wear' },
  { id: 'people', label: 'Our People' },
  { id: 'moments', label: 'Moments' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'faq', label: 'Good to Know' },
  { id: 'reply', label: 'Reply' },
];

const SCHEDULE = [
  { time: '3:30 PM', label: 'Boats depart', note: 'From the town pier', icon: 'users' },
  { time: '4:30 PM', label: 'The ceremony', note: 'On the cliff terrace', icon: 'rings' },
  { time: '5:30 PM', label: 'Golden hour', note: 'Calamansi spritz, bare feet', icon: 'cheers' },
  { time: '6:30 PM', label: 'Dinner', note: 'The pavilion, catch of the day', icon: 'dinner' },
  { time: '8:30 PM', label: 'First dance', note: 'Under the paper lanterns', icon: 'music' },
  { time: '10:30 PM', label: 'Night swim', note: 'For the brave', icon: 'heart' },
];

const PALETTE = [
  { name: 'Pearl', hex: '#f4efe4' },
  { name: 'Sand', hex: '#d9c6a5' },
  { name: 'Sage', hex: '#a7b29c' },
  { name: 'Sea glass', hex: '#bfd3d6' },
  { name: 'Deep water', hex: '#6f8d93' },
];

const DRESS = {
  note: 'Island formal: light, natural fabrics in the soft tones of the shore. The terrace is stone and the paths are sand, so leave stilettos at home; flat sandals and espadrilles are perfect.',
  shape: 'square',
  attire: [
    { who: 'For her', icon: 'gown', text: 'Flowing midi or maxi dresses in linen, cotton or silk. Hair down, the wind will have its way.' },
    { who: 'For him', icon: 'barong', text: 'Linen suits or a barong in jusi, open collar, no tie. Loafers or leather sandals.' },
  ],
};

const FAQ = [
  { q: 'How do we get to the island?', a: 'Fly to Busuanga; our boats leave the town pier at 3:30 PM. The pass in this invitation is your boarding pass.' },
  { q: 'Where do we stay?', a: 'We have held rooms at the resort and two inns in town. Message us and we will book one for you.' },
  { q: 'When should I reply by?', a: 'By the date on your invitation, through the form below, so we can plan the boats.' },
  { q: 'What if the weather turns?', a: 'The pavilion is covered and the boats only sail when it is safe. We will message everyone on the morning if plans change.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
];

const MOMENTS = [
  { src: `${P}moment-1.jpg`, caption: 'Leaf shadows on the wall', shape: 2 },
  { src: `${P}moment-2.jpg`, caption: 'A boat, far out', shape: 3 },
  { src: `${P}moment-3.jpg`, caption: 'Feet in the water', shape: 4 },
  { src: `${P}moment-4.jpg`, caption: 'A laugh', shape: 1 },
  { src: `${P}moment-5.jpg`, caption: 'The table, set', shape: 3 },
];

const dayDate = (iso) => new Date(iso.slice(0, 10) + 'T12:00:00');
const weekdayOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { weekday: 'long' });
const dotted = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d} · ${m} · ${y}`;
};
const timeOf = (iso) => {
  const h = +iso.slice(11, 13);
  const m = iso.slice(14, 16);
  return `${h % 12 || 12}${m === '00' ? '' : ':' + m} ${h < 12 ? 'AM' : 'PM'}`;
};
const directions = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

/** Parents first, then the wide (paired) tiers, then everyone else in rows of three. */
const tiered = (groups) => {
  const wide = groups.filter((g) => g.wide);
  const rest = groups.filter((g) => !g.wide);
  return [...rest.slice(0, 2), ...wide, ...rest.slice(2)];
};

function Head({ kicker, title, className = '' }) {
  return (
    <header className={`co-head rv ${className}`}>
      <p className="co-caps">{kicker}</p>
      <h2 className="co-h2">{title}</h2>
    </header>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-coastal', cover: `${P}hero.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function CoastalLuxe() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = tiered(useEntourage(demo.entourage(D)));
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const [I1, I2] = initials(D);

  const moments = MOMENTS.map((m) => ({ ...m, src: photo(m.src), alt: `${D.a} and ${D.b}: ${m.caption}` }));
  const lightbox = useLightbox(moments);
  const island = D.ceremonyAddress.split(',').slice(0, 1).concat(D.ceremonyAddress.split(',').slice(-1)).map((s) => s.trim()).join(', ');
  const time = (icon, fallback) => schedule.find((s) => s.icon === icon)?.time || fallback;

  const venues = [
    { kind: `The ceremony · ${time('rings', timeOf(D.start))}`, name: D.ceremony, address: D.ceremonyAddress, img: `${P}terrace.jpg`, shape: 2 },
    { kind: `The reception · ${time('dinner', '6:30 PM')}`, name: D.venue, address: D.venueAddress, img: `${P}pavilion.jpg`, shape: 4 },
  ];
  const event = { title: `${D.a} & ${D.b}’s wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };

  return (
    <TemplateRoot
      className="t-coastal"
      nav={NAV}
      rsvp="reply"
      monogram={`${I1} & ${I2}`}
      music="canon"
      gate={{
        variant: 'ticket',
        names: `${D.a} & ${D.b}`,
        eyebrow: 'Your passage to the island, with love from',
        date: dotted(D.start),
        hint: 'Tap your pass',
        button: 'Open the invitation',
        ticket: {
          from: [D.fromCode, D.fromCity],
          to: [D.toCode, D.toCity],
          flight: D.boat,
          airline: D.venue.split(' ').slice(0, 2).join(' '),
          gate: D.jetty,
          labels: { head: 'Island transfer', passenger: 'Guest', flight: 'Boat', date: 'Date', gate: 'Jetty', seat: 'Seats', tear: 'Tear to board' },
          namesAbove: true,
        },
      }}
    >
      <header className="co-top k-topnav">
        <a className="co-top-mark" href="#top">
          {I1} <em>&amp;</em> {I2}
        </a>
        <nav aria-label="Sections">
          {NAV.slice(0, 5).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#reply" className="co-top-reply">
            Reply
          </a>
        </nav>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="co-hero">
        <div className="co-hero-text">
          <p className="co-caps rv">{D.place}</p>
          <h1 className="co-names rv d1">
            <span>{D.a}</span>
            <span>
              <em>&amp;</em> {D.b}
            </span>
          </h1>
          <p className="co-soft co-hero-line rv d2">are getting married on the island</p>
          <p className="co-hero-date rv d2">
            {weekdayOf(D.start)} · {dotted(D.start)}
          </p>
          <div className="co-hero-cta rv d3">
            <button type="button" className="co-btn" onClick={() => scrollToId('reply')}>
              Kindly reply
            </button>
            <CalendarButton event={event} className="co-textbtn" label="Save the date" icon={false} />
          </div>
        </div>
        <div className="co-hero-art rv d1">
          <Pebble shape={1} className="co-hero-photo">
            <img src={photo(`${P}hero.jpg`)} alt={`${D.a} and ${D.b}`} fetchpriority="high" />
          </Pebble>
          <Pebble shape={3} className="co-hero-detail">
            <img src={photo(`${P}detail.jpg`)} alt="" />
          </Pebble>
        </div>
      </section>

      {/* Sections 2–9 sit over one long wave line. */}
      <div className="co-flow">
        <WaveLine className="co-waveline" />

        <section className="co-count-sec">
          <p className="co-soft co-count-lead rv">The tide turns in</p>
          <Countdown date={D.start} className="co-count rv d1" labels={['Days', 'Hours', 'Minutes', 'Seconds']} />
        </section>

        <section className="co-band co-where" id="where">
          <div className="co-in co-where-grid">
            {venues.map((v, i) => (
              <article key={i} className={`co-venue rv d${i + 1}`}>
                {i === 0 && <Head kicker="Where" title={<>Two places,<br />one island</>} />}
                <Pebble shape={v.shape} className="co-venue-photo">
                  <img src={photo(v.img)} alt={v.name} loading="lazy" />
                </Pebble>
                <p className="co-caps co-caps--deep">{v.kind}</p>
                <h3 className="co-venue-name">{v.name}</h3>
                <p className="co-venue-addr">{v.address}</p>
                <div className="co-venue-links">
                  <a className="co-textbtn" href={mapsUrl(`${v.name} ${v.address}`)} target="_blank" rel="noreferrer">
                    View map
                  </a>
                  <a className="co-textbtn" href={directions(`${v.name} ${v.address}`)} target="_blank" rel="noreferrer">
                    Directions
                  </a>
                </div>
              </article>
            ))}
          </div>
          <WaveDivider className="co-divider" />
        </section>

        <section className="co-tide-sec" id="tide">
          <Head kicker="The day" title="The Tide of the Day" className="co-head--center" />
          <div className="co-tide-h rv d1">
            <TideChart items={schedule} />
          </div>
          <div className="co-tide-v rv d1">
            <TideChart items={schedule} vertical />
          </div>
          <WaveDivider className="co-divider" />
        </section>

        <section className="co-wear-sec" id="wear">
          <div className="co-in co-wear-grid">
            <Head kicker="What to wear" title={<>Linen,<br />not sequins</>} className="co-wear-head" />
            <DressCode className="co-wear" note={DRESS.note} palette={PALETTE} attire={DRESS.attire} shape="square" />
          </div>
          <WaveDivider className="co-divider" />
        </section>

        <section className="co-band co-people-sec" id="people">
          <Head kicker="Our people" title="Those Who Stand With Us" className="co-head--center" />
          <Entourage className="co-people" groups={entourage} />
        </section>

        <section className="co-moments-sec" id="moments">
          <Head kicker="Moments" title="Salt, Sun, Us" className="co-head--right" />
          <div className="co-moments">
            {moments.map((m, i) => (
              <button key={i} type="button" className={`co-moment co-moment--${i + 1} rv d${(i % 4) + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo: ${m.caption}`}>
                <Pebble shape={m.shape}>
                  <img src={m.src} alt={m.alt} loading="lazy" />
                </Pebble>
              </button>
            ))}
          </div>
          {lightbox.node}
        </section>

        <section className="co-info">
          <div className="co-in co-info-grid">
            <div id="gifts">
              <Head kicker="Gifts" title="With gratitude" />
              <Gifts className="co-gifts" note={gifts.note} accounts={gifts.accounts.map((a) => ({ ...a, label: a.name ? `${a.label} · ${a.name}` : a.label, name: '' }))} qr={gifts.qr} />
            </div>
            <div id="faq">
              <Head kicker="Good to know" title="Questions" />
              <Faq className="co-faq" items={FAQ} first={0} />
            </div>
          </div>
        </section>

        <section className="co-reply" id="reply">
          <WaveDivider className="co-reply-wave" width={1280} preserveAspectRatio="none" />
          <div className="co-in co-reply-in">
            <p className="co-caps rv">Kindly reply</p>
            <h2 className="co-reply-title rv d1">Will you join us?</h2>
            <p className="co-soft co-reply-lead rv d2">
              {guest?.name ? `Dear ${guest.name}, we` : 'We'} have saved {seatLine(guest)} on the boat for you. Kindly reply by {D.replyBy}.
            </p>
            <div className="rv d3">
              <Rsvp couple={D} deadline={D.replyBy} />
            </div>
          </div>
        </section>
      </div>

      <footer className="co-foot">
        <p className="co-foot-names">
          {D.a} <em>&amp;</em> {D.b}
        </p>
        <p className="co-caps">
          {dotted(D.start)} · {island}
        </p>
        <WaveDivider color="#6f8d93" />
      </footer>
    </TemplateRoot>
  );
}
