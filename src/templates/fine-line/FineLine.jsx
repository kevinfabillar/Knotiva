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
  Venues,
  demo,
  initials,
  seatLine,
  useDetails,
  useEntourage,
  useGifts,
  useInvite,
  useLightbox,
  usePhoto,
  useSchedule,
} from '../kit/index.js';
import { Rings, RingsSmall, Rule, Thread, ThreadV } from './motifs.jsx';
import './fine-line.css';

const P = '/templates/fine-line/';

const DEFAULTS = {
  a: 'Clara',
  b: 'Mateo',
  start: '2027-05-15T15:00:00+08:00',
  end: '2027-05-15T22:00:00+08:00',
  date: '15 May 2027',
  place: 'Taal, Batangas',
  ceremony: 'Capilla de Santa Clara',
  ceremonyAddress: 'Calle Real, Taal, Batangas',
  venue: 'Casa Azul',
  venueAddress: 'Calle Marcela Agoncillo, Taal, Batangas',
  receptionTime: '5:30 PM',
  replyBy: '1 April 2027',
  invitation: 'request the pleasure of your company at the celebration of their marriage',
  closing: 'Thank you for being part of our story.',
  hashtag: '#ClaraAndMateo',
};

const NAV = [
  { id: 'day', label: 'The Day' },
  { id: 'order', label: 'Schedule' },
  { id: 'attire', label: 'Attire' },
  { id: 'entourage', label: 'Entourage' },
  { id: 'moments', label: 'Moments' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'questions', label: 'Questions' },
];

const SCHEDULE = [
  { time: '2:30 PM', label: 'Arrival', note: 'Iced calamansi in the plaza', icon: 'users' },
  { time: '3:00 PM', label: 'Ceremony', note: 'Capilla de Santa Clara', icon: 'rings' },
  { time: '4:00 PM', label: 'Portraits', note: 'On the chapel steps', icon: 'camera' },
  { time: '5:30 PM', label: 'Dinner', note: 'In the courtyard at Casa Azul', icon: 'dinner' },
  { time: '7:30 PM', label: 'First dance', note: 'And then everyone else’s', icon: 'music' },
  { time: '9:00 PM', label: 'Send-off', note: 'Sparklers on Calle Real', icon: 'heart' },
];

const PALETTE = [
  { name: 'Ink', hex: '#1f3266' },
  { name: 'Cornflower', hex: '#5b77b8' },
  { name: 'Dusty blue', hex: '#9fb1d3' },
  { name: 'Mist', hex: '#dde4ef' },
  { name: 'Stone', hex: '#cdcbc4' },
];

const DRESS = {
  note: 'From deep ink to the palest mist, with soft white and stone. The chapel floor is old stone, so choose shoes you can walk in.',
  shape: 'circle',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'Long dresses or elegant separates in blue, white or stone. A shawl for the breeze off the lake.' },
    { who: 'Gentlemen', icon: 'suit', text: 'A navy or grey suit, or a barong over dark trousers. Ties welcome, not required.' },
  ],
};

const FAQ = [
  { q: 'When should I reply by?', a: 'Please reply through the form below by the date on your invitation, so we can give the caterer our final numbers.' },
  { q: 'Is the ceremony indoors?', a: 'Yes, inside the chapel. Dinner is in an open courtyard, so bring a light layer for the evening breeze off the lake.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but apart from our entourage this will be an adults-only celebration.' },
  { q: 'Where can we park?', a: 'There is parking by the town plaza, a short walk from the chapel. Our ushers will guide you.' },
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
const ORD_WORDS = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth',
  'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth', 'twenty-first', 'twenty-second',
  'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh', 'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first'];
const WORDS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
function spokenTime(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = Number(m[1]);
  const part = h < 12 ? 'in the morning' : h < 17 ? 'in the afternoon' : 'in the evening';
  return `${WORDS[h % 12]}${m[2] === '00' ? ' o’clock' : `-${m[2]}`} ${part}`;
}

export const meta = { defaults: DEFAULTS, className: 't-fineline', cover: `${P}portrait.svg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function FineLine() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts({ ...demo.gifts(D), note: GIFT_NOTE });
  const { guest } = useInvite();
  const [I1, I2] = initials(D);
  const year = D.start.slice(0, 4);
  const day = dayNum(D.start);

  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };
  const VENUES = [
    { kind: `Ceremony · ${timeOf(D.start)}`, name: D.ceremony, address: D.ceremonyAddress, icon: 'rings', query: `${D.ceremony} ${D.ceremonyAddress}` },
    { kind: `Reception · ${D.receptionTime}`, name: D.venue, address: D.venueAddress, icon: 'cheers', query: `${D.venue} ${D.venueAddress}` },
  ];
  const PHOTOS = [
    { key: 'portrait', src: photo(`${P}portrait.svg`), alt: `${D.a} and ${D.b}` },
    { key: 'chapel', src: photo(`${P}chapel.svg`), alt: 'The chapel' },
    { key: 'hands', src: photo(`${P}hands.svg`), alt: 'Hands with wedding rings' },
    { key: 'lake', src: photo(`${P}lake.svg`), alt: 'A wide landscape under a big sky' },
    { key: 'steps', src: photo(`${P}steps.svg`), alt: `${D.a} and ${D.b} together` },
  ];
  const lightbox = useLightbox(PHOTOS);
  const long = schedule.length > 7;

  return (
    <TemplateRoot
      className="t-fineline"
      nav={NAV}
      monogram={`${I1} · ${I2}`}
      music="reverie"
      gate={{
        variant: 'seal',
        names: `${D.a} & ${D.b}`,
        monogram: `${I1} ${I2}`,
        eyebrow: 'You are invited to the wedding of',
        date: `${day} ${monthOf(D.start)} ${year} · ${D.place}`,
        hint: 'Tap the ring to open',
      }}
    >
      {/* 1. Hero */}
      <header className="fl-nav k-topnav">
        <a href="#top" className="fl-mono" aria-label="Home">
          {I1} <span>·</span> {I2}
        </a>
        <nav aria-label="Sections">
          {NAV.map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#rsvp" className="fl-pill">
            Kindly reply
          </a>
        </nav>
      </header>

      <section className="fl-hero">
        <Rings className="fl-rings fl-rings--desk fl-draw rv" />
        <Rings phone className="fl-rings fl-rings--phone fl-draw rv" />
        <div className="fl-hero-text">
          <p className="fl-together rv">Together with their families</p>
          <h1 className="fl-names rv d1">
            <span>{D.a}</span>
            <span>
              <em>&amp;</em> {D.b}
            </span>
          </h1>
          <p className="fl-invite rv d2">{D.invitation}</p>
          <p className="fl-when rv d3">
            <span>
              {weekdayOf(D.start)}, {day} {monthOf(D.start)} {year}
            </span>
            <span className="fl-when-sep"> · </span>
            <span>{spokenTime(D.start)}</span>
          </p>
          <p className="fl-where rv d3">
            {D.ceremony}, {D.place}
          </p>
          <div className="fl-actions rv d4">
            <a href="#rsvp" className="fl-btn">
              Kindly reply
            </a>
            <CalendarButton event={EVENT} className="fl-btn fl-btn--line" label="Save the date" icon={false} />
          </div>
        </div>
      </section>

      {/* 2. Countdown */}
      <section className="fl-sec fl-count-sec">
        <div className="fl-row fl-row--mid">
          <div className="rv">
            <p className="fl-label">Counting down</p>
            <p className="fl-sub">
              until {weekdayOf(D.start)}, the {ORD_WORDS[day]} of {monthOf(D.start)}
            </p>
          </div>
          <Countdown date={D.start} className="fl-count rv d1" />
        </div>
      </section>

      {/* 3. The Celebration */}
      <section className="fl-sec" id="day">
        <Rule className="rv" />
        <div className="fl-row">
          <div className="fl-head fl-day-head">
            <p className="fl-label rv">
              {weekdayOf(D.start)}, {day} {monthOf(D.start)} {year}
            </p>
            <h2 className="fl-title rv d1">The Celebration</h2>
            <div className="fl-cal-link fl-cal-link--desk rv d2">
              <CalendarButton event={EVENT} className="fl-textlink" label="Add to calendar" icon={false} />
            </div>
          </div>
          <div>
            <Venues items={VENUES} className="fl-venues" />
            <div className="fl-cal-link fl-cal-link--phone rv">
              <CalendarButton event={EVENT} className="fl-textlink" label="Add to calendar" icon={false} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Order of the day */}
      <section className="fl-sec" id="order">
        <Rule className="rv" />
        <div className="fl-row">
          <h2 className="fl-title rv">The Order of the Day</h2>
          <p className="fl-sub fl-sub--row rv d1">From the first hello to the last sparkler.</p>
        </div>
        <div className={`fl-prog${long ? ' is-long' : ''}`} style={{ '--n': schedule.length }}>
          <div className="fl-prog-h">
            <ol className="fl-prog-times rv">
              {schedule.map((s, i) => {
                const [t, ap] = String(s.time).split(' ');
                return (
                  <li key={`${s.time}${i}`}>
                    {t} {ap && <small>{ap}</small>}
                  </li>
                );
              })}
            </ol>
            <Thread count={schedule.length} className="fl-prog-line fl-draw rv" />
            <ol className="fl-prog-items rv d1">
              {schedule.map((s, i) => (
                <li key={`${s.time}${i}`}>
                  <b>{s.label || s.tag}</b>
                  {(s.note || s.sub) && <span>{s.note || s.sub}</span>}
                </li>
              ))}
            </ol>
          </div>
          <div className="fl-prog-v">
            <ThreadV count={schedule.length} className="fl-prog-vline fl-draw rv" style={{ height: schedule.length * 110 }} />
            <ol>
              {schedule.map((s, i) => {
                const [t, ap] = String(s.time).split(' ');
                return (
                  <li key={`${s.time}${i}`} className="rv">
                    <span className="fl-v-time">
                      {t} {ap && <small>{ap}</small>}
                    </span>
                    <b>{s.label || s.tag}</b>
                    {(s.note || s.sub) && <span className="fl-v-note">{s.note || s.sub}</span>}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </section>

      {/* 5. What to wear */}
      <section className="fl-sec" id="attire">
        <Rule className="rv" />
        <div className="fl-row">
          <div className="fl-head">
            <h2 className="fl-title rv">What to Wear</h2>
            <p className="fl-sub rv d1">Formal, in every shade of blue.</p>
          </div>
          <div>
            <DressCode note={DRESS.note} palette={PALETTE} shape="circle" className="fl-dress" />
            <DressCode attire={DRESS.attire} className="fl-attire" />
          </div>
        </div>
      </section>

      {/* 6. Entourage */}
      <section className="fl-sec" id="entourage">
        <Rule className="rv" />
        <div className="fl-row">
          <div className="fl-head">
            <h2 className="fl-title rv">The Entourage</h2>
            <p className="fl-sub rv d1">With love, our families and friends.</p>
          </div>
          <Entourage groups={entourage} className="fl-ent" />
        </div>
      </section>

      {/* 7. Moments */}
      <section className="fl-sec" id="moments">
        <Rule className="rv" />
        <div className="fl-row">
          <h2 className="fl-title rv">Moments</h2>
          <p className="fl-sub fl-sub--row rv d1">Tap any photo to see it larger.</p>
        </div>
        <div className="fl-grid">
          {PHOTOS.map((p, i) => (
            <button key={p.key} type="button" className={`fl-ph fl-ph--${p.key} rv d${(i % 3) + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
              <img src={p.src} alt={p.alt} loading="lazy" />
            </button>
          ))}
        </div>
        {lightbox.node}
      </section>

      {/* 8. Gifts */}
      <section className="fl-sec" id="gifts">
        <Rule className="rv" />
        <div className="fl-row">
          <div className="fl-head">
            <h2 className="fl-title rv">Gifts</h2>
            <p className="fl-body rv d1">{gifts.note}</p>
          </div>
          <Gifts accounts={gifts.accounts} qr={gifts.qr} className="fl-gifts" />
        </div>
      </section>

      {/* 9. Questions */}
      <section className="fl-sec" id="questions">
        <Rule className="rv" />
        <div className="fl-row">
          <div className="fl-head">
            <h2 className="fl-title rv">Questions</h2>
            <p className="fl-sub rv d1">Anything else? Message either of us.</p>
          </div>
          <Faq items={FAQ} className="fl-faq" />
        </div>
      </section>

      {/* 10. RSVP */}
      <section className="fl-sec" id="rsvp">
        <Rule className="rv" />
        <div className="fl-row">
          <div className="fl-head">
            <h2 className="fl-title rv">
              Will you
              <br />
              join us?
            </h2>
            <p className="fl-sub rv d1">
              We have reserved {seatLine(guest)} for you{guest?.name ? `, ${guest.name}` : ''}. Kindly reply by {D.replyBy}.
            </p>
            <RingsSmall className="fl-rsvp-rings fl-draw rv" />
          </div>
          <div className="fl-rsvp-wrap rv d1">
            <Rsvp couple={D} deadline={D.replyBy} />
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="fl-sec fl-foot">
        <Rule className="rv" />
        <div className="fl-row fl-row--end">
          <div>
            <p className="fl-foot-names">
              {D.a} <em>&amp;</em>
              <br />
              {D.b}
            </p>
            <p className="fl-sub">{D.closing}</p>
          </div>
          <div className="fl-foot-meta">
            <p>
              {dotted(D.start)} · {D.place} · <b>{D.hashtag}</b>
            </p>
            <div className="fl-social">
              <Icon name="instagram" size={19} stroke={1.3} />
              <Icon name="facebook" size={19} stroke={1.3} />
              <Icon name="mail" size={19} stroke={1.3} />
            </div>
          </div>
        </div>
      </footer>
    </TemplateRoot>
  );
}
