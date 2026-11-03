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
import { CircleMark } from './motifs.jsx';
import './red-letter.css';

const P = '/templates/red-letter/';

const DEFAULTS = {
  a: 'Mara',
  b: 'Enzo',
  start: '2027-10-09T15:00:00+08:00',
  end: '2027-10-09T23:00:00+08:00',
  date: 'October 9, 2027',
  place: 'Makati City',
  ceremony: 'St. Andrew’s Church',
  ceremonyAddress: 'Bel-Air, Makati City',
  venue: 'The Paper Mill',
  venueAddress: 'Don Pedro Street, Poblacion, Makati City',
  receptionTime: '5:30 PM',
  replyBy: 'September 1, 2027',
  hashtag: '#MaraAndEnzo',
};

const NAV = [
  { id: 'where', label: 'Where & when' },
  { id: 'schedule', label: 'Schedule' },
  { id: 'dress', label: 'Dress code' },
  { id: 'who', label: 'Who’s who' },
  { id: 'photos', label: 'Photos' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'faq', label: 'FAQ' },
];

const SCHEDULE = [
  { time: '2:30 PM', label: 'Arrivals', note: 'Coffee and calamansi on the church steps', icon: 'users' },
  { time: '3:00 PM', label: 'Ceremony', note: 'St. Andrew’s Church', icon: 'rings' },
  { time: '4:00 PM', label: 'Merienda', note: 'A short walk to The Paper Mill', icon: 'cheers' },
  { time: '5:30 PM', label: 'Photos', note: 'Golden hour on the roof', icon: 'camera' },
  { time: '6:00 PM', label: 'Dinner', note: 'Long tables, family style', icon: 'dinner' },
  { time: '8:00 PM', label: 'Party', note: 'Until the music stops', icon: 'music' },
];

const PALETTE = [
  { name: 'Butter', hex: '#f2d77a' },
  { name: 'Marigold', hex: '#e3a33b' },
  { name: 'Tomato', hex: '#d63a2b' },
  { name: 'Cream', hex: '#f7efd9' },
];

const DRESS = {
  note: 'Summer cocktail, in the warmest colours you own: butter, marigold, tomato and cream. Flats are smart; the walk to dinner is short but cobbled.',
  shape: 'square',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'A sundress, a silk slip or a bright suit. Midi lengths dance best.' },
    { who: 'Gentlemen', icon: 'suit', text: 'Linen or a light suit, no tie needed. A coloured shirt is very welcome.' },
  ],
};

const FAQ = [
  { q: 'When should I reply by?', a: 'By the date on your invitation, using the form below. It helps us confirm numbers with the venue.' },
  { q: 'How do we get from the church to dinner?', a: 'It is a ten-minute walk, or a short ride if you would rather. We will have a few cars waiting outside the church.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but apart from our entourage this will be an adults-only celebration.' },
  { q: 'Is there parking?', a: 'Yes, at the church and at The Paper Mill. Both are free for guests.' },
];

const GIFT_NOTE = 'Your presence is the gift. If you would like to bless our new home, a gift to either account is warmly received.';

/* ---------- date helpers ---------- */
const dayDate = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const weekdayOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { weekday: 'long' });
const monthOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { month: 'long' });
const dayNum = (iso) => Number(iso.slice(8, 10));
const pad = (n) => String(n).padStart(2, '0');
const timeOf = (iso) => {
  const h = +iso.slice(11, 13);
  const m = iso.slice(14, 16);
  return `${h % 12 || 12}:${m} ${h < 12 ? 'AM' : 'PM'}`;
};
const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
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

/** Sunday-first weeks of the month; null = blank cell. */
function monthWeeks(iso) {
  const [y, m] = iso.slice(0, 10).split('-').map(Number);
  const first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  while (cells.length % 7) cells.push(null);
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

const mins = (t) => {
  const m = /(\d{1,2}):(\d{2})\s*([ap])\.?m/i.exec(t || '');
  return m ? ((+m[1] % 12) + (m[3].toLowerCase() === 'p' ? 12 : 0)) * 60 + +m[2] : null;
};
const clock = (v) => `${Math.floor(v / 60) % 12 || 12}:${pad(v % 60)}`;
const ampm = (v) => (Math.floor(v / 60) % 24 < 12 ? 'AM' : 'PM');
const hourLabel = (h) => `${h % 12 || 12} ${h % 24 < 12 ? 'AM' : 'PM'}`;

function Head({ label, title, red = false, children }) {
  return (
    <>
      <p className={`rl-label rv${red ? ' is-red' : ''}`}>{label}</p>
      {title && <h2 className="rl-title rv d1">{title}</h2>}
      {children}
    </>
  );
}

function MiniCal({ date }) {
  const iso = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const d = date.getDate();
  return (
    <div className="rl-mini" role="img" aria-label={`Reply by ${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`}>
      <header>
        <b>{date.toLocaleDateString('en-US', { month: 'long' })}</b>
        <span>{date.getFullYear()}</span>
      </header>
      <ol className="rl-mini-head">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ol>
      <ol className="rl-mini-days">
        {monthWeeks(iso)
          .flat()
          .map((n, i) => (
            <li key={i} className={[i % 7 === 0 && 'sun', n === d && 'the-day'].filter(Boolean).join(' ')}>
              {n || ''}
              {n === d && <CircleMark className="rl-mini-circle rl-circle rv" width={5.5} />}
            </li>
          ))}
      </ol>
    </div>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-redletter', cover: `${P}portrait.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function RedLetter() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts({ ...demo.gifts(D), note: GIFT_NOTE });
  const { guest } = useInvite();
  const [I1, I2] = initials(D);
  const day = dayNum(D.start);
  const year = D.start.slice(0, 4);
  const mm = D.start.slice(5, 7);
  const month = monthOf(D.start);

  const r = new Date(D.replyBy);
  const rOk = !Number.isNaN(r.getTime());
  const rShort = rOk ? `${r.getDate()} ${r.toLocaleDateString('en-US', { month: 'long' })}` : '';

  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };
  const ceremonyQ = `${D.ceremony} ${D.ceremonyAddress}`;
  const receptionQ = `${D.venue} ${D.venueAddress}`;

  const PHOTOS = [
    { key: 'portrait', src: photo(`${P}portrait.jpg`), alt: `${D.a} and ${D.b}` },
    { key: 'street', src: photo(`${P}street.jpg`), alt: `${D.a} and ${D.b} on a park bench` },
    { key: 'hands', src: photo(`${P}hands.jpg`), alt: 'Hands clasped, a ring on one finger' },
    { key: 'table', src: photo(`${P}table.jpg`), alt: 'A long table set for dinner' },
    { key: 'church', src: photo(`${P}church.jpg`), alt: 'An old brick church front' },
  ];
  const lightbox = useLightbox(PHOTOS);

  /* day planner */
  const startMins = +D.start.slice(11, 13) * 60 + +D.start.slice(14, 16);
  const endMins = +D.end.slice(11, 13) * 60 + +D.end.slice(14, 16);
  const blocks = schedule.map((s, i) => ({ ...s, a: mins(s.time), b: i < schedule.length - 1 ? mins(schedule[i + 1].time) : endMins }));
  const planOk = blocks.length > 0 && blocks.every((x) => x.a != null && x.b != null && x.b > x.a);
  const h0 = planOk ? Math.floor(blocks[0].a / 60) : 0;
  const h1 = planOk ? Math.ceil(blocks[blocks.length - 1].b / 60) : 0;
  const hasKeyLabel = schedule.some((s) => /ceremony|kasal|seremonya/i.test(s.label || s.tag || ''));
  const isKey = (s) => (hasKeyLabel ? /ceremony|kasal|seremonya/i.test(s.label || s.tag || '') : s.a === startMins);
  const scheduleLabel = planOk ? `${clock(blocks[0].a)} ${ampm(blocks[0].a)} — ${endMins % 60 ? `${clock(endMins)} ${ampm(endMins)}` : hourLabel(endMins / 60)}` : 'Schedule';

  return (
    <TemplateRoot
      className="t-redletter"
      nav={NAV}
      monogram={`${I1} & ${I2}`}
      music="canon"
      gate={{
        variant: 'card',
        names: `${D.a} & ${D.b}`,
        monogram: `${month.toUpperCase()}\n${pad(day)}`,
        eyebrow: 'Save the date',
        date: `${weekdayOf(D.start)} ${day} ${month} ${year}`,
        hint: 'Tap to turn the page',
      }}
    >
      <header className="rl-nav k-topnav">
        <a href="#top" className="rl-nav-names">
          {D.a} &amp; {D.b}
        </a>
        <span className="rl-nav-date">
          {pad(day)}.{mm}.{year}
        </span>
        <nav aria-label="Sections">
          {NAV.map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#rsvp" className="is-rsvp">
            RSVP
          </a>
        </nav>
      </header>

      {/* 1. Hero */}
      <section className="rl-hero rl-grid">
        <div className="rl-hero-l">
          <p className="rl-label rv">The wedding of</p>
          <h1 className="rl-names ink rv d1">
            {D.a} &amp;
            <br />
            {D.b}
          </h1>
        </div>
        <div className="rl-cal rv d1" role="img" aria-label={`${month} ${year}, with ${weekdayOf(D.start)} the ${ordinal(day)} circled`}>
          <header>
            <b>{month}</b>
            <span>{year}</span>
          </header>
          <ol className="rl-cal-head">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ol>
          <ol className="rl-cal-days">
            {monthWeeks(D.start)
              .flat()
              .map((n, i) => (
                <li key={i} className={[i % 7 === 0 && 'sun', n === day && 'the-day'].filter(Boolean).join(' ')}>
                  {n || ''}
                  {n === day && <CircleMark className="rl-circle rl-cal-circle rv" width={4.4} />}
                </li>
              ))}
          </ol>
        </div>
        <div className="rl-hero-b">
          <p className="rl-hero-body rv d2">
            {weekdayOf(D.start)} {day} {month} {year}, {spokenTime(D.start)}, at {D.ceremony}, {D.place}. Dinner and dancing after at {D.venue}.
          </p>
          <div className="rl-actions rv d3">
            <a href="#rsvp" className="rl-btn">
              {rOk ? `RSVP by ${rShort}` : 'RSVP'}
            </a>
            <CalendarButton event={EVENT} className="rl-btn rl-btn--line" label="Add to calendar" />
          </div>
        </div>
      </section>

      {/* 2. Countdown */}
      <section className="rl-sec rl-grid rl-count-sec">
        <Head label="Countdown" />
        <Countdown date={D.start} className="rl-count rv d1" />
      </section>

      {/* 3. Where & when */}
      <section className="rl-sec rl-grid" id="where">
        <Head label={`${weekdayOf(D.start).slice(0, 3)} ${pad(day)} ${month.slice(0, 3)} ${year}`.toUpperCase()} title="Where & when" />
        <div className="rl-content">
          <button type="button" className="rl-ph rl-church rv" onClick={() => lightbox.open(4)} aria-label="Open photo of the church">
            <img src={PHOTOS[4].src} alt={PHOTOS[4].alt} loading="lazy" />
          </button>
          <div className="rl-venues">
            {[
              { kind: `Ceremony — ${timeOf(D.start)}`, name: D.ceremony, address: D.ceremonyAddress, q: ceremonyQ },
              { kind: `Reception — ${D.receptionTime}`, name: D.venue, address: D.venueAddress, q: receptionQ },
            ].map((v, i) => (
              <article key={v.kind} className={`rl-venue rv d${i + 1}`}>
                <p className="rl-mono">{v.kind}</p>
                <h3>{v.name}</h3>
                <p className="rl-venue-addr">{v.address}</p>
                <p className="rl-links">
                  <a href={mapsUrl(v.q)} target="_blank" rel="noreferrer">
                    Map
                  </a>
                  <a href={directions(v.q)} target="_blank" rel="noreferrer">
                    Directions
                  </a>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Schedule: a day planner */}
      <section className="rl-sec rl-grid" id="schedule">
        <Head label={scheduleLabel} title="The day, hour by hour" />
        <div className="rl-content">
          {planOk ? (
            <div className="rl-plan rv" style={{ '--span': h1 - h0 }}>
              {Array.from({ length: h1 - h0 + 1 }, (_, k) => (
                <div key={k} className="rl-hour" style={{ top: `calc(var(--hh) * ${k})` }}>
                  <b>{hourLabel(h0 + k)}</b>
                </div>
              ))}
              {blocks.map((s, i) => {
                const short = s.b - s.a < 45;
                const note = s.note || s.sub;
                return (
                  <div
                    key={`${s.time}${i}`}
                    className={`rl-ev${short ? ' is-short' : s.b - s.a < 80 ? ' is-mid' : ''}${isKey(s) ? ' is-key' : ''}`}
                    style={{ top: `calc(var(--hh) * ${s.a / 60 - h0} + 2px)`, height: `calc(var(--hh) * ${(s.b - s.a) / 60} - 4px)` }}
                  >
                    <small>{short ? clock(s.a) : `${clock(s.a)} – ${clock(s.b)} ${ampm(s.b)}`}</small>
                    <b>{s.label || s.tag}</b>
                    {note && <i>{note}</i>}
                  </div>
                );
              })}
            </div>
          ) : (
            <ol className="rl-list">
              {schedule.map((s, i) => (
                <li key={`${s.time}${i}`} className="rv">
                  <span className="rl-mono">{s.time}</span>
                  <b>{s.label || s.tag}</b>
                  <span className="rl-list-note">{s.note || s.sub}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* 5. Dress code */}
      <section className="rl-sec rl-grid" id="dress">
        <Head label="Dress code" title="What to wear" />
        <DressCode note={DRESS.note} palette={PALETTE} shape="square" className="rl-dress" />
        <DressCode attire={DRESS.attire} className="rl-attire" />
      </section>

      {/* 6. Who's who */}
      <section className="rl-sec rl-grid" id="who">
        <Head label="Entourage" title="Who’s who" />
        <div className="rl-content">
          <Entourage groups={entourage} className="rl-ent" />
        </div>
      </section>

      {/* 7. Photographs */}
      <section className="rl-sec rl-grid" id="photos">
        <Head label={`Roll 01 · ${PHOTOS.length - 1} frames`} title="Photographs" />
        <div className="rl-photos">
          {PHOTOS.slice(0, 4).map((p, i) => (
            <button key={p.key} type="button" className={`rl-ph rl-ph--${p.key} rv d${i + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
              <img src={p.src} alt={p.alt} loading="lazy" />
            </button>
          ))}
        </div>
        {lightbox.node}
      </section>

      {/* 8. Gifts */}
      <section className="rl-sec rl-grid" id="gifts">
        <Head label="Gifts" title="Gifts" />
        <p className="rl-gift-note rv">{gifts.note}</p>
        <div className="rl-content rl-gifts-wrap">
          <Gifts accounts={gifts.accounts} qr={gifts.qr} />
        </div>
      </section>

      {/* 9. Questions */}
      <section className="rl-sec rl-grid" id="faq">
        <Head label="FAQ" title="Questions" />
        <div className="rl-content">
          <Faq items={FAQ} />
        </div>
      </section>

      {/* 10. RSVP */}
      <section className="rl-sec rl-grid" id="rsvp">
        <Head label={rOk ? `Reply by ${pad(r.getDate())} ${r.toLocaleDateString('en-US', { month: 'short' })}` : 'Reply'} title="RSVP" red />
        <div className="rl-rsvp-l rv">
          {rOk && <MiniCal date={r} />}
          <p className="rl-rsvp-line">
            We have reserved {seatLine(guest)} for you{guest?.name ? `, ${guest.name}` : ''}. Kindly reply by {D.replyBy}.
          </p>
        </div>
        <div className="rl-rsvp-r rv d1">
          <Rsvp couple={D} deadline={D.replyBy} />
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="rl-foot">
        <p className="rl-see ink rv">
          <span className="rl-see-a">See you </span>
          <span>
            on the{' '}
            <span className="rl-see-day">
              {ordinal(day)}.
              <CircleMark className="rl-circle rl-see-circle rv" width={2.2} />
            </span>
          </span>
        </p>
        <div className="rl-foot-row">
          <p className="rl-mono">
            {D.a} &amp; {D.b} — {pad(day)}.{mm}.{year} — {D.place} — {D.hashtag}
          </p>
          <div className="rl-social">
            <Icon name="instagram" size={20} stroke={1.4} />
            <Icon name="facebook" size={20} stroke={1.4} />
            <Icon name="mail" size={20} stroke={1.4} />
          </div>
        </div>
      </footer>
    </TemplateRoot>
  );
}
