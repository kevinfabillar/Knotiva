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
import { Calamansi, EstateMap, LeafRule, Tiles, romanDate } from './motifs.jsx';
import './haciendera.css';

// Modern Haciendera: an ancestral sugar estate in Negros. Cream paper, terracotta roof tiles,
// arched windows, an illustrated map of the grounds, a menu-card program and zaguán doors to open.

const P = '/templates/haciendera/';

const DEFAULTS = {
  a: 'Carmen',
  b: 'Diego',
  start: '2027-02-20T16:00:00+08:00',
  end: '2027-02-20T23:00:00+08:00',
  date: '20 February 2027',
  place: 'Silay, Negros Occidental',
  venue: 'Casa Santa Clara',
  venueAddress: 'The main house and garden, Hacienda Santa Clara, Silay City',
  ceremony: 'The Chapel at Hacienda Santa Clara',
  ceremonyAddress: 'Hacienda Santa Clara, Silay City, Negros Occidental',
  estate: 'Hacienda Santa Clara',
  replyBy: '20 January 2027',
};

const NAV = [
  { id: 'estate', label: 'The Estate' },
  { id: 'dia', label: 'The Day' },
  { id: 'vestimenta', label: 'Attire' },
  { id: 'familia', label: 'La Familia' },
  { id: 'recuerdos', label: 'Recuerdos' },
  { id: 'regalos', label: 'Gifts' },
  { id: 'preguntas', label: 'Questions' },
  { id: 'respuesta', label: 'RSVP' },
];

const SCHEDULE = [
  { time: '3:30 PM', label: 'Arrivals & lemonade', note: 'Calamansi on the veranda', icon: 'users' },
  { time: '4:00 PM', label: 'La ceremonia', note: 'The chapel', icon: 'rings' },
  { time: '5:00 PM', label: 'Merienda cena', note: 'Piaya, napoleones and the old garden', icon: 'cheers' },
  { time: '6:30 PM', label: 'La cena', note: 'Dinner at the long table in the sala', icon: 'dinner' },
  { time: '8:30 PM', label: 'El primer baile', note: 'A rondalla, then everyone', icon: 'music' },
  { time: '10:30 PM', label: 'Buenas noches', note: 'Lanterns down the cane road', icon: 'heart' },
];

const PALETTE = [
  { name: 'Terracotta', hex: '#b65f3e' },
  { name: 'Olive', hex: '#5f6640' },
  { name: 'Cream', hex: '#efe4cf' },
  { name: 'Walnut', hex: '#5a4232' },
  { name: 'Cane', hex: '#c9a26b' },
  { name: 'Sage', hex: '#9aa07a' },
];

const DRESS = {
  note: 'Garden formal, in the colours of the old house: clay, olive, cream and walnut. Natural fabrics breathe well in the afternoon; heels sink in the lawn, so block heels or flats.',
  shape: 'square',
  attire: [
    { who: 'Las damas', icon: 'gown', text: 'Midi or long dresses in linen, crepe or cotton lace. A Filipiniana sleeve is lovely.' },
    { who: 'Los caballeros', icon: 'barong', text: 'Barong or a linen suit in cream or olive. No tie needed.' },
  ],
};

const FAQ = [
  { q: 'How do we get to the hacienda?', a: 'It is about twenty minutes from the airport. A shuttle leaves the airport at 2:30 PM; tell us in your reply if you need a seat.' },
  { q: 'When should I reply by?', a: 'By the date on your invitation, through the form below.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Where can we stay?', a: 'There are heritage inns in town and hotels in the city nearby; message us and we will send a list.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but apart from our entourage this will be an adults-only celebration.' },
];

const FILMS = [
  { src: `${P}film-1.jpg`, caption: 'The long table in the sala' },
  { src: `${P}film-2.jpg`, caption: 'Hands on the banister' },
  { src: `${P}film-3.jpg`, caption: 'Cane fields at golden hour' },
  { src: `${P}film-4.jpg`, caption: 'The chapel door' },
  { src: `${P}film-5.jpg`, caption: 'A laugh in the garden' },
];

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const diaOf = (iso) => DIAS[new Date(iso.slice(0, 10) + 'T12:00:00').getDay()];
const timeOf = (iso) => {
  const h = +iso.slice(11, 13);
  const m = iso.slice(14, 16);
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
};
const splitTime = (t = '') => {
  const m = t.match(/^(.*?)\s*(AM|PM)$/i);
  return m ? [m[1], m[2].toLowerCase()] : [t, ''];
};
const directions = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

/** Three narrow groups first (parents, best man), then the paired tiers, then the rest. */
const arranged = (groups) => {
  const wide = groups.filter((g) => g.wide);
  const rest = groups.filter((g) => !g.wide);
  return [...rest.slice(0, 3), ...wide.map((g) => (/principal sponsors/i.test(g.title) && !/padrinos/i.test(g.title) ? { ...g, title: `${g.title} · Los Padrinos` } : g)), ...rest.slice(3)];
};

function Head({ es, title, className = '' }) {
  return (
    <header className={`ha-head rv ${className}`}>
      <p className="ha-es">{es}</p>
      <h2 className="ha-h2">{title}</h2>
    </header>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-hacienda', cover: `${P}hero.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function Haciendera() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = arranged(useEntourage(demo.entourage(D)));
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const [I1, I2] = initials(D);

  const films = FILMS.map((f) => ({ ...f, src: photo(f.src), alt: `${D.a} and ${D.b}: ${f.caption}` }));
  const lightbox = useLightbox(films);
  const roman = romanDate(D.start);
  const town = D.place.split(',')[0].trim();
  const year = +D.start.slice(0, 4);
  const find = (icon, fallback) => schedule.find((s) => s.icon === icon)?.time || fallback;

  const venues = [
    { kind: `La ceremonia · ${find('rings', timeOf(D.start))}`, name: D.ceremony, address: D.ceremonyAddress },
    { kind: `La cena · ${find('dinner', '6:30 PM')}`, name: D.venue, address: D.venueAddress },
  ];
  const event = { title: `${D.a} & ${D.b}’s wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };

  return (
    <TemplateRoot
      className="t-hacienda"
      nav={NAV}
      rsvp="respuesta"
      monogram={`${I1} & ${I2}`}
      music="canon"
      gate={{
        variant: 'doors',
        names: `${D.a} & ${D.b}`,
        eyebrow: 'Bienvenidos · you are invited by',
        date: `${roman} · ${town.toUpperCase()}`,
        button: 'Tuloy po kayo · Come in',
      }}
    >
      <header className="ha-top k-topnav">
        <nav aria-label="Sections" className="ha-top-l">
          {NAV.slice(0, 3).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <a className="ha-top-mark" href="#top">
          <span>
            {I1}
            <em>&amp;</em>
            {I2}
          </span>
          <small>{D.place}</small>
        </a>
        <nav aria-label="More sections" className="ha-top-r">
          {NAV.slice(3, 5).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#respuesta" className="ha-top-rsvp">
            RSVP
          </a>
        </nav>
      </header>

      {/* ---------- Hero ---------- */}
      <section className="ha-hero">
        <div className="ha-hero-art rv">
          <div className="ha-arch ha-window ha-hero-photo">
            <img src={photo(`${P}hero.jpg`)} alt={`${D.a} and ${D.b}`} fetchpriority="high" />
          </div>
          <Calamansi className="ha-hero-branch" />
        </div>
        <div className="ha-hero-text">
          <p className="ha-es rv">Con mucho cariño,</p>
          <p className="ha-caps rv d1">Together with their families</p>
          <h1 className="ha-names rv d1">
            <span>{D.a}</span>
            <span>
              <em>&amp;</em> {D.b}
            </span>
          </h1>
          <p className="ha-hero-date rv d2">
            <i aria-hidden="true" />
            {diaOf(D.start)} · {roman}
          </p>
          <p className="ha-hero-line rv d2">
            At {D.estate}, among the cane fields of {D.place}.
          </p>
          <div className="ha-hero-cta rv d3">
            <button type="button" className="ha-btn" onClick={() => scrollToId('respuesta')}>
              Reply
            </button>
            <CalendarButton event={event} className="ha-btn ha-btn--line" label="Save the date" icon={false} />
          </div>
        </div>
      </section>

      <Tiles />

      {/* ---------- Faltan ---------- */}
      <section className="ha-paper ha-count-sec">
        <div className="ha-count-lead rv">
          <p className="ha-es">Faltan…</p>
          <p className="ha-caps">Until we say yes</p>
        </div>
        <Countdown date={D.start} className="ha-count rv d1" labels={['Días', 'Horas', 'Minutos', 'Segundos']} />
      </section>

      <Tiles flip />

      {/* ---------- The estate ---------- */}
      <section className="ha-estate" id="estate">
        <figure className="ha-map rv">
          <EstateMap estate={D.estate} />
          <figcaption>{D.estate}, not quite to scale.</figcaption>
        </figure>
        <div className="ha-estate-text">
          <p className="ha-caps rv">The estate</p>
          <h2 className="ha-h2 rv d1">Where we’ll be</h2>
          <p className="ha-es ha-estate-lead rv d1">Everything happens on the grounds; follow the terracotta path.</p>
          <ol className="ha-venues">
            {venues.map((v, i) => (
              <li key={i} className={`rv d${i + 2}`}>
                <span className="ha-pin" aria-hidden="true">
                  {i + 1}
                </span>
                <div>
                  <p className="ha-caps ha-caps--clay">{v.kind}</p>
                  <h3 className="ha-venue-name">{v.name}</h3>
                  <p className="ha-venue-addr">{v.address}</p>
                  <div className="ha-links">
                    <a href={mapsUrl(`${v.name} ${v.address}`)} target="_blank" rel="noreferrer">
                      View map
                    </a>
                    <a href={directions(`${v.name} ${v.address}`)} target="_blank" rel="noreferrer">
                      Directions
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- The day, as a menu card ---------- */}
      <section className="ha-day" id="dia">
        <div className="ha-arch ha-menu rv">
          <p className="ha-es">Un día en la hacienda</p>
          <h2 className="ha-menu-title">The Day</h2>
          <ol className="ha-menu-list">
            {schedule.map((s, i) => {
              const [t, ap] = splitTime(s.time);
              return (
                <li key={i} className={s.icon === 'rings' ? 'is-key' : ''}>
                  {i > 0 && <LeafRule className="ha-leaf" />}
                  <p className="ha-menu-time">
                    {t}
                    {ap && <small>{ap}</small>}
                  </p>
                  <p className="ha-menu-label">{s.label || s.tag}</p>
                  {(s.note || s.sub) && <p className="ha-menu-note">{s.note || s.sub}</p>}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <Tiles />

      {/* ---------- Vestimenta ---------- */}
      <section className="ha-paper ha-dress-sec" id="vestimenta">
        <div className="ha-dress-grid">
          <Head es="Vestimenta" title="What to wear" />
          <DressCode className="ha-dress" note={DRESS.note} palette={PALETTE} attire={DRESS.attire} shape="square" />
        </div>
      </section>

      <Tiles flip />

      {/* ---------- La familia ---------- */}
      <section className="ha-fam-sec" id="familia">
        <Head es="La familia" title="Our Entourage" className="ha-head--center" />
        <Calamansi className="ha-sprig" />
        <Entourage className="ha-fam" groups={entourage} />
      </section>

      {/* ---------- Recuerdos ---------- */}
      <section className="ha-paper ha-film-sec" id="recuerdos">
        <Head es="Recuerdos" title="Moments, on film" className="ha-head--center" />
        <div className="ha-arcade rv d1">
          {films.map((f, i) => (
            <div key={i} className="ha-bay">
              <button type="button" className="ha-arch" onClick={() => lightbox.open(i)} aria-label={`Open photo: ${f.caption}`}>
                <img src={f.src} alt={f.alt} loading="lazy" />
              </button>
            </div>
          ))}
        </div>
        <p className="ha-film-cap rv">
          <span className="ha-swipe">Swipe the arcade → </span>Shot on 35mm at the old house, {year - 1}.
        </p>
        {lightbox.node}
      </section>

      <Tiles flip />

      {/* ---------- Regalos + Preguntas ---------- */}
      <section className="ha-info">
        <div id="regalos">
          <Head es="Regalos" title="Gifts" />
          <Gifts className="ha-gifts" note={gifts.note} accounts={gifts.accounts.map((a) => ({ ...a, label: a.name ? `${a.label} · ${a.name}` : a.label, name: '' }))} qr={gifts.qr} />
        </div>
        <div id="preguntas">
          <Head es="Preguntas" title="Questions" />
          <Faq className="ha-faq" items={FAQ} first={0} />
        </div>
      </section>

      {/* ---------- Respuesta ---------- */}
      <section className="ha-reply" id="respuesta">
        <p className="ha-es rv">Respuesta</p>
        <h2 className="ha-reply-title rv d1">Kindly reply</h2>
        <p className="ha-reply-lead rv d2">
          {guest?.name ? `Dear ${guest.name}, we` : 'We'} have saved {seatLine(guest)} at our table. Kindly reply by {D.replyBy}.
        </p>
        <div className="rv d3">
          <Rsvp couple={D} deadline={D.replyBy} />
        </div>
      </section>

      <Tiles />

      <footer className="ha-foot">
        <p className="ha-es">Con cariño,</p>
        <p className="ha-foot-names">
          {D.a} <em>&amp;</em> {D.b}
        </p>
        <p className="ha-caps ha-caps--walnut">
          {D.estate} · {town} · {roman}
        </p>
      </footer>
    </TemplateRoot>
  );
}
