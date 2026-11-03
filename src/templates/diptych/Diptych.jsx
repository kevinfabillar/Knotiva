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
  mapsUrl,
  seatLine,
  useDetails,
  useEntourage,
  useGifts,
  useInvite,
  useLightbox,
  usePhoto,
  useSchedule,
} from '../kit/index.js';
import { Mark } from './motifs.jsx';
import './diptych.css';

const P = '/templates/diptych/';

const DEFAULTS = {
  a: 'Hanna',
  b: 'Joel',
  start: '2027-12-04T15:00:00+08:00',
  end: '2027-12-04T23:00:00+08:00',
  date: '4 December 2027',
  place: 'Baguio City',
  ceremony: 'Pine Hill Chapel',
  ceremonyAddress: 'Camp John Hay, Loakan Road, Baguio City',
  venue: 'The Glass Lodge',
  venueAddress: 'Outlook Drive, Baguio City',
  receptionTime: '5:30 PM',
  replyBy: '1 November 2027',
  closing: 'See you in the pines.',
  hashtag: '#HannaAndJoel',
};

const NAV = [
  { id: 'day', label: 'The day' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'attire', label: 'What to wear' },
  { id: 'entourage', label: 'Entourage' },
  { id: 'moments', label: 'Moments' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'questions', label: 'Questions' },
];

const SCHEDULE = [
  { time: '2:30 PM', label: 'Arrival', note: 'Hot tsokolate by the chapel door', icon: 'users' },
  { time: '3:00 PM', label: 'Ceremony', note: 'Pine Hill Chapel', icon: 'rings' },
  { time: '4:00 PM', label: 'Photographs', note: 'In the pines, while the light lasts', icon: 'camera' },
  { time: '5:30 PM', label: 'Reception', note: 'Dinner at The Glass Lodge', icon: 'dinner' },
  { time: '7:30 PM', label: 'First dance', note: 'Then the floor is yours', icon: 'music' },
  { time: '9:30 PM', label: 'Bonfire', note: 'Blankets, s’mores and slow songs', icon: 'heart' },
];

const PALETTE = [
  { name: 'Spruce', hex: '#213f37' },
  { name: 'Juniper', hex: '#4f6f63' },
  { name: 'Fog', hex: '#c4ccc5' },
  { name: 'Snow', hex: '#f2f2ee' },
  { name: 'Charcoal', hex: '#36393a' },
];

const DRESS = {
  note: 'December evenings in Baguio drop to fifteen degrees, so bring a coat or a wrap you love. Greens, greys and soft whites, please: the pines will do the rest. Block heels or flats are kind on the chapel lawn.',
  shape: 'square',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'A long dress or knitwear and a skirt, with a coat or a wrap for the evening.' },
    { who: 'Gentlemen', icon: 'suit', text: 'A suit in green, grey or charcoal. A turtleneck under the jacket is perfectly fine.' },
  ],
};

const FAQ = [
  { q: 'How cold will it be?', a: 'Around fifteen degrees after sunset. The lodge is heated, and there will be blankets by the bonfire.' },
  { q: 'When should I reply by?', a: 'Please reply through the form by the date on your invitation, so we can confirm numbers with the lodge.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but apart from our entourage this will be an adults-only celebration.' },
  { q: 'Where should we stay?', a: 'There are several inns and hotels a short drive from the lodge. We will send a list with your confirmation.' },
];

const GIFT_NOTE = 'Your presence is the gift. If you would like to bless our new home, a gift to either account is warmly received.';

/* ---------- date helpers ---------- */
const dayDate = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const weekdayOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { weekday: 'long' });
const monthOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { month: 'long' });
const dayNum = (iso) => Number(iso.slice(8, 10));
const dotted = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d} · ${m} · ${y}`;
};
const timeOf = (iso) => {
  const h = +iso.slice(11, 13);
  const m = iso.slice(14, 16);
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
};
const WORDS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
function spokenTime(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = Number(m[1]);
  const part = h < 12 ? 'in the morning' : h < 17 ? 'in the afternoon' : 'in the evening';
  return `${WORDS[h % 12]}${m[2] === '00' ? ' o’clock' : `-${m[2]}`} ${part}`;
}
const directions = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
const COUNT_WORDS = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];

/** A spruce panel whose content holds still while the right side scrolls. */
function Panel({ alt = false, children }) {
  return (
    <div className={`dp-panel dp-lime${alt ? ' dp-lime--alt' : ''}`}>
      <div className="dp-stick">{children}</div>
    </div>
  );
}

/** A photograph panel that holds still while the right side scrolls. */
function PhotoPanel({ src, alt, onOpen }) {
  return (
    <div className="dp-panel dp-photo-cell">
      <div className="dp-photo">
        <button type="button" onClick={onOpen} aria-label={`Open photo: ${alt}`}>
          <img src={src} alt={alt} loading="lazy" />
        </button>
      </div>
    </div>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-diptych', cover: `${P}portrait.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function Diptych() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts({ ...demo.gifts(D), note: GIFT_NOTE });
  const { guest } = useInvite();
  const [I1, I2] = initials(D);
  const day = dayNum(D.start);
  const year = D.start.slice(0, 4);

  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };

  const MOMENTS = [1, 2, 3, 4].map((n) => ({ src: photo(`${P}moment-${n}.jpg`), alt: `A candid moment, ${n} of 4` }));
  const PANELS = {
    portrait: { src: photo(`${P}portrait.jpg`), alt: `${D.a} and ${D.b} among the pines` },
    pines: { src: photo(`${P}pines.jpg`), alt: 'A path through the pines' },
    couple: { src: photo(`${P}couple.jpg`), alt: `${D.a} and ${D.b} walking hand in hand` },
    hands: { src: photo(`${P}hands.jpg`), alt: 'Wedding rings on a pine branch' },
    lodge: { src: photo(`${P}lodge.jpg`), alt: `${D.venue} at dusk` },
  };
  const ALL = [...MOMENTS, PANELS.portrait, PANELS.pines, PANELS.couple, PANELS.hands, PANELS.lodge];
  const lightbox = useLightbox(ALL);
  const openPanel = (k) => () => lightbox.open(4 + ['portrait', 'pines', 'couple', 'hands', 'lodge'].indexOf(k));

  return (
    <TemplateRoot
      className="t-diptych"
      nav={NAV}
      monogram={`${I1} & ${I2}`}
      music="reverie"
      gate={{
        variant: 'doors',
        names: `${D.a} & ${D.b}`,
        eyebrow: 'You are invited to the wedding of',
        date: `${day} ${monthOf(D.start)} ${year} · ${D.place}`,
        button: 'Open the invitation',
      }}
    >
      {/* 1. Hero */}
      <section className="dp-pair dp-hero">
        <div className="dp-panel dp-lime dp-hero-l">
          <div className="dp-hero-top">
            <Mark className="dp-mark" />
            <span className="dp-label">{dotted(D.start)}</span>
          </div>
          <div className="dp-hero-names">
            <p className="dp-label rv">The wedding of</p>
            <h1 className="dp-names rv d1">
              {D.a}
              <br />
              <em>&amp;</em> {D.b}
            </h1>
            <p className="dp-hero-date rv d2">
              {weekdayOf(D.start)}, {day} {monthOf(D.start)} {year}
            </p>
            <p className="dp-label rv d2">{D.place}</p>
          </div>
          <nav className="dp-index k-topnav" aria-label="Sections">
            {NAV.map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
            <a href="#rsvp" className="is-rsvp">
              RSVP
            </a>
          </nav>
        </div>
        <div className="dp-hero-photo">
          <button type="button" onClick={openPanel('portrait')} aria-label="Open the portrait">
            <img src={PANELS.portrait.src} alt={PANELS.portrait.alt} />
          </button>
        </div>
      </section>

      {/* 2. Countdown */}
      <section className="dp-countsec">
        <Countdown date={D.start} className="dp-count rv" />
      </section>

      {/* 3. The day */}
      <section className="dp-pair" id="day">
        <Panel>
          <p className="dp-label rv">The day</p>
          <h2 className="dp-ptitle rv d1">
            {day} {monthOf(D.start)}
            <br />
            {year}
          </h2>
          <p className="dp-plead rv d2">
            A {weekdayOf(D.start)}. The ceremony begins at {spokenTime(D.start)}.
          </p>
          <div className="dp-cal rv d3">
            <CalendarButton event={EVENT} className="dp-btn dp-btn--light" label="Add to calendar" />
          </div>
        </Panel>
        <div className="dp-body">
          {[
            { kind: `Ceremony · ${timeOf(D.start)}`, name: D.ceremony, address: D.ceremonyAddress },
            { kind: `Reception · ${D.receptionTime}`, name: D.venue, address: D.venueAddress },
          ].map((v, i) => {
            const q = `${v.name} ${v.address}`;
            return (
              <article key={v.kind} className={`dp-venue rv d${i + 1}`}>
                <p className="dp-label">{v.kind}</p>
                <h3>{v.name}</h3>
                <p className="dp-venue-addr">{v.address}</p>
                <p className="dp-links">
                  <a href={mapsUrl(q)} target="_blank" rel="noreferrer">
                    View map
                  </a>
                  <a href={directions(q)} target="_blank" rel="noreferrer">
                    Directions
                  </a>
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* 4. Schedule */}
      <section className="dp-pair" id="schedule">
        <PhotoPanel {...PANELS.pines} onOpen={openPanel('pines')} />
        <div className="dp-body">
          <p className="dp-label rv">Schedule</p>
          <h2 className="dp-ctitle rv d1">Order of the day</h2>
          <ol className="dp-sched">
            {schedule.map((s, i) => {
              const [t, ap] = String(s.time).split(' ');
              return (
                <li key={`${s.time}${i}`} className="rv">
                  <span className="dp-time">
                    {t} {ap && <small>{ap}</small>}
                  </span>
                  <span>
                    <b>{s.label || s.tag}</b>
                    {(s.note || s.sub) && <i>{s.note || s.sub}</i>}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 5. What to wear */}
      <section className="dp-pair" id="attire">
        <Panel alt>
          <p className="dp-label rv">Dress code</p>
          <h2 className="dp-ptitle rv d1">
            What to
            <br />
            wear
          </h2>
          <p className="dp-pserif rv d2">Smart, and warm.</p>
        </Panel>
        <div className="dp-body">
          <DressCode note={DRESS.note} palette={PALETTE} shape="square" className="dp-dress" />
          <DressCode attire={DRESS.attire} className="dp-attire" />
        </div>
      </section>

      {/* 6. Entourage */}
      <section className="dp-pair" id="entourage">
        <PhotoPanel {...PANELS.couple} onOpen={openPanel('couple')} />
        <div className="dp-body">
          <p className="dp-label rv">With love</p>
          <h2 className="dp-ctitle rv d1">The entourage</h2>
          <Entourage groups={entourage} className="dp-ent" />
        </div>
      </section>

      {/* 7. Moments */}
      <section className="dp-pair" id="moments">
        <Panel>
          <p className="dp-label rv">Moments</p>
          <h2 className="dp-ptitle rv d1">{COUNT_WORDS[MOMENTS.length] || MOMENTS.length} photographs</h2>
          <p className="dp-plead rv d2">Tap any photo to see it larger.</p>
        </Panel>
        <div className="dp-body">
          <div className="dp-moments">
            {MOMENTS.map((p, i) => (
              <button key={p.src} type="button" className={`dp-moment rv d${i + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Gifts */}
      <section className="dp-pair" id="gifts">
        <PhotoPanel {...PANELS.hands} onOpen={openPanel('hands')} />
        <div className="dp-body">
          <p className="dp-label rv">Gifts</p>
          <h2 className="dp-ctitle rv d1">With thanks</h2>
          <p className="dp-note rv d2">{gifts.note}</p>
          <Gifts accounts={gifts.accounts} qr={gifts.qr} className="dp-gifts" />
        </div>
      </section>

      {/* 9. Questions */}
      <section className="dp-pair" id="questions">
        <Panel alt>
          <p className="dp-label rv">Questions</p>
          <h2 className="dp-ptitle rv d1">
            Good to
            <br />
            know
          </h2>
          <p className="dp-plead rv d2">Anything else? Message either of us; we would love to hear from you.</p>
        </Panel>
        <div className="dp-body">
          <Faq items={FAQ} />
        </div>
      </section>

      {/* 10. RSVP */}
      <section className="dp-pair" id="rsvp">
        <PhotoPanel {...PANELS.lodge} onOpen={openPanel('lodge')} />
        <div className="dp-body">
          <p className="dp-label rv">RSVP</p>
          <h2 className="dp-ctitle rv d1">Will you join us?</h2>
          <p className="dp-note rv d2">
            We have reserved {seatLine(guest)} for you{guest?.name ? `, ${guest.name}` : ''}. Kindly reply by {D.replyBy}.
          </p>
          <div className="rv d3">
            <Rsvp couple={D} deadline={D.replyBy} />
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="dp-pair dp-foot">
        <div className="dp-panel dp-lime">
          <Mark className="dp-mark dp-foot-mark" />
          <p className="dp-foot-names">
            {D.a} <em>&amp;</em> {D.b}
          </p>
          <p className="dp-label">
            {dotted(D.start)} · {D.place}
          </p>
        </div>
        <div className="dp-lime dp-lime--foot">
          <p className="dp-foot-closing">{D.closing}</p>
          <div className="dp-social">
            <Icon name="instagram" size={20} stroke={1.3} />
            <Icon name="facebook" size={20} stroke={1.3} />
            <Icon name="mail" size={20} stroke={1.3} />
          </div>
          <p className="dp-label">{D.hashtag}</p>
        </div>
      </footer>
      {lightbox.node}
    </TemplateRoot>
  );
}
