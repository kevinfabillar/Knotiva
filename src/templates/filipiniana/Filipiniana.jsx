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
import { CaladoBand, Sampaguita, SampaguitaSprig, TimeMedallion } from './motifs.jsx';
import './filipiniana.css';

const P = '/templates/filipiniana/';

const DEFAULTS = {
  a: 'Miguel',
  b: 'Andrea',
  start: '2027-01-16T15:00:00+08:00',
  end: '2027-01-16T22:00:00+08:00',
  date: '16 January 2027',
  place: 'Taal, Batangas',
  venue: 'Casa Calado',
  venueAddress: 'Calle Agoncillo, Taal, Batangas',
  ceremony: 'San Martin Chapel',
  ceremonyAddress: 'Calle Marcela Agoncillo, Taal, Batangas',
  replyBy: '16 December 2026',
};

const NAV = [
  { id: 'kailan', label: 'Saan at Kailan' },
  { id: 'palatuntunan', label: 'Palatuntunan' },
  { id: 'kasuotan', label: 'Kasuotan' },
  { id: 'kasama', label: 'Mga Kasama' },
  { id: 'alaala', label: 'Mga Alaala' },
  { id: 'handog', label: 'Handog' },
  { id: 'katanungan', label: 'Katanungan' },
  { id: 'tugon', label: 'Tugon · RSVP' },
];

const SCHEDULE = [
  { time: '2:30 PM', label: 'Pagdating', note: 'Guests arrive · San Martin Chapel', icon: 'users' },
  { time: '3:00 PM', label: 'Ang Seremonya', note: 'The ceremony, with veil, cord and arras', icon: 'rings' },
  { time: '4:15 PM', label: 'Merienda', note: 'Kapeng barako and kakanin in the courtyard', icon: 'cheers' },
  { time: '5:30 PM', label: 'Hapunan', note: 'Dinner at Casa Calado', icon: 'dinner' },
  { time: '7:30 PM', label: 'Unang Sayaw', note: 'The first dance, then the rondalla', icon: 'music' },
  { time: '9:30 PM', label: 'Paalam', note: 'A send-off with sampaguita', icon: 'heart' },
];

const PALETTE = [
  { name: 'Piña', hex: '#f4eedf' },
  { name: 'Abaca', hex: '#e3d5b8' },
  { name: 'Gold', hex: '#c6ab73' },
  { name: 'Sage', hex: '#7d8460' },
  { name: 'Olive', hex: '#3f4a2e' },
];

const DRESS = {
  note: 'Modern Filipiniana, please. Barong Tagalog or a pared-back terno, in natural fibres and the soft tones below. Embroidery welcome; bright colours and prints, kindly avoid.',
  shape: 'square',
  attire: [
    { who: 'Barong Tagalog', icon: 'barong', text: 'Piña, jusi or organza in ecru or ivory, with dark trousers. A modern cut or a classic one.' },
    { who: 'Modern Filipiniana', icon: 'gown', text: 'A terno sleeve, a sheer piña overlay or a simple column dress in the palette. Floor or midi length.' },
  ],
};

const FAQ = [
  { q: 'When should I reply by?', a: 'Kindly reply through the form below by the date on your invitation.' },
  { q: 'Must I wear Filipiniana?', a: 'We would love it, but it is not required. Anything formal in the palette is perfect.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Where can we stay nearby?', a: 'There are heritage inns in town and hotels a short drive away; message us and we will send a list.' },
  { q: 'Is there parking?', a: 'Yes, at the church grounds and beside the house. Attendants will guide you.' },
];

const ARAW = ['Linggo', 'Lunes', 'Martes', 'Miyerkules', 'Huwebes', 'Biyernes', 'Sabado'];
const dayDate = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const arawOf = (iso) => ARAW[dayDate(iso).getDay()];
const dotted = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d} · ${m} · ${y}`;
};
const timeOf = (iso) => {
  const h = +iso.slice(11, 13);
  const m = iso.slice(14, 16);
  return `${h % 12 || 12}${m === '00' ? '' : `:${m}`} ${h < 12 ? 'AM' : 'PM'}`;
};
const bareTime = (t = '') => t.replace(/\s*(AM|PM)$/i, '');

/** "3:00 PM" → "Ika-3 ng hapon · 3 PM" */
function ika(t = '') {
  const m = /(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i.exec(t);
  if (!m) return t;
  const h12 = +m[1];
  const pm = m[3].toUpperCase() === 'PM';
  const h = (h12 % 12) + (pm ? 12 : 0);
  const part = h === 12 ? 'tanghali' : h < 12 ? 'umaga' : h < 18 ? 'hapon' : 'gabi';
  const short = `${h12}${m[2] && m[2] !== '00' ? `:${m[2]}` : ''} ${pm ? 'PM' : 'AM'}`;
  return `Ika-${h12} ng ${part} · ${short}`;
}

function Heading({ tl, en, className = '', as: H = 'h2' }) {
  return (
    <div className={`fi-head rv ${className}`}>
      <H className="fi-h">{tl}</H>
      <p className="fi-en">{en}</p>
    </div>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-filipiniana', cover: `${P}andrea.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function Filipiniana() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const [I1, I2] = initials(D);

  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };
  const dinner = schedule.find((s) => s.icon === 'dinner');
  const VENUES = [
    { kind: ika(timeOf(D.start)), name: D.ceremony, address: D.ceremonyAddress, icon: 'rings' },
    { kind: ika(dinner?.time || '5:00 PM'), name: D.venue, address: D.venueAddress, icon: 'dinner' },
  ];
  const accounts = gifts.accounts.map((a) => ({ ...a, label: a.name ? `${a.label} · ${a.name}` : a.label }));

  const PHOTOS = [
    { src: photo(`${P}gallery-1.jpg`), alt: 'Hands holding the arras' },
    { src: photo(`${P}gallery-2.jpg`), alt: 'The veil and cord' },
    { src: photo(`${P}gallery-3.jpg`), alt: 'A close-up of piña embroidery' },
    { src: photo(`${P}gallery-4.jpg`), alt: `${D.a} and ${D.b}, laughing` },
    { src: photo(`${P}gallery-5.jpg`), alt: 'The couple on a heritage street' },
  ];
  const lightbox = useLightbox(PHOTOS);

  const url = (p) => `url("${photo(p)}")`;

  return (
    <TemplateRoot
      className="t-filipiniana"
      nav={NAV}
      rsvp="tugon"
      monogram={`${I1} · ${I2}`}
      music="canon"
      style={{ '--img-venue-1': url(`${P}church.jpg`), '--img-venue-2': url(`${P}casa.jpg`) }}
      gate={{
        variant: 'ribbon',
        names: `${D.a} & ${D.b}`,
        monogram: `${I1} · ${I2}`,
        eyebrow: 'Inaanyayahan ka nina',
        date: dotted(D.start),
        button: 'Buksan ang imbitasyon',
        hint: 'Kalagin ang tali · untie the cord',
      }}
    >
      <header className="fi-nav k-topnav">
        <nav aria-label="Sections" className="fi-nav-l">
          {NAV.slice(0, 3).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
        </nav>
        <a href="#top" className="fi-nav-mono">
          {I1}
          <i>·</i>
          {I2}
        </a>
        <nav aria-label="More sections" className="fi-nav-r">
          {NAV.slice(3, 5).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#tugon" className="fi-nav-rsvp">
            Tugon · RSVP
          </a>
        </nav>
      </header>

      {/* 1. Hero */}
      <section className="fi-hero">
        <img className="fi-hero-photo fi-hero-photo--l" src={photo(`${P}andrea.jpg`)} alt={D.b} />
        <img className="fi-hero-photo fi-hero-photo--r" src={photo(`${P}miguel.jpg`)} alt={D.a} />
        <img className="fi-hero-photo fi-hero-photo--phone" src={photo(`${P}hero.jpg`)} alt={`${D.a} and ${D.b}`} />
        <div className="fi-panel">
          <SampaguitaSprig className="fi-sprig rv" />
          <p className="fi-caps fi-olive rv d1">Ang pag-iisang dibdib nina</p>
          <p className="fi-en fi-en--s rv d1">the marriage of</p>
          <h1 className="fi-names rv d2">
            <span>{D.a}</span>
            <em>&amp;</em>
            <span>{D.b}</span>
          </h1>
          <div className="fi-band fi-band--hero" aria-hidden="true" />
          <p className="fi-caps fi-ink rv d3">
            {arawOf(D.start)} · {dotted(D.start)}
          </p>
          <p className="fi-en fi-en--place rv d3">{D.place}</p>
          <div className="fi-actions rv d4">
            <button type="button" className="fi-btn" onClick={() => scrollToId('tugon')}>
              Tumugon · RSVP
            </button>
            <CalendarButton event={EVENT} className="fi-btn fi-btn--line" label="Save the date" icon={false} />
          </div>
        </div>
      </section>

      <div className="fi-main">
        <CaladoBand />
        {/* 2. Countdown */}
        <section className="fi-sec fi-split fi-count-sec">
          <Heading tl="Bilang ng mga Araw" en="counting the days" className="fi-head--l" />
          <span aria-hidden="true" />
          <Countdown date={D.start} labels={['Araw', 'Oras', 'Minuto', 'Segundo']} className="fi-count rv d1" />
        </section>

        <CaladoBand />
        {/* 3. Venues */}
        <section className="fi-sec" id="kailan">
          <div className="fi-split fi-venue-heads">
            <Heading tl="Ang Simbahan" en="the church" className="fi-head--l" />
            <span aria-hidden="true" />
            <Heading tl="Ang Salu-salo" en="the feast" />
          </div>
          <h2 className="fi-sr">Saan at Kailan</h2>
          <Venues className="fi-venues" items={VENUES} />
        </section>

        <CaladoBand />
        {/* 4. Program */}
        <section className="fi-sec fi-prog-sec" id="palatuntunan">
          <div className="fi-split">
            <Heading tl="Ang Palatuntunan" en="the order of the day" className="fi-head--l" />
          </div>
          <ol className="fi-prog">
            {schedule.map((s, i) => (
              <li key={`${s.time}${i}`} className={`rv d${(i % 4) + 1}${i % 2 ? ' is-r' : ' is-l'}`}>
                <TimeMedallion time={bareTime(s.time)} active={s.icon === 'rings'} />
                <span className="fi-prog-text">
                  <span className="fi-prog-label">{s.label || s.tag}</span>
                  {(s.note || s.sub) && <span className="fi-prog-note">{s.note || s.sub}</span>}
                  <span className="fi-sr">{s.time}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <CaladoBand />
        {/* 5. Dress code */}
        <section className="fi-sec fi-split fi-dress-sec" id="kasuotan">
          <div className="fi-dress-l">
            <Heading tl="Kasuotan" en="what to wear" className="fi-head--l" />
            <DressCode note={DRESS.note} palette={PALETTE} shape="square" className="fi-dress" />
          </div>
          <span aria-hidden="true" />
          <DressCode attire={DRESS.attire} className="fi-dress fi-dress-r" />
        </section>

        <CaladoBand />
        {/* 6. Entourage */}
        <section className="fi-sec" id="kasama">
          <Heading tl="Mga Kasama sa Kasal" en="those who stand with us" className="fi-head--c" />
          <Entourage groups={entourage} className="fi-ent" />
        </section>

        <CaladoBand />
        {/* 7. Gallery */}
        <section className="fi-sec fi-gal-sec" id="alaala">
          <Heading tl="Mga Alaala" en="memories, so far" className="fi-head--c" />
          <div className="fi-gal">
            {PHOTOS.slice(0, 4).map((p, i) => (
              <button key={p.src} type="button" className={`fi-ph fi-ph--${i + 1} rv d${i + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
            ))}
            <span className="fi-sheer" aria-hidden="true" />
          </div>
          {lightbox.node}
        </section>

        <CaladoBand />
        {/* 8. Gifts + FAQ */}
        <section className="fi-sec fi-split fi-gf">
          <div className="fi-gifts-col" id="handog">
            <Heading tl="Handog" en="gifts" className="fi-head--l" />
            <p className="fi-p rv d1">{gifts.note}</p>
            <Gifts className="fi-gifts" accounts={accounts} qr={gifts.qr} />
          </div>
          <span aria-hidden="true" />
          <div id="katanungan">
            <Heading tl="Mga Katanungan" en="questions" />
            <Faq items={FAQ} className="fi-faq" />
          </div>
        </section>
      </div>

      {/* 9. Tugon */}
      <section className="fi-tugon" id="tugon">
        <h2 className="fi-tugon-h rv">Tugon</h2>
        <p className="fi-tugon-en rv d1">kindly reply</p>
        <p className="fi-tugon-lead rv d2">
          {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved {seatLine(guest)} in your honour. Kindly reply by {D.replyBy}.
        </p>
        <div className="fi-rsvp-wrap rv d3">
          <Rsvp couple={D} deadline={D.replyBy} />
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="fi-foot">
        <Sampaguita className="fi-foot-flower" />
        <p className="fi-foot-thanks">Maraming salamat</p>
        <p className="fi-foot-names">
          {D.a} <em>&amp;</em> {D.b}
        </p>
        <p className="fi-caps fi-ink">
          {dotted(D.start)} · {D.place}
        </p>
        <div className="fi-band fi-band--foot" aria-hidden="true" />
      </footer>
    </TemplateRoot>
  );
}
