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
import { Grain, QuoteMark, RunningHead } from './motifs.jsx';
import './editorial-luxe.css';

const P = '/templates/editorial-luxe/';

const DEFAULTS = {
  a: 'Sofía',
  b: 'Rafael',
  start: '2027-04-24T16:00:00+08:00',
  end: '2027-04-24T23:59:00+08:00',
  date: '24 April 2027',
  place: 'Makati City',
  venue: 'The Glasshouse at Legazpi',
  venueAddress: 'Legazpi Village, Makati City',
  ceremony: 'Capilla de San Rafael',
  ceremonyAddress: 'McKinley Road, Makati City',
  replyBy: '24 March 2027',
  quote: 'We wanted it to feel like the best dinner party we have ever been to, with everyone we love at one table.',
};

const NAV = [
  { id: 'contents', label: 'Contents' },
  { id: 'places', label: 'The Places' },
  { id: 'edit', label: 'The Edit' },
  { id: 'masthead', label: 'Masthead' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'registry', label: 'Registry' },
  { id: 'letters', label: 'Letters' },
  { id: 'reply', label: 'Kindly Reply' },
];

const SCHEDULE = [
  { time: '3:30 PM', label: 'Arrivals', note: 'Capilla de San Rafael', icon: 'users' },
  { time: '4:00 PM', label: 'The Ceremony', note: 'Capilla de San Rafael', icon: 'rings' },
  { time: '5:30 PM', label: 'Cocktails on the Terrace', note: 'The Glasshouse', icon: 'cheers' },
  { time: '7:00 PM', label: 'Dinner', note: 'A long table, four courses', icon: 'dinner' },
  { time: '9:00 PM', label: 'First Dance', note: 'Then the band', icon: 'music' },
  { time: '11:30 PM', label: 'Last Song', note: 'Cars at midnight', icon: 'heart' },
];

const PALETTE = [
  { name: 'Ivory', hex: '#f1ebde' },
  { name: 'Sand', hex: '#d9ccb4' },
  { name: 'Stone', hex: '#9b958a' },
  { name: 'Charcoal', hex: '#3b3a37' },
  { name: 'Black', hex: '#111110' },
];

const DRESS = {
  note: 'Please dress in the tones below: ivory, sand, stone, charcoal and black. Keep jewellery fine and fabrics natural; silk, wool, linen and crepe all photograph beautifully in black and white. We kindly ask guests to avoid bright colours and prints.',
  shape: 'square',
  attire: [
    { who: 'For her', icon: 'gown', text: 'Floor-length or tea-length gowns. Column silhouettes, bare shoulders, a single strand of pearls.' },
    { who: 'For him', icon: 'barong', text: 'Black tuxedo or a dark suit with a black tie. A barong in ecru piña is equally welcome.' },
  ],
};

const FAQ = [
  { q: 'When should I reply by?', a: 'By the date on your invitation, through the reply card below.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'What does black tie mean here?', a: 'Floor-length or tea-length gowns; a tuxedo or dark suit with a black tie, or a barong. See The Edit above.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but apart from our entourage this will be an adults-only evening.' },
  { q: 'Is there parking?', a: 'Valet parking is available at the Glasshouse from 3:00 PM.' },
];

const STORY_LINE = 'Seven years, two cities, one very long engagement dinner.';

const dayDate = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const weekdayOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { weekday: 'long' });
const dotted = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${d} · ${m} · ${y}`;
};
const timeOf = (iso) => {
  const h = +iso.slice(11, 13);
  const m = iso.slice(14, 16);
  return `${h % 12 || 12}${m === '00' ? '' : `:${m}`} ${h < 12 ? 'AM' : 'PM'}`;
};
const WORDS = ['Twelve', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven'];
function inWords(iso) {
  const h = +iso.slice(11, 13);
  const m = iso.slice(14, 16);
  const part = h < 12 ? 'in the morning' : h < 17 ? 'in the afternoon' : 'in the evening';
  if (m === '30') return `Half past ${WORDS[h % 12].toLowerCase()} ${part}`;
  return `${WORDS[h % 12]} o’clock ${part}`;
}
const splitTime = (t = '') => {
  const m = /^(.*?)\s*(AM|PM)$/i.exec(t.trim());
  return m ? [m[1], m[2].toUpperCase()] : [t, ''];
};
const directions = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
const shortPlace = (p) => p.replace(/\s+City$/i, '');

export const meta = { defaults: DEFAULTS, className: 't-luxe', cover: `${P}cover.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

function Photo({ src, alt, className = '', onClick, label }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag type={onClick ? 'button' : undefined} className={`lx-photo ${className}`} onClick={onClick} aria-label={label}>
      <img src={src} alt={alt} loading="lazy" />
      <Grain />
    </Tag>
  );
}

export default function EditorialLuxe() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const [I1, I2] = initials(D);

  const year = +D.start.slice(0, 4);
  const issue = `${D.a} & ${D.b} · Nº 01`;
  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };
  const ceremonyQ = `${D.ceremony} ${D.ceremonyAddress}`;
  const receptionQ = `${D.venue} ${D.venueAddress}`;
  const accounts = gifts.accounts.map((a) => ({ ...a, label: a.name ? `${a.label} · ${a.name}` : a.label }));
  const longNames = Math.max(D.a.length, D.b.length) > 7;

  const PHOTOS = [
    { src: photo(`${P}portfolio-1.jpg`), alt: `${D.a} and ${D.b} in a wide architectural frame` },
    { src: photo(`${P}portfolio-2.jpg`), alt: 'A street portrait' },
    { src: photo(`${P}portfolio-3.jpg`), alt: 'Hands and rings, close' },
    { src: photo(`${P}portfolio-4.jpg`), alt: 'A candid laugh, in profile' },
    { src: photo(`${P}portfolio-5.jpg`), alt: 'A detail of the dress' },
  ];
  const lightbox = useLightbox(PHOTOS);
  const open = (i) => () => lightbox.open(i);

  return (
    <TemplateRoot
      className="t-luxe"
      nav={NAV}
      rsvp="reply"
      monogram={`${I1} & ${I2}`}
      music="reverie"
      gate={{
        variant: 'curtain',
        names: `${D.a} & ${D.b}`,
        eyebrow: 'You are invited to the wedding of',
        date: `${dotted(D.start)} — ${D.place}`,
        image: photo(`${P}cover.jpg`),
        button: 'Open the issue',
      }}
    >
      <header className="lx-nav k-topnav">
        <p className="lx-caps">The Wedding Issue · Nº 01</p>
        <a href="#top" className="lx-nav-names">
          {D.a} &amp; {D.b}
        </a>
        <nav aria-label="Sections">
          {NAV.slice(0, 4).map(({ id, label }) => (
            <a key={id} href={`#${id}`} className="lx-caps">
              {label.replace(/^The Places$/, 'Places')}
            </a>
          ))}
          <a href="#reply" className="lx-caps lx-nav-reply">
            Reply
          </a>
        </nav>
      </header>

      {/* 1. Cover */}
      <section className="lx-cover">
        <div className="lx-cover-text">
          <p className="lx-caps lx-stone rv">Together with their families</p>
          <h1 className={`lx-names rv d1${longNames ? ' is-long' : ''}`}>
            <span className="lx-name-a">{D.a}</span>
            <em>&amp;</em>
            <span className="lx-name-b">{D.b}</span>
          </h1>
          <div className="lx-cover-foot rv d2">
            <dl className="lx-facts">
              <dt>When</dt>
              <dd>
                {weekdayOf(D.start)}, {D.date} · {timeOf(D.start)}
              </dd>
              <dt>Where</dt>
              <dd>
                {D.ceremony}, {shortPlace(D.place)}
              </dd>
              <dt className="lx-inside">Inside</dt>
              <dd className="lx-inside lx-italic">The vows, the party, what to wear</dd>
            </dl>
            <div className="lx-actions">
              <button type="button" className="lx-btn" onClick={() => scrollToId('reply')}>
                Kindly reply
              </button>
              <CalendarButton event={EVENT} className="lx-btn lx-btn--line" label="Save the date" icon={false} />
            </div>
          </div>
        </div>
        <figure className="lx-cover-photo">
          <Photo src={photo(`${P}cover.jpg`)} alt={`${D.a} and ${D.b}, a black and white portrait`} />
          <figcaption className="lx-vcap">
            Photographed in {shortPlace(D.place)}, {year - 1}
          </figcaption>
        </figure>
      </section>

      {/* 2. Countdown */}
      <section className="lx-countdown">
        <p className="lx-caps">Until the vows</p>
        <Countdown date={D.start} className="lx-count" />
      </section>

      {/* 3. Contents */}
      <section className="lx-sec" id="contents">
        <RunningHead n="04" title="Contents" right={issue} />
        <div className="lx-contents">
          <div>
            <h2 className="lx-h2 rv">Con&shy;tents</h2>
            <p className="lx-p lx-contents-lead rv d1">
              One afternoon, one evening, in the order they happen. Times are for {weekdayOf(D.start)}, {D.date.replace(/\s+\d{4}$/, '')}.
            </p>
          </div>
          <ol className="lx-prog">
            {schedule.map((s, i) => {
              const [t, ap] = splitTime(s.time);
              return (
                <li key={`${s.time}${i}`} className={`rv d${(i % 4) + 1}`}>
                  <span className="lx-prog-time">{t}</span>
                  <span className="lx-prog-text">
                    <span className="lx-prog-label">{s.label || s.tag}</span>
                    {(s.note || s.sub) && <span className="lx-prog-note">{s.note || s.sub}</span>}
                  </span>
                  <span className="lx-prog-ap">{ap}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* 4. The Places */}
      <section className="lx-sec" id="places">
        <RunningHead n="08" title="The Places" right={issue} />
        <div className="lx-spread">
          <figure className="lx-spread-fig rv">
            <Photo src={photo(`${P}chapel.jpg`)} alt={`${D.ceremony}, in black and white`} className="lx-spread-photo" />
            <figcaption className="lx-cap">The nave at {inWords(D.start).replace(/ in the .*$/, '').toLowerCase()}</figcaption>
          </figure>
          <div className="lx-spread-text rv d1">
            <p className="lx-caps lx-gold">I. The Ceremony</p>
            <h3 className="lx-h3">{D.ceremony}</h3>
            <p className="lx-p">{D.ceremonyAddress}</p>
            <p className="lx-italic lx-when">{inWords(D.start)}</p>
            <div className="lx-links">
              <a className="lx-ulink" href={mapsUrl(ceremonyQ)} target="_blank" rel="noreferrer">
                View map
              </a>
              <a className="lx-ulink" href={directions(ceremonyQ)} target="_blank" rel="noreferrer">
                Directions
              </a>
            </div>
          </div>
        </div>
        <div className="lx-spread lx-spread--b">
          <div className="lx-spread-text rv d1">
            <p className="lx-caps lx-gold">II. The Reception</p>
            <h3 className="lx-h3">{D.venue}</h3>
            <p className="lx-p">{D.venueAddress}</p>
            <p className="lx-italic lx-when">Half past five, until midnight</p>
            <div className="lx-links">
              <a className="lx-ulink" href={mapsUrl(receptionQ)} target="_blank" rel="noreferrer">
                View map
              </a>
              <a className="lx-ulink" href={directions(receptionQ)} target="_blank" rel="noreferrer">
                Directions
              </a>
            </div>
          </div>
          <figure className="lx-spread-fig rv">
            <Photo src={photo(`${P}glasshouse.jpg`)} alt={`${D.venue}, a long table under glass`} className="lx-spread-photo" />
            <figcaption className="lx-cap">Dinner at the long table</figcaption>
          </figure>
        </div>
      </section>

      {/* 5. Pull quote */}
      {D.quote && (
        <section className="lx-quote">
          <QuoteMark className="lx-quote-mark" />
          <blockquote className="rv">
            <p>{D.quote}</p>
            <footer className="lx-caps lx-stone">
              — {D.a} &amp; {D.b}
            </footer>
          </blockquote>
        </section>
      )}

      {/* 6. The Edit */}
      <section className="lx-sec" id="edit">
        <RunningHead n="14" title="The Edit" right={issue} />
        <div className="lx-edit-top">
          <div>
            <h2 className="lx-h2 rv">The Edit</h2>
            <p className="lx-italic lx-standfirst rv d1">Black tie, quietly. Tailoring over trends, texture over shine.</p>
          </div>
          <p className="lx-p lx-dropcap rv d2">{DRESS.note}</p>
        </div>
        <DressCode className="lx-edit" palette={PALETTE} attire={DRESS.attire} shape="square" />
      </section>

      {/* 7. Masthead */}
      <section className="lx-sec" id="masthead">
        <RunningHead n="18" title="Masthead" right={issue} />
        <div className="lx-mast-wrap">
          <div>
            <h2 className="lx-h2 lx-h2--m rv">Masthead</h2>
            <p className="lx-p lx-mast-lead rv d1">The people who made us, and the people who stand with us.</p>
          </div>
          <Entourage groups={entourage} className="lx-mast" />
        </div>
      </section>

      {/* 8. Portfolio */}
      <section className="lx-sec lx-sec--bleed" id="portfolio">
        <RunningHead n="22" title="Portfolio" right={issue} />
        <Photo src={PHOTOS[0].src} alt={PHOTOS[0].alt} className="lx-pf-wide rv" onClick={open(0)} label="Open photo 1" />
        <div className="lx-pf-grid">
          <figure className="lx-pf-a rv">
            <Photo src={PHOTOS[1].src} alt={PHOTOS[1].alt} onClick={open(1)} label="Open photo 2" />
            <figcaption className="lx-cap">Escolta, {year - 1}</figcaption>
          </figure>
          <figure className="lx-pf-b rv d1">
            <Photo src={PHOTOS[2].src} alt={PHOTOS[2].alt} onClick={open(2)} label="Open photo 3" />
            <figcaption className="lx-cap">Hands, close</figcaption>
          </figure>
          <figure className="lx-pf-c rv d2">
            <Photo src={PHOTOS[3].src} alt={PHOTOS[3].alt} onClick={open(3)} label="Open photo 4" />
            <figcaption className="lx-italic lx-story">{STORY_LINE}</figcaption>
          </figure>
        </div>
        {lightbox.node}
      </section>

      {/* 9. Registry + Letters */}
      <section className="lx-sec lx-two">
        <div id="registry">
          <RunningHead n="26" title="Registry" />
          <h2 className="lx-h2 lx-h2--s rv">Registry</h2>
          <p className="lx-p rv d1">{gifts.note}</p>
          <Gifts className="lx-gifts" accounts={accounts} qr={gifts.qr} />
        </div>
        <div id="letters">
          <RunningHead n="28" title="Letters" />
          <h2 className="lx-h2 lx-h2--s rv">Letters</h2>
          <Faq items={FAQ} className="lx-faq" />
        </div>
      </section>

      {/* 10. Kindly Reply */}
      <section className="lx-reply" id="reply">
        <div className="lx-reply-l">
          <p className="lx-caps lx-gold">30 — Kindly Reply</p>
          <h2 className="lx-reply-h rv">
            Kindly <em>reply</em>
          </h2>
          <p className="lx-reply-lead rv d1">
            {guest?.name ? `Dear ${guest.name}, we` : 'We'} have reserved {seatLine(guest)} in your honour. Kindly reply by {D.replyBy}.
          </p>
        </div>
        <div className="lx-reply-r rv d2">
          <Rsvp couple={D} deadline={D.replyBy} />
        </div>
      </section>

      {/* 11. Colophon */}
      <footer className="lx-foot">
        <div className="lx-foot-l">
          <p className="lx-caps">Colophon</p>
          <p>Set in Instrument Serif and Inter Tight. Photographed in black and white. Sent with love.</p>
        </div>
        <p className="lx-foot-mono" aria-label={`${D.a} and ${D.b}`}>
          {I1}
          <em>&amp;</em>
          {I2}
        </p>
        <div className="lx-foot-r">
          <p className="lx-caps">
            {dotted(D.start)} — {D.place}
          </p>
          <div className="lx-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
              <Icon name="instagram" size={18} stroke={1.2} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <Icon name="facebook" size={18} stroke={1.2} />
            </a>
          </div>
        </div>
      </footer>
    </TemplateRoot>
  );
}
