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
import { ContactSheet, FileLine, Sprockets, stampOf } from './motifs.jsx';
import './love-archive.css';

// Digital Love Archive: a love story as a well-kept archive. File tabs, a contact sheet with a
// grease-pencil circle, film date stamps, index cards, a running log, tagged people, prints and negatives.

const P = '/templates/love-archive/';

const DEFAULTS = {
  a: 'Bea',
  b: 'Jun',
  start: '2027-02-14T15:00:00+08:00',
  end: '2027-02-14T23:00:00+08:00',
  date: '14 February 2027',
  place: 'Quezon City',
  venue: 'The Print Room',
  venueAddress: 'Maginhawa Street, Teachers Village, Quezon City',
  ceremony: 'St. Therese Chapel',
  ceremonyAddress: 'Scout Area, Quezon City',
  replyBy: '14 January 2027',
  since: '2019',
};

const NAV = [
  { id: 'story', label: '01 Story' },
  { id: 'where', label: '02 Where' },
  { id: 'log', label: '03 Log' },
  { id: 'wear', label: '04 Wear' },
  { id: 'people', label: '05 People' },
  { id: 'prints', label: '06 Prints' },
  { id: 'gifts', label: '07 Letter' },
  { id: 'faq', label: '08 README' },
  { id: 'reply', label: 'Reply' },
];

const SCHEDULE = [
  { time: '2:30 PM', label: 'Guests arrive', note: 'find a seat, any seat', icon: 'users' },
  { time: '3:00 PM', label: 'The ceremony', note: 'tissues provided', icon: 'rings' },
  { time: '4:15 PM', label: 'Photos on the steps', note: 'everyone, then just us', icon: 'camera' },
  { time: '5:30 PM', label: 'Dinner at the Print Room', note: 'family style', icon: 'dinner' },
  { time: '7:30 PM', label: 'Letters, read aloud', note: 'bring yours', icon: 'heart' },
  { time: '8:30 PM', label: 'Dancing', note: 'until the neighbours complain', icon: 'music' },
];

const STORY = [
  { when: '2019', title: 'A borrowed umbrella', text: 'Maginhawa, in the rain. He never got it back.', photo: 'story-1.jpg' },
  { when: '2021', title: 'Letters, mostly', text: 'Two cities and a lot of handwritten mail.', photo: 'story-2.jpg' },
  { when: '2024', title: 'The first apartment', text: 'One plant, two mugs, a record player.', photo: 'story-3.jpg' },
  { when: '2026', title: 'She said yes', text: 'On the roof, at golden hour.', photo: 'story-4.jpg', aside: 'obviously' },
];

const PALETTE = [
  { name: 'Cream', hex: '#f1e7d6' },
  { name: 'Dusty rose', hex: '#c99a93' },
  { name: 'Olive', hex: '#8a8a62' },
  { name: 'Soft brown', hex: '#8b6a52' },
  { name: 'Blush', hex: '#e3cfc4' },
];

const DRESS = {
  note: 'Smart casual, in the colours of an old photo album: cream, dusty rose, olive, brown. Wear what you would want to be photographed in for the next fifty years.',
  shape: 'square',
  attire: [
    { who: 'Her', icon: 'gown', text: 'A slip dress, a cardigan, a skirt that moves. Flats for dancing.' },
    { who: 'Him', icon: 'barong', text: 'Linen shirt or a light barong, trousers, no tie required.' },
  ],
};

const FAQ = [
  { q: 'When should I reply by?', a: 'By the date on your invitation, through the reply card below.' },
  { q: 'Can I take photos?', a: 'Yes, please. Film cameras will be on every table; leave the rolls in the box by the door and we will develop them all.' },
  { q: 'What is “bring your letter”?', a: 'If you like, write us a few lines on paper. We will read some aloud after dinner and keep all of them in the archive.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Is there parking?', a: 'Street parking is limited; we recommend a ride. There is a pay lot two blocks away.' },
];

const PRINTS = [
  { src: `${P}print-1.jpg`, caption: 'IMG_0214.jpg · 35mm · Portra 400' },
  { src: `${P}print-2.jpg`, caption: 'IMG_0388.jpg · flash · Kamuning', aside: 'his worst haircut' },
  { src: `${P}print-3.jpg`, caption: 'IMG_0702.jpg · Baguio · 2022' },
  { src: `${P}print-4.jpg`, caption: 'Negative 01' },
  { src: `${P}print-5.jpg`, caption: 'Negative 02' },
  { src: `${P}print-6.jpg`, caption: 'Negative 03' },
];

const VENUE_ASIDES = ['come early, parking is tight!', 'where the umbrella happened'];

const dayDate = (iso) => new Date(iso.slice(0, 10) + 'T12:00:00');
const weekdayOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { weekday: 'long' });
/** "3:00 PM" → "15:00" */
const to24 = (t = '') => {
  const m = t.match(/(\d{1,2}):?(\d{2})?\s*(AM|PM)?/i);
  if (!m) return t;
  let h = +m[1] % 12;
  if ((m[3] || '').toUpperCase() === 'PM') h += 12;
  if (!m[3] && +m[1] === 12) h = 12;
  return `${String(h).padStart(2, '0')}:${m[2] || '00'}`;
};
const timeOf = (iso) => {
  const h = +iso.slice(11, 13);
  return `${h % 12 || 12}:${iso.slice(14, 16)} ${h < 12 ? 'AM' : 'PM'}`;
};
const ddmm = (iso, full) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d}.${m}.${full ? y : y.slice(2)}`;
};
const directions = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
const fileNo = (n) => `File ${String(n).padStart(3, '0')}`;

/** Best man and maid of honour get the filled tag: the kit marks wide groups, and these hold plain names. */
const tagged = (groups) => groups.map((g) => (/best man|maid of honou?r|matron of honou?r/i.test(g.title) && g.names ? { ...g, wide: true } : g));
const countPeople = (groups) => groups.reduce((n, g) => n + (g.pairs ? g.pairs.length * 2 : g.names.length), 0);

export const meta = { defaults: DEFAULTS, className: 't-archive', cover: `${P}print-1.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function LoveArchive() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = tagged(useEntourage(demo.entourage(D)));
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const [I1, I2] = initials(D);

  const year = D.start.slice(0, 4);
  const stamp = stampOf(D.start);
  const firstStamp = `’${String(D.since).slice(-2)} 6 02`;
  const sheet = Array.from({ length: 12 }, (_, i) => {
    const src = `${P}sheet-${String(i + 1).padStart(2, '0')}.jpg`;
    return { src: photo(src), stamp: i === 5 ? firstStamp : null };
  });
  const prints = PRINTS.map((p) => ({ ...p, src: photo(p.src), alt: `${D.a} and ${D.b}: ${p.caption}` }));
  const lightbox = useLightbox(prints);
  const find = (icon, fallback) => schedule.find((s) => s.icon === icon)?.time || fallback;

  const venues = [
    { kind: `Entry 01 · Ceremony · ${to24(find('rings', timeOf(D.start)))}`, name: D.ceremony, address: D.ceremonyAddress, img: `${P}chapel.jpg`, file: 'chapel.jpg' },
    { kind: `Entry 02 · Reception · ${to24(find('dinner', '5:30 PM'))}`, name: D.venue, address: D.venueAddress, img: `${P}printroom.jpg`, file: 'printroom.jpg' },
  ];
  const event = { title: `${D.a} & ${D.b}’s wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };

  return (
    <TemplateRoot
      className="t-archive"
      nav={NAV}
      rsvp="reply"
      monogram={`${I1} & ${I2}`}
      music="reverie"
      gate={{
        variant: 'envelope',
        names: `${D.a} & ${D.b}`,
        monogram: `${I1.toLowerCase()}&${I2.toLowerCase()}`,
        eyebrow: 'A new file has been added to the archive of',
        hint: 'tap to open the envelope',
        button: 'Open the envelope',
      }}
    >
      {/* The gate lives outside the root, so its film date stamp comes from a rule rather than a variable. */}
      <style>{`.t-archive .k-gate--envelope .k-gate-inner::after{content:${JSON.stringify(stamp)};}`}</style>

      <header className="ar-top k-topnav">
        <p className="ar-mono ar-top-name">
          The {D.a} &amp; {D.b} archive · {D.since}–{year}
        </p>
        <nav aria-label="Sections" className="ar-tabs">
          {NAV.slice(0, 5).map(({ id, label }) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
          <a href="#reply" className="is-reply">
            Reply
          </a>
        </nav>
      </header>

      {/* ---------- Hero: the contact sheet ---------- */}
      <section className="ar-hero">
        <div className="ar-hero-sheet rv">
          <ContactSheet photos={sheet} circle={5} note="the first one" roll="Roll 27 · Portra 400" />
        </div>
        <div className="ar-hero-text">
          <p className="ar-mono rv">{fileNo(1)} · invitation</p>
          <h1 className="ar-names rv d1">
            <span>
              {D.a} <em>&amp;</em>
            </span>
            <span>{D.b}</span>
          </h1>
          <p className="ar-hand ar-hero-hand rv d2">are getting married (finally)</p>
          <dl className="ar-data rv d2">
            <div>
              <dt>Date</dt>
              <dd>
                {weekdayOf(D.start)}, {D.date}
              </dd>
            </div>
            <div>
              <dt>Place</dt>
              <dd>{D.place}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                Developing… <i className="ar-dot" aria-hidden="true" />
              </dd>
            </div>
          </dl>
          <div className="ar-cta rv d3">
            <button type="button" className="ar-btn" onClick={() => scrollToId('reply')}>
              Reply
            </button>
            <CalendarButton event={event} className="ar-btn ar-btn--line" label="Save the date" icon={false} />
          </div>
        </div>
      </section>

      {/* ---------- Date imprint ---------- */}
      <section className="ar-sec ar-count-wrap">
        <div className="ar-count-band rv">
          <p className="ar-mono ar-count-l">Time until the next frame</p>
          <Countdown date={D.start} className="ar-count" labels={['D', 'H', 'M', 'S']} />
          <p className="ar-hand ar-count-r">not long now</p>
        </div>
      </section>

      {/* ---------- Story ---------- */}
      <section className="ar-sec" id="story">
        <FileLine name={`${fileNo(2)} · our-story.txt`} meta={`Modified ${ddmm(D.start)}`} />
        <h2 className="ar-h2 rv">Our story, catalogued</h2>
        <ol className="ar-cards">
          {STORY.map((s, i) => (
            <li key={i} className={`ar-card ar-story rv d${(i % 4) + 1}`}>
              <p className="ar-mono ar-rose">Card {String(i + 1).padStart(2, '0')}</p>
              <p className="ar-story-year">{s.when}</p>
              <img src={photo(`${P}${s.photo}`)} alt="" loading="lazy" />
              <h3>{s.title}</h3>
              <p className="ar-story-text">{s.text}</p>
              {s.aside && <p className="ar-hand ar-story-aside">{s.aside}</p>}
            </li>
          ))}
        </ol>
        <p className="ar-hand ar-swipe">swipe for more →</p>
      </section>

      {/* ---------- Where ---------- */}
      <section className="ar-sec" id="where">
        <FileLine name={`${fileNo(3)} · locations.txt`} meta={`${venues.length} entries`} />
        <h2 className="ar-h2 rv">Where to find us</h2>
        <div className="ar-venues">
          {venues.map((v, i) => (
            <article key={i} className={`ar-card ar-venue rv d${i + 1}`}>
              <div>
                <p className="ar-mono ar-rose">{v.kind}</p>
                <h3 className="ar-venue-name">{v.name}</h3>
                <p className="ar-venue-addr">{v.address}</p>
                <p className="ar-hand ar-venue-aside">{VENUE_ASIDES[i]}</p>
                <div className="ar-links">
                  <a href={mapsUrl(`${v.name} ${v.address}`)} target="_blank" rel="noreferrer">
                    View map
                  </a>
                  <a href={directions(`${v.name} ${v.address}`)} target="_blank" rel="noreferrer">
                    Directions
                  </a>
                </div>
              </div>
              <figure className="ar-print ar-venue-print">
                <img src={photo(v.img)} alt={v.name} loading="lazy" />
              </figure>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- The day, logged ---------- */}
      <section className="ar-sec ar-log-sec" id="log">
        <div>
          <FileLine name={`${fileNo(4)} · log.txt`} />
          <h2 className="ar-h2 rv">The day, logged</h2>
          <p className="ar-hand ar-log-hand rv d1">times are approximate. we will be late.</p>
        </div>
        <ol className="ar-log">
          {schedule.map((s, i) => (
            <li key={i} className={`rv d${(i % 4) + 1}${s.icon === 'rings' ? ' is-key' : ''}`}>
              <span className={s.icon === 'rings' ? 'ar-log-time ar-stamp' : 'ar-log-time'}>{to24(s.time)}:00</span>
              <span className="ar-log-what">{s.label || s.tag}</span>
              {(s.note || s.sub) && <span className="ar-hand ar-log-note">{s.note || s.sub}</span>}
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Swatch book ---------- */}
      <section className="ar-band" id="wear">
        <div className="ar-sec ar-wear-sec">
          <FileLine name={`${fileNo(5)} · what-to-wear.txt`} />
          <div className="ar-wear-grid">
            <h2 className="ar-h2 rv">The swatch book</h2>
            <DressCode className="ar-wear" note={DRESS.note} palette={PALETTE} attire={DRESS.attire} shape="square" />
          </div>
        </div>
      </section>

      {/* ---------- People ---------- */}
      <section className="ar-sec" id="people">
        <FileLine name={`${fileNo(6)} · people.csv`} meta={`Tagged: ${countPeople(entourage)}`} />
        <h2 className="ar-h2 rv">People in these photos</h2>
        <Entourage className="ar-people" groups={entourage} />
      </section>

      {/* ---------- Prints ---------- */}
      <section className="ar-sec" id="prints">
        <FileLine name={`${fileNo(7)} · /prints`} meta={`${prints.length} items`} />
        <h2 className="ar-h2 rv">Prints</h2>
        <div className="ar-prints">
          {prints.slice(0, 3).map((p, i) => (
            <figure key={i} className={`ar-pr ar-pr--${i + 1} rv d${i + 1}`}>
              <button type="button" className="ar-print" onClick={() => lightbox.open(i)} aria-label={`Open print: ${p.caption}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
              <figcaption>
                <span className="ar-mono">{p.caption}</span>
                {p.aside && <span className="ar-hand">{p.aside}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="ar-neg rv">
          <Sprockets />
          <div className="ar-neg-frames">
            {prints.slice(3).map((p, i) => (
              <button key={i} type="button" onClick={() => lightbox.open(i + 3)} aria-label={`Develop and open ${p.caption}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
            ))}
          </div>
          <Sprockets />
        </div>
        <p className="ar-hand ar-neg-cap">negatives: tap to develop ↑</p>
        {lightbox.node}
      </section>

      {/* ---------- Letter + README ---------- */}
      <section className="ar-sec ar-info">
        <div id="gifts">
          <FileLine name={`${fileNo(8)} · letter.jpg`} />
          <div className="ar-card ar-letter rv">
            <p className="ar-letter-hi">Dear friends,</p>
            <p className="ar-letter-body">{gifts.note}</p>
            <p className="ar-letter-sign">
              love, {I1} &amp; {I2}
            </p>
            <Gifts className="ar-gifts" accounts={gifts.accounts.map((a) => ({ ...a, label: a.name ? `${a.label} · ${a.name}` : a.label, name: '' }))} qr={gifts.qr} />
          </div>
        </div>
        <div id="faq">
          <FileLine name={`${fileNo(9)} · README.txt`} />
          <h2 className="ar-h2 ar-h2--sm rv">Read me</h2>
          <Faq className="ar-faq" items={FAQ} first={0} />
        </div>
      </section>

      {/* ---------- Reply ---------- */}
      <section className="ar-reply" id="reply">
        <p className="ar-mono ar-reply-file rv">{fileNo(10)} · reply-card.jpg</p>
        <h2 className="ar-reply-title rv d1">Will you be in the photos?</h2>
        <p className="ar-hand ar-reply-lead rv d2">
          {guest?.name ? `Dear ${guest.name}, we` : 'We'} saved {seatLine(guest)} for you. Kindly reply by {D.replyBy}.
        </p>
        <div className="ar-reply-card rv d3">
          <div className="ar-reply-head">
            <span className="ar-mono">Reply card</span>
            <span className="ar-stamp">{stamp}</span>
          </div>
          <Rsvp couple={D} deadline={D.replyBy} />
        </div>
      </section>

      <footer className="ar-foot">
        <p className="ar-mono">End of archive · saved {ddmm(D.start, true)}</p>
        <p className="ar-foot-mono">
          {I1} <em>&amp;</em> {I2}
        </p>
        <p className="ar-hand">to be continued…</p>
      </footer>
    </TemplateRoot>
  );
}
