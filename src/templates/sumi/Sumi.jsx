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
import { BrushLine, BrushLineV, BrushRule, Enso, Kintsugi, Mizuhiki } from './motifs.jsx';
import './sumi.css';

const P = '/templates/sumi/';

const DEFAULTS = {
  a: 'Ren',
  b: 'Aya',
  start: '2027-11-20T15:00:00+09:00',
  end: '2027-11-20T21:30:00+09:00',
  date: '20 November 2027',
  place: 'Kyoto',
  venue: 'The Tea Pavilion',
  venueAddress: 'Beside the moss garden · six o’clock',
  ceremony: 'Hanare Garden House',
  ceremonyAddress: 'Shimogamo, Sakyō-ku, Kyoto',
  replyBy: '1 October 2027',
};

const NAV = [
  { id: 'day', label: 'The day' },
  { id: 'order', label: 'Order of the day' },
  { id: 'attire', label: 'What to wear' },
  { id: 'family', label: 'Family' },
  { id: 'moments', label: 'Moments' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'questions', label: 'Questions' },
  { id: 'reply', label: 'Reply' },
];

const SCHEDULE = [
  { time: '2:30 PM', label: 'Arrival', note: 'Matcha in the garden', icon: 'users' },
  { time: '3:00 PM', label: 'Ceremony', note: 'Under the old maple', icon: 'rings' },
  { time: '4:00 PM', label: 'Kagami-biraki', note: 'Opening the sake barrel', icon: 'cheers' },
  { time: '5:00 PM', label: 'Portraits', note: 'By the moss garden', icon: 'camera' },
  { time: '6:00 PM', label: 'Dinner', note: 'In the Tea Pavilion', icon: 'dinner' },
  { time: '8:30 PM', label: 'Lanterns', note: 'A send-off by the pond', icon: 'heart' },
];

const PALETTE = [
  { name: 'Sumi', hex: '#2b2926' },
  { name: 'Ai', hex: '#2e3f55' },
  { name: 'Koke', hex: '#6b7451' },
  { name: 'Nezumi', hex: '#8f8a80' },
  { name: 'Kinari', hex: '#e6dccb' },
];

const DRESS = {
  note: 'Formal, in quiet tones: charcoal, indigo, moss and stone. Kimono and yukata are warmly welcome. The garden paths are gravel, so choose shoes you can walk in.',
  shape: 'circle',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'Long dresses or elegant separates in muted, earthy tones. Kimono and furisode are warmly welcome.' },
    { who: 'Gentlemen', icon: 'suit', text: 'A dark suit in charcoal or indigo. Hakama are warmly welcome too.' },
  ],
};

const FAQ = [
  { q: 'When should I reply by?', a: 'Please reply through the form below by the date on your invitation, so we can confirm numbers with the garden house.' },
  { q: 'Is the ceremony indoors or outdoors?', a: 'Outdoors, under the old maple, with the pavilion ready if it rains. Bring a light layer: November evenings in Kyoto are cool.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'Are children welcome?', a: 'We love your little ones, but apart from our family this will be an adults-only celebration.' },
  { q: 'Is there somewhere to stay nearby?', a: 'Several ryokan and hotels are a short walk away in Shimogamo. We will send a list with your confirmation.' },
];

const GIFT_NOTE = 'Your presence is the gift. If you wish to give, a goshūgi envelope on the day or a transfer to either account is warmly received.';

const dayOf = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const weekdayOf = (iso) => dayOf(iso).toLocaleDateString('en-US', { weekday: 'long' });
const dotDate = (iso) => iso.slice(0, 10).split('-').reverse().join(' · ');
const WORDS = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
function spokenTime(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = Number(m[1]);
  const part = h < 12 ? 'in the morning' : h < 17 ? 'in the afternoon' : 'in the evening';
  return `${WORDS[h % 12]}${m[2] === '00' ? '' : `-${m[2]}`} ${part}`;
}
const directions = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

function Hanko({ D, className = '' }) {
  const [I1, I2] = initials(D);
  return (
    <span className={`sm-hanko ${className}`} aria-hidden="true">
      <span>{I1}</span>
      <span>{I2}</span>
    </span>
  );
}

function Rail({ num, label, line = false, children }) {
  return (
    <div className="sm-rail rv" aria-hidden="true">
      {children || <span className="sm-num">{num}</span>}
      <span className="sm-vlabel">{label}</span>
      {line && <i className="sm-rail-line" />}
    </div>
  );
}

function Title({ num, children }) {
  return (
    <div className="sm-title rv">
      <span className="sm-num sm-num--inline" aria-hidden="true">
        {num}
      </span>
      <div>
        <h2>{children}</h2>
        <BrushRule className="sm-brush-rule" />
      </div>
    </div>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-sumi', cover: `${P}portrait.svg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function Sumi() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts({ ...demo.gifts(D), note: GIFT_NOTE });
  const { guest } = useInvite();
  const [I1, I2] = initials(D);

  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };
  const ceremonyQ = `${D.ceremony} ${D.ceremonyAddress}`;
  const receptionQ = `${D.venue} ${D.place}`;
  const PHOTOS = [
    { src: photo(`${P}portrait.svg`), alt: `${D.a} and ${D.b} in a Japanese garden` },
    { src: photo(`${P}maples.svg`), alt: 'A canopy of autumn maples' },
    { src: photo(`${P}hands.svg`), alt: 'Hands holding a sake cup' },
    { src: photo(`${P}lantern.svg`), alt: 'A stone lantern at dusk' },
  ];
  const lightbox = useLightbox(PHOTOS);

  return (
    <TemplateRoot
      className="t-sumi"
      nav={NAV}
      rsvp="reply"
      monogram={`${I1} · ${I2}`}
      music="reverie"
      gate={{
        variant: 'card',
        names: `${D.a} & ${D.b}`,
        monogram: `${I1} & ${I2}`,
        eyebrow: 'You are warmly invited',
        date: D.date,
        button: 'Open invitation',
        hint: 'Tap to unfold',
      }}
    >
      {/* 1. Hero */}
      <section className="sm-hero">
        <header className="sm-nav k-topnav">
          <a href="#top" aria-label="Home">
            <Hanko D={D} />
          </a>
          <nav className="sm-vnav" aria-label="Sections">
            {NAV.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className={id === 'reply' ? 'is-reply' : undefined}>
                {label}
              </a>
            ))}
          </nav>
        </header>

        <div className="sm-hero-in">
          <div className="sm-enso-box">
            <Enso className="sm-enso" />
            <h1 className="sm-names rv">
              <span>{D.a}</span>
              <em>&amp;</em>
              <span>{D.b}</span>
            </h1>
          </div>
          <p className="sm-v sm-hero-when rv d2">
            {D.date} · {D.place}
          </p>
          <p className="sm-v sm-hero-together rv d1">Together with their families</p>
          <div className="sm-musubi rv d3" aria-hidden="true">
            <span className="sm-kanji">結</span>
            <span className="sm-v">Musubi · to tie together</span>
          </div>
          <div className="sm-hero-actions rv d4">
            <button type="button" className="sm-btn" onClick={() => scrollToId('reply')}>
              Reply
            </button>
            <CalendarButton event={EVENT} className="sm-btn sm-btn--line" label="Save the date" icon={false} />
          </div>
        </div>
        <Kintsugi className="sm-seam sm-seam--desk sm-seam--hero" />
        <Kintsugi className="sm-seam sm-seam--phone sm-seam--hero" phone />
      </section>

      {/* 2. Countdown */}
      <section className="sm-sec sm-count-sec">
        <Rail label="Counting down">
          <span className="sm-seal">結</span>
        </Rail>
        <div className="sm-body">
          <Countdown date={D.start} className="sm-count rv d1" />
        </div>
      </section>

      {/* 3. The day */}
      <section className="sm-sec" id="day">
        <Rail num="一" label="The day" line />
        <div className="sm-body sm-day">
          <Title num="一">The day</Title>
          <dl className="sm-dl rv d1">
            <div>
              <dt>When</dt>
              <dd className="sm-dd-main">
                {weekdayOf(D.start)}, {D.date}
              </dd>
              <dd className="sm-dd-small">Ceremony at {spokenTime(D.start)}</dd>
              <dd className="sm-dd-actions">
                <CalendarButton event={EVENT} className="sm-link" label="Add to calendar" icon={false} />
              </dd>
            </div>
            <div>
              <dt>Ceremony</dt>
              <dd className="sm-dd-main">{D.ceremony}</dd>
              <dd className="sm-dd-small">{D.ceremonyAddress}</dd>
              <dd className="sm-dd-actions">
                <a className="sm-link" href={mapsUrl(ceremonyQ)} target="_blank" rel="noreferrer">
                  View map
                </a>
                <a className="sm-link" href={directions(ceremonyQ)} target="_blank" rel="noreferrer">
                  Directions
                </a>
              </dd>
            </div>
            <div>
              <dt>Reception</dt>
              <dd className="sm-dd-main">{D.venue}</dd>
              <dd className="sm-dd-small">{D.venueAddress}</dd>
              <dd className="sm-dd-actions">
                <a className="sm-link" href={mapsUrl(receptionQ)} target="_blank" rel="noreferrer">
                  View map
                </a>
                <a className="sm-link" href={directions(receptionQ)} target="_blank" rel="noreferrer">
                  Directions
                </a>
              </dd>
            </div>
          </dl>
          <figure className="sm-day-photo rv d2">
            <img src={photo(`${P}garden.svg`)} alt="A garden stone path under autumn maples" loading="lazy" />
          </figure>
        </div>
      </section>

      {/* 4. Order of the day */}
      <section className="sm-sec" id="order">
        <Rail num="二" label="Order of the day" />
        <div className="sm-body">
          <Title num="二">Order of the day</Title>
          <div className="sm-prog-wrap">
            <BrushLine className="sm-prog-line" />
            <BrushLineV className="sm-prog-line-v" />
            <ol className="sm-prog">
              {schedule.map((s, i) => (
                <li key={`${s.time}${i}`} className={`rv d${(i % 4) + 1}`}>
                  <span className="sm-prog-time">{s.time}</span>
                  <span className="sm-prog-dot" aria-hidden="true" />
                  <span className="sm-prog-text">
                    <span className="sm-prog-label">{s.label || s.tag}</span>
                    {(s.note || s.sub) && <span className="sm-prog-note">{s.note || s.sub}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 5. What to wear */}
      <section className="sm-sec sm-attire-sec" id="attire">
        <Rail num="三" label="What to wear" />
        <div className="sm-body">
          <Title num="三">What to wear</Title>
          <div className="sm-cols">
            <DressCode note={DRESS.note} palette={PALETTE} shape="circle" className="sm-dress-l" />
            <DressCode attire={DRESS.attire} className="sm-dress-r" />
          </div>
        </div>
        <Kintsugi className="sm-seam sm-seam--desk sm-seam--bottom" />
        <Kintsugi className="sm-seam sm-seam--phone sm-seam--bottom" phone />
      </section>

      {/* 6. Family & friends */}
      <section className="sm-sec" id="family">
        <Rail num="四" label="Family" />
        <div className="sm-body">
          <Title num="四">Family &amp; friends</Title>
          <div className="sm-ent-wrap">
            <BrushLineV className="sm-ent-line" />
            <Entourage groups={entourage} className="sm-ent" />
          </div>
        </div>
      </section>

      {/* 7. Moments */}
      <section className="sm-sec" id="moments">
        <Rail num="五" label="Moments" />
        <div className="sm-body">
          <Title num="五">Moments</Title>
          <div className="sm-moments">
            {PHOTOS.map((p, i) => (
              <button key={p.src} type="button" className={`sm-ph sm-ph--${'abcd'[i]} rv d${i + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
            ))}
          </div>
          {lightbox.node}
        </div>
      </section>

      {/* 8. Gifts */}
      <section className="sm-sec" id="gifts">
        <Rail num="六" label="Gifts" />
        <div className="sm-body">
          <Title num="六">Gifts</Title>
          <div className="sm-cols">
            <div className="sm-gifts-l">
              <p className="sm-note rv">{gifts.note}</p>
              <figure className="sm-knot rv d1">
                <Mizuhiki className="sm-knot-svg" casing="#f3eee3" />
                <figcaption>Mizuhiki: a knot that cannot be untied.</figcaption>
              </figure>
            </div>
            <Gifts accounts={gifts.accounts} qr={gifts.qr} className="sm-gifts" />
          </div>
        </div>
      </section>

      {/* 9. Questions */}
      <section className="sm-sec" id="questions">
        <Rail num="七" label="Questions" />
        <div className="sm-body">
          <Title num="七">Questions</Title>
          <Faq items={FAQ} className="sm-faq" />
        </div>
      </section>

      {/* 10. Reply */}
      <section className="sm-sec sm-reply" id="reply">
        <Kintsugi className="sm-seam sm-seam--desk sm-seam--top" />
        <Kintsugi className="sm-seam sm-seam--phone sm-seam--top" phone />
        <Rail num="八" label="Reply" />
        <div className="sm-body sm-reply-body">
          <Enso className="sm-reply-enso" />
          <h2 className="sm-reply-title rv">Will you join us?</h2>
          <p className="sm-reply-line rv d1">
            We have reserved {seatLine(guest)} for you{guest?.name ? `, ${guest.name}` : ''}. Kindly reply by {D.replyBy}.
          </p>
          <div className="sm-card-wrap rv d2">
            <Rsvp couple={D} deadline={D.replyBy} className="sm-rsvp" />
            <Hanko D={D} className="sm-stamp" />
          </div>
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="sm-foot">
        <Kintsugi className="sm-seam sm-seam--desk sm-seam--top" />
        <Kintsugi className="sm-seam sm-seam--phone sm-seam--top" phone />
        <Hanko D={D} className="sm-foot-hanko" />
        <div className="sm-foot-text">
          <p className="sm-foot-names">
            {D.a} <em>&amp;</em> {D.b}
          </p>
          <p className="sm-foot-meta">
            {dotDate(D.start)} · {D.place}
          </p>
          <div className="sm-social">
            <Icon name="instagram" size={18} stroke={1.3} />
            <Icon name="facebook" size={18} stroke={1.3} />
            <Icon name="mail" size={18} stroke={1.3} />
          </div>
        </div>
        <span className="sm-foot-kanji" aria-hidden="true">
          結
        </span>
      </footer>
    </TemplateRoot>
  );
}
