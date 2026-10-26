import { useEffect, useRef, useState } from 'react';
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
import { Anahaw, Garland, Hibiscus, Monstera, PalmFrond, Sampaguita, SeaLines, SeaLinesPhone, Shoreline, SunRing, Transom, WaveEdge } from './motifs.jsx';
import './isla.css';

const P = '/templates/isla/';

const DEFAULTS = {
  a: 'Gabriel',
  b: 'Marisol',
  start: '2027-05-15T15:30:00+08:00',
  end: '2027-05-15T23:00:00+08:00',
  date: 'May 15, 2027',
  place: 'Siargao Island, Philippines',
  venue: 'Casa Capiz Garden',
  venueAddress: 'Tourism Road, General Luna, Siargao Island',
  ceremony: 'The Driftwood Chapel',
  ceremonyAddress: 'Pacifico Beach, San Isidro, Siargao Island',
  replyBy: 'April 1, 2027',
};

const NAV = [
  { id: 'where', label: 'When & where' },
  { id: 'program', label: 'Program' },
  { id: 'attire', label: 'Attire' },
  { id: 'entourage', label: 'Entourage' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'faq', label: 'FAQ' },
  { id: 'rsvp', label: 'RSVP' },
];

const SCHEDULE = [
  { time: '3:00 PM', label: 'Welcome drinks', note: 'Buko juice and calamansi spritz under the palms', icon: 'cocktail' },
  { time: '3:30 PM', label: 'Ceremony on the sand', note: 'The Driftwood Chapel, Pacifico Beach', icon: 'rings' },
  { time: '4:30 PM', label: 'Golden-hour photos', note: 'Barefoot along the shoreline', icon: 'camera' },
  { time: '6:00 PM', label: 'Boodle fight dinner', note: 'A feast laid out on banana leaves', icon: 'cutlery' },
  { time: '8:00 PM', label: 'First dance & money dance', note: 'Bring small bills and big moves', icon: 'music' },
  { time: '9:00 PM', label: 'Bonfire & send-off', note: 'Sparklers on the beach', icon: 'cheers' },
];

const PALETTE = [
  { name: 'Hibiscus', hex: '#e07a5f' },
  { name: 'Mango', hex: '#f2b544' },
  { name: 'Sea glass', hex: '#8cc7b5' },
  { name: 'Palm', hex: '#2e6b4f' },
  { name: 'Sand', hex: '#e9d8b8' },
];

const DRESS = {
  note: 'Dress for a garden by the sea: light fabrics in sunset tones. The ceremony is on the sand, so leave the stilettos at home.',
  shape: 'petal',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'A Filipiniana with butterfly sleeves, or a flowy maxi in sunset tones. Wedges or flats for the sand.' },
    { who: 'Gentlemen', icon: 'barong', text: 'Barong Tagalog, or a linen polo barong with light trousers. Loafers or leather sandals.' },
  ],
};

const FAQ = [
  { q: 'How do we get to Siargao?', a: 'Fly into Siargao (IAO) via Manila or Cebu. It is a 40-minute ride to General Luna; we will share a shuttle schedule closer to the date.' },
  { q: 'When should I RSVP by?', a: 'Please reply through the form below by the date on your invitation, so we can plan boats, seats and the boodle feast.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats we have reserved for you. If something has changed, message us and we will do our best.' },
  { q: 'What shoes work on the sand?', a: 'Flats, wedges or barefoot! We will have a basket of tsinelas by the chapel steps.' },
  { q: 'Will there be a money dance?', a: 'Yes! Pin a bill or two on us during our first dance. It is a Filipino tradition and every peso goes to our first home.' },
];

const GIFT_NOTE = 'Your presence on the island is the best gift. If you would like to give something more, a cash gift for our first home together would mean the world.';

const dayOf = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const weekdayOf = (iso) => dayOf(iso).toLocaleDateString('en-US', { weekday: 'long' });
const longDate = (iso) => dayOf(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const dotDate = (iso) => iso.slice(0, 10).split('-').reverse().join(' · ');

function timeOf(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = Number(m[1]);
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}

/** Absolute placement for decorations, in comp pixels. */
const at = (left, top, width, height, transform) => ({ left, top, width, height, transform });

/** True when the element is phone-narrow (the template lays out by its own width). */
function useNarrow(ref, max = 640) {
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === 'undefined') return undefined;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width <= max));
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, max]);
  return narrow;
}

function Head({ eyebrow, title, garland, onDark = false, className = '' }) {
  return (
    <div className={`is-head${onDark ? ' is-head--dark' : ''} ${className} rv`}>
      <p className="is-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {garland && <Garland className="is-garland" leaf={onDark ? '#86b37a' : '#4f8f63'} />}
    </div>
  );
}

const Banig = ({ className = '' }) => <div className={`is-banig ${className}`} aria-hidden="true" />;

function Wave({ fill }) {
  return (
    <>
      <WaveEdge className="is-wave is-wave--desk" fill={fill} />
      <WaveEdge className="is-wave is-wave--phone" fill={fill} phone />
    </>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-isla', cover: `${P}palms.svg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function Isla() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts({ ...demo.gifts(D), note: GIFT_NOTE });
  const { guest } = useInvite();
  const [I1, I2] = initials(D);
  const weekday = weekdayOf(D.start);
  const countRef = useRef(null);
  const narrow = useNarrow(countRef);
  const beach = D.ceremonyAddress.split(',')[0].trim();
  const island = D.place.split(',')[0].trim();

  const EVENT = { title: `${D.a} & ${D.b}'s Wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };
  const VENUES = [
    { kind: 'The Ceremony', name: D.ceremony, time: '3:30 in the afternoon', address: D.ceremonyAddress, icon: 'rings' },
    { kind: 'The Reception', name: D.venue, time: '5:30 until the stars come out', address: D.venueAddress, icon: 'cheers' },
  ];
  const PHOTOS = [
    { src: photo(`${P}sandbar.svg`), alt: `${D.a} and ${D.b} on a sandbar` },
    { src: photo(`${P}bangka.svg`), alt: 'An outrigger bangka at sunset' },
    { src: photo(`${P}palms.svg`), alt: `${D.a} and ${D.b} under the coconut palms` },
    { src: photo(`${P}barefoot.svg`), alt: 'A barefoot walk at the waterline' },
    { src: photo(`${P}sampaguita.svg`), alt: 'Hands holding a sampaguita garland' },
  ];
  const lightbox = useLightbox(PHOTOS);
  const track = useRef(null);
  const nudge = (d) => {
    const el = track.current;
    const item = el?.querySelector('button');
    if (el) el.scrollBy({ left: d * (item ? item.offsetWidth + 16 : el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <TemplateRoot
      className="t-isla"
      nav={NAV}
      monogram={`${I1} & ${I2}`}
      music="canon"
      gate={{
        variant: 'doors',
        names: `${D.a} & ${D.b}`,
        eyebrow: 'Mabuhay! You’re invited to the wedding of',
        date: D.date,
        button: 'Open the windows',
        petals: true,
      }}
    >
      {/* 1. Hero */}
      <section className="is-hero">
        <div className="is-stage is-stage--desk" aria-hidden="true">
          <div className="is-sun" style={at(390, 310, 500, 500)} />
          <SunRing className="is-abs" style={at(350, 270, 580, 580)} />
          <WaveEdge className="is-abs is-full" fill="#23655f" style={{ top: 640, height: 40 }} />
          <div className="is-sea" style={{ top: 666 }} />
          <SeaLines className="is-abs is-full is-foam" preserveAspectRatio="none" style={{ top: 652, height: 240 }} />
          <div className="is-reflect" style={{ top: 836 }}>
            <i />
            <i />
            <i />
          </div>
          <PalmFrond className="is-abs is-leaf" style={{ ...at(-100, 60, 500, 204, 'rotate(24deg)'), color: '#1f4d3a' }} />
          <PalmFrond className="is-abs is-leaf" style={{ ...at(880, 60, 500, 204, 'scaleX(-1) rotate(24deg)'), color: '#2e6b4f' }} />
          <Monstera className="is-abs is-leaf" midrib="#2e6b4f" style={{ ...at(-60, 250, 300, 369, 'rotate(62deg)'), color: '#173a2d' }} />
          <Monstera className="is-abs is-leaf" midrib="#4f8f63" style={{ ...at(1060, 290, 280, 344, 'rotate(-58deg)'), color: '#1f4d3a' }} />
          <Anahaw className="is-abs is-leaf" style={at(120, 430, 240, 268, 'rotate(-14deg)')} />
          <Anahaw className="is-abs is-leaf" light="#86b37a" dark="#4f8f63" style={at(920, 470, 210, 234, 'rotate(16deg)')} />
          <Hibiscus className="is-abs is-leaf" style={at(282, 330, 100, 100, 'rotate(-12deg)')} />
          <Hibiscus className="is-abs is-leaf" style={at(930, 250, 96, 96, 'rotate(18deg)')} />
          <Sampaguita className="is-abs" style={at(252, 236, 24, 24)} />
          <Sampaguita className="is-abs" style={at(372, 452, 22, 22)} />
          <Sampaguita className="is-abs" style={at(1004, 410, 26, 26)} />
          <Sampaguita className="is-abs" style={at(1112, 236, 22, 22)} />
        </div>
        <div className="is-stage is-stage--phone" aria-hidden="true">
          <div className="is-sun" style={at(45, 250, 300, 300)} />
          <SunRing className="is-abs" style={at(18, 223, 354, 354)} />
          <WaveEdge className="is-abs is-full" fill="#23655f" phone style={{ top: 540, height: 28 }} />
          <div className="is-sea" style={{ top: 566 }} />
          <SeaLinesPhone className="is-abs is-full is-foam" preserveAspectRatio="none" style={{ top: 640, height: 160 }} />
          <PalmFrond className="is-abs is-leaf" style={{ ...at(-110, 52, 260, 106, 'rotate(28deg)'), color: '#1f4d3a' }} />
          <PalmFrond className="is-abs is-leaf" style={{ ...at(240, 52, 260, 106, 'scaleX(-1) rotate(28deg)'), color: '#2e6b4f' }} />
          <Monstera className="is-abs is-leaf" midrib="#2e6b4f" style={{ ...at(-80, 430, 150, 184, 'rotate(62deg)'), color: '#173a2d' }} />
          <Monstera className="is-abs is-leaf" midrib="#4f8f63" style={{ ...at(320, 440, 150, 184, 'rotate(-60deg)'), color: '#1f4d3a' }} />
          <Hibiscus className="is-abs is-leaf" style={at(312, 196, 62, 62, 'rotate(18deg)')} />
        </div>

        <header className="is-nav k-topnav">
          <a href="#top" className="is-mono" aria-label="Home">
            {I1}
            <Sampaguita width="18" height="18" />
            {I2}
          </a>
          <nav className="is-links">
            {NAV.slice(0, 6).map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </nav>
          <button type="button" className="is-btn is-btn--sm" onClick={() => scrollToId('rsvp')}>
            RSVP
          </button>
        </header>

        <div className="is-hero-top">
          <p className="is-hero-eyebrow rv">Mabuhay! You&rsquo;re invited to our island wedding</p>
          <h1 className="is-names rv d1">
            <span>{D.a}</span>
            <em>&amp;</em>
            <span>{D.b}</span>
          </h1>
        </div>
        <div className="is-hero-sea">
          <p className="is-hero-date rv">
            {weekday} · {longDate(D.start)}
          </p>
          <p className="is-hero-place rv d1">
            {beach} · {island}
          </p>
          <div className="is-hero-actions rv d2">
            <button type="button" className="is-btn is-btn--lift" onClick={() => scrollToId('rsvp')}>
              RSVP
            </button>
            <CalendarButton event={EVENT} className="is-btn is-btn--sand" label="Save the date" icon={false} />
          </div>
        </div>
      </section>

      {/* 2. Countdown */}
      <section className="is-count-sec is-palm" ref={countRef}>
        <Banig className="is-banig--top" />
        <Anahaw className="is-abs is-count-leaf is-count-leaf--l" light="#24553f" dark="#1f4d3a" stem="#1f4d3a" />
        <Anahaw className="is-abs is-count-leaf is-count-leaf--r" light="#24553f" dark="#1f4d3a" stem="#1f4d3a" />
        <Head eyebrow="Ilang tulog na lang?" title="Counting the sunsets" onDark />
        <Countdown date={D.start} className="is-count rv d1" labels={narrow ? ['Days', 'Hours', 'Min', 'Sec'] : ['Days', 'Hours', 'Minutes', 'Seconds']} />
        <p className="is-count-note rv d2">
          {weekday}, {longDate(D.start)} · {timeOf(D.start)}
        </p>
      </section>

      {/* 3. When & where */}
      <section className="is-sec is-pearl" id="where">
        <Wave fill="#fdf8ef" />
        <Monstera className="is-abs is-leaf is-where-leaf" midrib="#4f8f63" />
        <Head eyebrow="Kailan at saan" title="When & where" garland />
        <Venues items={VENUES} className="is-venues" />
      </section>

      {/* 4. Program */}
      <section className="is-sec is-sand is-program-sec" id="program">
        <PalmFrond className="is-abs is-leaf is-prog-frond" />
        <Hibiscus className="is-abs is-leaf is-prog-hib" />
        <Head eyebrow="Ang programa" title="The day, on island time" />
        <div className="is-prog-wrap">
          <Shoreline className="is-shore is-shore--desk" />
          <Shoreline className="is-shore is-shore--phone" phone />
          <ol className="is-prog">
            {schedule.map((s, i) => (
              <li key={`${s.time}${i}`} className={`rv d${(i % 4) + 1}${i % 2 ? ' is-even' : ' is-odd'}${i === schedule.length - 1 ? ' is-last' : ''}`}>
                <span className="is-prog-node" aria-hidden="true">
                  <Icon name={s.icon || 'heart'} size={26} stroke={1.3} />
                </span>
                <span className="is-prog-text">
                  <span className="is-prog-time">{s.time}</span>
                  <span className="is-prog-label">{s.label || s.tag}</span>
                  {(s.note || s.sub) && <span className="is-prog-note">{s.note || s.sub}</span>}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5. Attire */}
      <section className="is-sec is-pearl is-attire-sec" id="attire">
        <Wave fill="#fdf8ef" />
        <Anahaw className="is-abs is-leaf is-attire-leaf" />
        <div className="is-two">
          <div className="is-attire-l">
            <Head eyebrow="Ano ang isusuot" title="Island Filipiniana" />
            <DressCode note={DRESS.note} palette={PALETTE} shape="petal" className="is-dress-l" />
          </div>
          <DressCode attire={DRESS.attire} className="is-dress-r" />
        </div>
      </section>

      {/* 6. Entourage */}
      <section className="is-sec is-palm is-ent-sec" id="entourage">
        <Banig className="is-banig--top" />
        <Monstera className="is-abs is-ent-leaf is-ent-leaf--l" midrib="#24553f" />
        <Monstera className="is-abs is-ent-leaf is-ent-leaf--r" midrib="#24553f" />
        <Head eyebrow="Mga kasama sa kasal" title="Our entourage" garland onDark />
        <Entourage groups={entourage} className="is-ent" />
      </section>

      {/* 7. Gallery */}
      <section className="is-sec is-sand is-gallery-sec" id="gallery">
        <Wave fill="#f5ead7" />
        <Head eyebrow="Mga alaala" title="Moments" garland />
        <div className="is-gallery" ref={track}>
          {PHOTOS.map((p, i) => (
            <button key={p.src} type="button" className={`is-win is-win--${i + 1} rv d${(i % 4) + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}`}>
              <img src={p.src} alt={p.alt} loading="lazy" />
            </button>
          ))}
        </div>
        <svg className="is-gallery-line" viewBox="0 0 1280 30" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 15 Q40 3 80 15 T160 15 T240 15 T320 15 T400 15 T480 15 T560 15 T640 15 T720 15 T800 15 T880 15 T960 15 T1040 15 T1120 15 T1200 15 T1280 15" fill="none" stroke="#2f7f78" strokeWidth="1.5" opacity="0.5" />
        </svg>
        <div className="is-gallery-arrows">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous photo">
            <Icon name="left" size={20} stroke={1.5} />
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Next photo">
            <Icon name="right" size={20} stroke={1.5} />
          </button>
        </div>
        {lightbox.node}
      </section>

      {/* 8. Gifts */}
      <section className="is-sec is-pearl" id="gifts">
        <Wave fill="#fdf8ef" />
        <div className="is-two is-two--gifts">
          <div className="is-gifts-l">
            <Head eyebrow="Mga regalo" title="Gifts & blessings" />
            <p className="is-body rv d1">{gifts.note}</p>
            <p className="is-salamat rv d2">Maraming salamat po!</p>
          </div>
          <Gifts accounts={gifts.accounts} qr={gifts.qr} className="is-gifts" />
        </div>
      </section>

      {/* 9. FAQ */}
      <section className="is-sec is-sand" id="faq">
        <Wave fill="#f5ead7" />
        <div className="is-two is-two--faq">
          <div className="is-faq-l">
            <Head eyebrow="Mga tanong" title="Good to know" />
            <div className="is-capiz rv d1" aria-hidden="true">
              <div className="is-capiz-win">
                <div className="is-capiz-fan">
                  <Transom size="window" />
                </div>
                <i />
                <div className="is-capiz-panes" />
              </div>
              <Hibiscus className="is-capiz-hib" />
            </div>
          </div>
          <Faq items={FAQ} className="is-faq" />
        </div>
      </section>

      {/* 10. RSVP */}
      <section className="is-sec is-palm is-rsvp-sec" id="rsvp">
        <Banig className="is-banig--top" />
        <div className="is-stage is-stage--desk" aria-hidden="true">
          <PalmFrond className="is-abs" style={{ ...at(-150, 120, 520, 212, 'rotate(35deg)'), color: '#2e6b4f' }} />
          <Anahaw className="is-abs" light="#4f8f63" dark="#2e6b4f" style={at(40, 540, 230, 257, 'rotate(-12deg)')} />
          <Monstera className="is-abs" midrib="#4f8f63" style={{ ...at(1040, 160, 300, 369, 'rotate(-40deg)'), color: '#2e6b4f' }} />
          <Hibiscus className="is-abs" style={at(1000, 600, 110, 110, 'rotate(20deg)')} />
        </div>
        <Head eyebrow="Sasama ka ba?" title="Will you join us on the island?" onDark className="is-rsvp-head" />
        <p className="is-rsvp-line rv d1">
          We&rsquo;ve saved {seatLine(guest)} for you{guest?.name ? `, ${guest.name}` : ''}. Please reply by {D.replyBy}.
        </p>
        <div className="is-window rv d2">
          <div className="is-window-fan" aria-hidden="true">
            <Transom size="rsvp" className="is-transom is-transom--desk" />
            <Transom size="rsvpPhone" className="is-transom is-transom--phone" />
          </div>
          <i className="is-window-rail" aria-hidden="true" />
          <Rsvp couple={D} deadline={D.replyBy} className="is-rsvp-card" />
        </div>
      </section>

      {/* 11. Footer */}
      <footer className="is-foot">
        <Wave fill="#23655f" />
        <SeaLines className="is-foot-foam" preserveAspectRatio="none" />
        <Garland className="is-foot-garland" leaf="#86b37a" />
        <p className="is-foot-names">
          {D.a} <em>&amp;</em> {D.b}
        </p>
        <p className="is-foot-thanks">Maraming salamat!</p>
        <p className="is-foot-meta">
          {dotDate(D.start)} · {island}
        </p>
        <div className="is-social">
          <Icon name="instagram" size={19} stroke={1.3} />
          <Icon name="facebook" size={19} stroke={1.3} />
          <Icon name="mail" size={19} stroke={1.3} />
        </div>
      </footer>
    </TemplateRoot>
  );
}
