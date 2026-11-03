import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../shared/Icon.jsx';
import {
  CalendarButton,
  Countdown,
  Entourage,
  Faq,
  Rsvp,
  TemplateRoot,
  initials,
  mapsUrl,
  scrollToId,
  useDetails,
  useEntourage,
  useGifts,
  useInvite,
  useLightbox,
  usePhoto,
  useSchedule,
} from '../kit/index.js';
import Union from './Union.jsx';
import { Arrow, CopyMark, Monogram, Seal, toRoman } from './motifs.jsx';
import { prefersReduced, useHeroProgress, useLookbook, useParallax, useProgress, useSheen } from './motion.js';
import { ROMAN_SECTIONS, directions, dotted, fit, formalDate, formalDay, formalReplyBy, seatsCount, spokenTime, timeOf, tzLabel, weekdayOf, yearOf, yearWords } from './words.js';
import './maison.css';

const P = '/templates/maison/';

const DEFAULTS = {
  a: 'Mariel',
  aLast: 'Salcedo',
  b: 'Joaquin',
  bLast: 'Arguelles',
  start: '2028-02-12T16:00:00+08:00',
  end: '2028-02-12T23:30:00+08:00',
  date: '12 February 2028',
  place: 'Makati City',
  ceremony: 'Santuario de San Antonio',
  ceremonyAddress: 'McKinley Road, Forbes Park, Makati City',
  venue: 'The Peninsula Manila',
  venueAddress: 'Rigodon Ballroom · Ayala Avenue corner Makati Avenue, Makati City',
  venueNote: 'Dinner and dancing until late',
  receptionTime: '6:30 PM',
  replyBy: '10 January 2028',
  invitation: 'request the pleasure of your company at the celebration of the marriage of their children',
  quote: 'Two names, one house.',
  storyIntro: 'Two families, two cities and a friendship that took its time. We built a life one ordinary Sunday at a time, and on our wedding day we make it official, with the people who made us who we are.',
  story1Year: '2019',
  story1Title: 'A seat by the window',
  story1Text: 'A friend’s birthday in Salcedo Village, one shared table and a conversation that outlasted the night.',
  story2Year: '2022',
  story2Title: 'The long way home',
  story2Text: 'Weekend drives to Tagaytay, one playlist on repeat, and the quiet certainty that home was a person.',
  story3Year: '2026',
  story3Title: 'A question at dusk',
  story3Text: 'On the steps of a white pavilion, as the light turned gold, he asked. She said yes before he finished.',
  aParent1: 'Mr. Ramon Salcedo',
  aParent2: 'Mrs. Teresita Salcedo',
  bParent1: 'Mr. Enrique Arguelles',
  bParent2: 'Mrs. Carmela Arguelles',
  dressTitle: 'Black tie',
  dressNote: 'Floor-length gowns and tuxedos in noir, bordeaux, claret, champagne or palladium. A barong Tagalog in piña or jusi is warmly welcome.',
  giftDetails: 'On the day, a gift box waits at the reception',
  closing: 'Thank you for being part of our story.',
  hashtag: '#MarielAndJoaquin',
};

const NAV = [
  { id: 'invitation', label: 'The invitation' },
  { id: 'story', label: 'Our story' },
  { id: 'celebration', label: 'The celebration' },
  { id: 'programme', label: 'The programme' },
  { id: 'attire', label: 'Attire' },
  { id: 'entourage', label: 'The entourage' },
  { id: 'portraits', label: 'Portraits' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'questions', label: 'Questions' },
];
const TOPNAV = [
  ['story', 'Story'],
  ['celebration', 'Celebration'],
  ['programme', 'Programme'],
  ['attire', 'Attire'],
  ['portraits', 'Portraits'],
  ['gifts', 'Gifts'],
];

const SCHEDULE = [
  { time: '3:30 PM', label: 'Guests arrive', note: 'Santuario de San Antonio', icon: 'users' },
  { time: '4:00 PM', label: 'The ceremony', note: 'The nuptial Mass', icon: 'rings' },
  { time: '5:30 PM', label: 'Cocktails', note: 'The Lobby, The Peninsula Manila', icon: 'cheers' },
  { time: '6:30 PM', label: 'Dinner', note: 'Rigodon Ballroom', icon: 'dinner' },
  { time: '8:30 PM', label: 'The first dance', note: 'And then the floor is yours', icon: 'music' },
  { time: '11:30 PM', label: 'Send-off', note: 'Sparklers on the driveway', icon: 'heart' },
];

const PALETTE = [
  { name: 'Noir', hex: '#1E1A1B' },
  { name: 'Bordeaux', hex: '#561925' },
  { name: 'Claret', hex: '#7B2D3B' },
  { name: 'Champagne', hex: '#D9C7B0' },
  { name: 'Palladium', hex: '#BDB6AE' },
];

const DRESS = {
  note: DEFAULTS.dressNote,
  shape: 'square',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'Floor-length gowns, or a modern Filipiniana, in deep wine, claret, champagne or black.' },
    { who: 'Gentlemen', icon: 'barong', text: 'A black tuxedo, or a barong Tagalog in piña or jusi over black trousers.' },
  ],
};

const ENTOURAGE = [
  { title: 'Principal Sponsors', wide: true, pairs: [['Mr. Antonio Ramos', 'Mrs. Lourdes Ramos'], ['Mr. Fernando Cruz', 'Mrs. Isabel Cruz'], ['Dr. Manuel Torres', 'Dr. Patricia Torres'], ['Mr. Ricardo Lim', 'Mrs. Angela Lim']] },
  { title: 'Best Man', names: ['Paolo Arguelles'] },
  { title: 'Maid of Honour', names: ['Bianca Salcedo'] },
  { title: 'Groomsmen', names: ['Marco Dizon', 'Luis Navarro', 'Enzo Sy'] },
  { title: 'Bridesmaids', names: ['Nina Aquino', 'Trisha Mendoza', 'Celine Go'] },
  { title: 'Candle · Veil · Cord', wide: true, pairs: [['Mr. Jun Castro', 'Ms. Rina Castro'], ['Mr. Leo Bautista', 'Ms. Joy Bautista'], ['Mr. Carlo Sison', 'Ms. Mae Sison']] },
  { title: 'Ring & Coin Bearers', names: ['Gabriel Ramos', 'Elijah Cruz'] },
  { title: 'Flower Girls', names: ['Sophia Torres', 'Ava Lim'] },
];

const GIFT_NOTE = 'Your presence is the gift we treasure most. Should you wish to honour us further, a contribution towards our first home would be received with gratitude.';

const faqFor = (D) => [
  { q: 'When should I reply?', a: 'Kindly reply through the card below by the date on your invitation, so we can confirm the seating with the hotel.' },
  { q: 'Is there parking at both venues?', a: 'Yes. Valet parking is available at the church and at the hotel. Allow twenty minutes between them on a Saturday afternoon.' },
  { q: 'Can I bring a plus-one?', a: 'Your invitation shows the seats reserved in your name. If something has changed, please message us and we will do our best.' },
  { q: 'Are children welcome?', a: 'We adore your little ones, but apart from our entourage this will be an adults-only evening.' },
  { q: 'May I take photos during the ceremony?', a: 'We are having an unplugged ceremony. Our photographers will capture every moment; the reception is yours to photograph.' },
  { q: 'Where can we stay?', a: `We have reserved a block of rooms at ${D.venue}. Mention our names when you book for the wedding rate.` },
];

export const meta = { defaults: DEFAULTS, className: 't-maison', cover: `${P}hero.jpg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

/* ------------------------------------------------------------------ Small pieces */

/** Running head: Roman numeral, hairline, label. The real heading is the h2 that follows. */
const Rh = ({ n, label }) => (
  <div className="ma-rh rv" aria-hidden="true">
    <b>{ROMAN_SECTIONS[n]}</b>
    <i />
    <span>{label}</span>
  </div>
);

/** A title that rises line by line inside masks. */
const Title = ({ lines, className = '', id }) => (
  <h2 className={`ma-title rv ${className}`} id={id}>
    {lines.map((l) => (
      <span key={l} className="ma-line">
        <span>{l}</span>
      </span>
    ))}
  </h2>
);

/** Text link with the hairline arrow. */
const Lnk = ({ href, children, dark = false }) => (
  <a className={`ma-lnk${dark ? ' ma-lnk--dark' : ''}`} href={href} target="_blank" rel="noreferrer">
    {children}
    <Arrow />
  </a>
);

/** Plate caption: italic line on the left, caps plate number on the right. */
const Caption = ({ text, n }) => (
  <figcaption>
    <span>{text}</span>
    <span className="ma-cap">Plate {toRoman(n)}</span>
  </figcaption>
);

function CopyButton({ value }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value.replace(/\s+/g, ''));
    } catch {
      /* clipboard can be blocked; the number is still on the card */
    }
    setDone(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1800);
  };
  return (
    <button type="button" className={`ma-copy${done ? ' is-done' : ''}`} onClick={copy} aria-live="polite">
      {done ? <Icon name="check" size={14} stroke={1.2} /> : <CopyMark />}
      {done ? 'Copied' : 'Copy'}
    </button>
  );
}

/** "4:00 PM" → 4:00 + small-caps PM. */
const TimeOf = ({ time }) => {
  const m = /^(.*?)\s*([AaPp]\.?[Mm]\.?)$/.exec((time || '').trim());
  return m ? (
    <>
      {m[1]}
      <small>{m[2].replace(/\./g, '').toUpperCase()}</small>
    </>
  ) : (
    time
  );
};

const splitQuote = (q) => {
  const i = q.indexOf(',');
  return i > 0 && i < q.length - 1 ? [q.slice(0, i + 1), q.slice(i + 1).trim()] : [q];
};

/* ------------------------------------------------------------------ The invitation */

export default function Maison() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(ENTOURAGE);
  const giftDefaults = useMemo(
    () => ({
      note: GIFT_NOTE,
      accounts: [
        { label: 'GCash', name: `${D.a} ${D.aLast}`, number: '0917 555 0143' },
        { label: 'BPI Savings', name: `${D.b} ${D.bLast}`, number: '1234 5678 90' },
      ],
    }),
    [D.a, D.aLast, D.b, D.bLast]
  );
  const gifts = useGifts(giftDefaults);
  const { mode, gate, guest } = useInvite();
  const [I1, I2] = initials(D);

  const thumb = mode === 'thumb';
  const embedded = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('embed');
  const [reduced, setReduced] = useState(prefersReduced);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  // Thumbnails, reduced motion and the Customize preview show every moment at its end state.
  const still = thumb || reduced || embedded;

  const gated = !thumb && gate !== false;
  const [ready, setReady] = useState(() => !gated);
  const [arrived, setArrived] = useState(() => !gated);

  const rootRef = useRef(null);
  const heroRef = useRef(null);
  const progRef = useRef(null);
  const lookRef = useRef(null);
  const stageRef = useRef(null);
  const trackRef = useRef(null);
  const barRef = useRef(null);
  const countRef = useRef(null);

  // The root element is TemplateRoot's #top; find it once mounted.
  useEffect(() => {
    rootRef.current = heroRef.current?.closest('.tpl') || null;
  }, []);

  useHeroProgress(heroRef, !still);
  useSheen(rootRef, !still);
  useParallax(rootRef, !still);
  useProgress(progRef, !still);

  const hero = photo(`${P}hero.jpg`);
  const names = `${D.a} & ${D.b}`;
  const nameSize = fit(names, 1120, 128);
  const nameSizePhone = fit([D.a, `& ${D.b}`].sort((x, y) => y.length - x.length)[0], 342, 72);
  const footSize = fit(names, 740, 72);
  const footSizePhone = fit(names, 342, 40);
  const year = yearOf(D.start);
  const quote = splitQuote(D.quote);
  const event = { title: `${D.a} & ${D.b}’s wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}`, details: `Reception: ${D.venue}, ${D.venueAddress}` };

  const parents = [
    [D.aParent1, D.aParent2].filter(Boolean),
    [D.bParent1, D.bParent2].filter(Boolean),
  ].filter((p) => p.length);

  const STORY = [1, 2, 3]
    .map((n) => ({ year: D[`story${n}Year`], title: D[`story${n}Title`], text: D[`story${n}Text`] }))
    .filter((s) => s.year || s.title);

  const PLATES = [
    { file: 'dance.jpg', alt: `${D.a} and ${D.b}, the first dance`, label: 'the first dance', w: 690 },
    { file: 'gown.jpg', alt: 'The gown', label: 'the gown', w: 307 },
    { file: 'hands.jpg', alt: 'The rings', label: 'the rings', w: 460, mono: true },
    { file: 'embrace.jpg', alt: `${D.a} and ${D.b}, an embrace`, label: 'an embrace', w: 307 },
    { file: 'dusk.jpg', alt: `${D.a} and ${D.b} at dusk`, label: 'at dusk', w: 690 },
    { file: 'toast.jpg', alt: 'The champagne tower', label: 'the champagne tower', w: 690 },
  ].map((p, i) => ({ ...p, n: i + 3, src: photo(`${P}${p.file}`) }));
  const lightbox = useLightbox(PLATES);
  useLookbook(lookRef, stageRef, trackRef, barRef, countRef, PLATES.length, !still);

  const ceremonyQ = `${D.ceremony}, ${D.ceremonyAddress}`;
  const venueQ = `${D.venue}, ${D.venueAddress}`;

  const nameLines = (
    <>
      <span className="ma-nl">
        <span>{D.a}</span>
      </span>{' '}
      <span className="ma-nl">
        <span>
          <em>&amp;</em> {D.b}
        </span>
      </span>
    </>
  );

  return (
    <TemplateRoot
      className={`t-maison${still ? ' ma-still' : ''}`}
      nav={NAV}
      rsvp="rsvp"
      music="reverie"
      monogram={
        <>
          {I1}
          <em>&amp;</em>
          {I2}
        </>
      }
    >
      <Union
        D={D}
        letters={[I1, I2]}
        heroSrc={hero}
        onArrive={() => setArrived(true)}
        onDone={() => {
          setArrived(true);
          setReady(true);
        }}
      />

      {/* 0. Hero: Surfacing */}
      <section
        ref={heroRef}
        className={`ma-hero${ready ? ' is-ready' : ''}${arrived ? '' : ' is-gated'}`}
        aria-label={`${D.a} and ${D.b}, ${D.date}`}
        style={{ '--ma-names': `${nameSize}px`, '--ma-names-ph': `${nameSizePhone}px` }}
      >
        <div className="ma-hero-stage">
          <h1 className="ma-names">{nameLines}</h1>
          <div className="ma-hero-photo">
            <img src={hero} alt={`${D.a} and ${D.b}`} fetchpriority="high" decoding="async" />
          </div>
          <div className="ma-hero-scrim" aria-hidden="true" />
          <div className="ma-names--light" aria-hidden="true">
            <p className="ma-names">{nameLines}</p>
          </div>
          <p className="ma-hero-meta ma-cap">
            <span className="ma-hide-ph">{weekdayOf(D.start)} · </span>
            {D.date} · {D.place}
          </p>
          <div className="ma-hero-cta">
            <CalendarButton event={event} className="ma-lnk ma-hero-save" label="Save the date" icon={false} />
            <button type="button" className="ma-btn" onClick={() => scrollToId('rsvp')}>
              R.S.V.P.
            </button>
          </div>
          <header className="ma-topnav k-topnav">
            <a href="#top" className="ma-topnav-mark" aria-label={`${D.a} and ${D.b}, back to top`}>
              <Monogram a={I1} b={I2} gap="var(--ma-bone)" />
            </a>
            <nav aria-label="Sections">
              {TOPNAV.map(([id, label]) => (
                <a key={id} href={`#${id}`}>
                  {label}
                </a>
              ))}
              <a href="#rsvp" className="ma-topnav-rsvp">
                R.S.V.P.
              </a>
            </nav>
          </header>
        </div>
      </section>

      {/* I. The invitation */}
      <section className="ma-sec ma-inv" id="invitation" aria-labelledby="ma-inv-h">
        <div className="ma-grid">
          <Rh n={0} label="The invitation" />
          <div className="ma-inv-text">
            <h2 className="ma-sr" id="ma-inv-h">
              The invitation
            </h2>
            <p className="ma-cap ma-muted rv">Together with their families</p>
            <div className={`ma-parents rv d1${parents.length === 1 ? ' is-one' : ''}`}>
              {parents.map((p) => (
                <p key={p.join()}>
                  {p[0]}
                  {p[1] && (
                    <>
                      <br />&amp; {p[1]}
                    </>
                  )}
                </p>
              ))}
            </div>
            <p className="ma-inv-formal rv d2">{D.invitation}</p>
            <p className="ma-inv-names rv">
              {D.a} {D.aLast}
              <br />
              <em>&amp;</em> {D.b} {D.bLast}
            </p>
            <p className="ma-inv-date rv d1">
              on {formalDay(D.start)}, {yearWords(year)}, at {spokenTime(D.start)}, at the {D.ceremony}.
            </p>
            <p className="ma-cap ma-muted ma-inv-rec rv d2">
              <span className="ma-hide-ph">Reception to follow</span>
              <span className="ma-show-ph">Reception</span> · {D.venue}
            </p>
          </div>
          <figure className="ma-plate ma-inv-plate rv d1">
            <div className="ma-duo">
              <img src={photo(`${P}profiles.jpg`)} alt={`${D.a} and ${D.b} in profile, facing each other`} loading="lazy" decoding="async" />
            </div>
            <Caption text={D.quote} n={1} />
          </figure>
        </div>
      </section>

      {/* II. Our story */}
      <section className="ma-sec ma-story" id="story">
        <div className="ma-grid">
          <Rh n={1} label="Our story" />
          <div className="ma-story-text">
            <Title lines={quote} className="ma-story-title" />
            <p className="ma-body ma-story-intro rv d1">{D.storyIntro}</p>
            <p className="ma-sign rv d2">
              — {D.a} &amp; {D.b}
            </p>
          </div>
          <figure className="ma-plate is-mono ma-story-plate rv" data-parallax="">
            <div className="ma-frame">
              <img src={photo(`${P}portrait.jpg`)} alt={`${D.a} and ${D.b}, backlit, in black and white`} loading="lazy" decoding="async" />
            </div>
            <Caption text="The evening of the question." n={2} />
          </figure>
          {STORY.length > 0 && (
            <ol className="ma-chron">
              {STORY.map((s, i) => (
                <li key={`${s.year}${s.title}`} className={`rv d${i + 1}`}>
                  <b>{s.year}</b>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </section>

      {/* Countdown: lacquer interlude */}
      <section className="ma-lacquer ma-count-sec" aria-label="Countdown">
        <div className="ma-grid">
          <div className="ma-count-rule rv" aria-hidden="true">
            <span className="ma-cap">Until we say I do</span>
            <i />
            <span className="ma-cap ma-hide-ph">{tzLabel(D.start)}</span>
          </div>
          <div className="ma-count-left">
            <p className="ma-count-date rv">{formalDate(D.start)}</p>
            <div className="ma-count-cal rv d2">
              <CalendarButton event={event} className="ma-lnk ma-lnk--dark" label={<>Add to calendar<Arrow /></>} icon={false} />
            </div>
          </div>
          <div className="ma-count-right rv d1" data-foil="">
            <Countdown date={D.start} className="ma-count" />
          </div>
        </div>
      </section>

      {/* III. The celebration */}
      <section className="ma-sec ma-cel" id="celebration">
        <div className="ma-grid">
          <Rh n={2} label="The celebration" />
          <Title lines={['Two addresses,', 'one celebration.']} />
          <figure className="ma-venue-photo ma-cel-photo--a rv" data-parallax="">
            <img src={photo(`${P}ceremony.jpg`)} alt={`The nave of ${D.ceremony}, dressed in white flowers`} loading="lazy" decoding="async" />
          </figure>
          <div className="ma-venue ma-cel-text--a rv d1">
            <p className="ma-cap ma-wine">The ceremony · {timeOf(D.start)}</p>
            <h3>{D.ceremony}</h3>
            <p className="ma-venue-when">
              {weekdayOf(D.start)}, {D.date}
            </p>
            <p className="ma-venue-addr">{D.ceremonyAddress}</p>
            <div className="ma-links">
              <Lnk href={mapsUrl(ceremonyQ)}>View map</Lnk>
              <Lnk href={directions(ceremonyQ)}>Directions</Lnk>
              <CalendarButton event={event} className="ma-lnk" label={<>Add to calendar<Arrow /></>} icon={false} />
            </div>
          </div>
          <i className="ma-hair ma-cel-rule" aria-hidden="true" />
          <div className="ma-venue ma-cel-text--b rv">
            <p className="ma-cap ma-wine">The reception · {D.receptionTime}</p>
            <h3>{D.venue}</h3>
            {D.venueNote && <p className="ma-venue-when">{D.venueNote}</p>}
            <p className="ma-venue-addr">{D.venueAddress}</p>
            <div className="ma-links">
              <Lnk href={mapsUrl(venueQ)}>View map</Lnk>
              <Lnk href={directions(venueQ)}>Directions</Lnk>
            </div>
          </div>
          <figure className="ma-venue-photo ma-cel-photo--b rv d1" data-parallax="">
            <img src={photo(`${P}reception.jpg`)} alt={`The ballroom at ${D.venue}, set for dinner`} loading="lazy" decoding="async" />
          </figure>
        </div>
      </section>

      {/* IV. The programme */}
      <section className="ma-sec ma-prog" id="programme">
        <div className="ma-grid">
          <Rh n={3} label="The programme" />
          <div className="ma-prog-left">
            <Title lines={['The order of', 'the evening']} />
            <p className="ma-small rv d1">All times are {tzLabel(D.start)}. Kindly be seated fifteen minutes before the processional.</p>
          </div>
          <div className="ma-prog-list" ref={progRef}>
            <span className="ma-prog-track" aria-hidden="true">
              <i />
              <b />
            </span>
            <ol>
              {schedule.map((s, i) => (
                <li key={`${s.time}${i}`} className={`rv d${(i % 3) + 1}`}>
                  <span className="ma-prog-time">
                    <TimeOf time={s.time} />
                  </span>
                  <div>
                    <h3>{s.label || s.tag}</h3>
                    {(s.note || s.sub) && <p>{s.note || s.sub}</p>}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* V. Attire */}
      <section className="ma-sec ma-stone ma-att" id="attire">
        <div className="ma-grid">
          <Rh n={4} label="Attire" />
          <div className="ma-att-left">
            <h2 className="ma-statement ma-att-title rv">{D.dressTitle}</h2>
            <p className="ma-body ma-att-note rv d1">{D.dressNote}</p>
          </div>
          <ul className="ma-attire">
            {DRESS.attire.map((a, i) => (
              <li key={a.who} className={`rv d${i + 1}`}>
                <Icon name={a.icon} size={40} stroke={1} />
                <div>
                  <h3>{a.who}</h3>
                  <p>{a.text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="ma-palette">
            <p className="ma-cap ma-muted rv">The palette</p>
            <ul className="rv d1" aria-label="Colour palette">
              {PALETTE.map((c) => (
                <li key={c.name}>
                  <i style={{ backgroundColor: c.hex }} aria-hidden="true" />
                  <b>{c.name}</b>
                  <span>{c.hex}</span>
                </li>
              ))}
            </ul>
            <div className="ma-bride rv d2">
              <span aria-hidden="true">
                <i />
              </span>
              <p>White, ivory and cream are kindly reserved for the bride.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VI. The entourage */}
      <section className="ma-sec ma-entsec" id="entourage">
        <div className="ma-grid">
          <Rh n={5} label="The entourage" />
          <Title lines={['With those who', 'stand beside us']} />
          <Entourage groups={entourage} className="ma-ent" />
        </div>
      </section>

      {/* VII. Portraits: the lookbook */}
      <section className={`ma-sec ma-look${reduced ? ' is-calm' : ''}`} id="portraits" ref={lookRef}>
        <div className="ma-look-stage" ref={stageRef}>
          <div className="ma-grid">
            <Rh n={6} label="Portraits" />
            <Title lines={['A few frames,', 'before the day.']} />
            <div className="ma-look-count rv d1" aria-hidden="true">
              <div>
                <span ref={countRef}>01</span>
                <span className="ma-look-bar">
                  <i ref={barRef} />
                </span>
                <span>{String(PLATES.length).padStart(2, '0')}</span>
              </div>
              <p className="ma-cap ma-muted ma-hide-ph">{still ? 'Tap a plate to enlarge' : 'Keep scrolling · tap a plate to enlarge'}</p>
            </div>
          </div>
          <ul className="ma-look-track" ref={trackRef}>
            {PLATES.map((p, i) => (
              <li key={p.file} className={`ma-look-plate${p.mono ? ' is-mono' : ''}`} style={{ '--w': p.w }}>
                <button type="button" onClick={() => lightbox.open(i)} aria-label={`Open plate ${toRoman(p.n)}, ${p.label}`}>
                  <img src={p.src} alt="" loading="lazy" decoding="async" />
                </button>
                <p className="ma-cap ma-muted">Plate {toRoman(p.n)}</p>
              </li>
            ))}
          </ul>
          <p className="ma-cap ma-muted ma-look-hint">Swipe · tap a plate to enlarge</p>
        </div>
        {lightbox.node}
      </section>

      {/* VIII. Gifts */}
      <section className="ma-sec ma-stone ma-gifts" id="gifts">
        <div className="ma-grid">
          <Rh n={7} label="Gifts" />
          <div className="ma-gifts-left">
            <Title lines={['With gratitude']} />
            <p className="ma-body rv d1">{gifts.note}</p>
            {D.giftDetails && <p className="ma-cap ma-muted ma-gifts-day rv d2">{D.giftDetails}</p>}
          </div>
          <div className="ma-cards">
            {gifts.accounts.map((a, i) => (
              <article key={`${a.label}${a.number}`} className={`ma-card rv d${i + 1}`} data-foil="">
                <p className="ma-cap ma-card-label">{a.label}</p>
                <Monogram a={I1} b={I2} foil gap="#5E1D2A" className="ma-card-mark" />
                {a.name && <p className="ma-card-name">{a.name}</p>}
                <p className="ma-card-number ma-foil">{a.number}</p>
                <CopyButton value={a.number} />
              </article>
            ))}
            {gifts.qr && (
              <article className="ma-card ma-card--qr rv">
                <img src={gifts.qr} alt="Payment QR code" loading="lazy" decoding="async" />
                <p className="ma-cap ma-card-label">Scan to send a gift</p>
              </article>
            )}
          </div>
        </div>
      </section>

      {/* IX. Questions */}
      <section className="ma-sec ma-faqsec" id="questions">
        <div className="ma-grid">
          <Rh n={8} label="Questions" />
          <div className="ma-faq-left">
            <Title lines={['Questions,', 'answered.']} />
            <p className="ma-small rv d1">Anything else? Message either of us directly; we would love to hear from you.</p>
          </div>
          <Faq items={faqFor(D)} className="ma-faq" />
        </div>
      </section>

      {/* X. R.S.V.P. */}
      <section className="ma-sec ma-lacquer ma-rsvpsec" id="rsvp">
        <div className="ma-grid">
          <Rh n={9} label="R.S.V.P." />
          <div className="ma-rsvp-left">
            <h2 className="ma-statement ma-rsvp-title rv">Kindly reply</h2>
            <p className="ma-rsvp-by rv d1">by {formalReplyBy(D.replyBy)}</p>
            <p className="ma-rsvp-note rv d2">
              We have reserved {seatsCount(guest).toLowerCase()} in your honour{guest?.name ? `, ${guest.name}` : ''}. One reply answers for everyone in your party.
            </p>
          </div>
          <p className="ma-cap ma-rsvp-close rv d3">Replies close {D.replyBy}</p>
          <div className="ma-reply rv d1">
            <Rsvp couple={D} deadline={D.replyBy} className="ma-rsvp" />
            <Seal a={I1} b={I2} top={`${D.a.toUpperCase()} · ${D.b.toUpperCase()}`} bottom={`EST. ${toRoman(year)}`} ink="#FAF7F3" gap="#FAF7F3" className="ma-reply-emboss" />
            <div className="ma-reply-stamp" data-foil="">
              <Seal a={I1} b={I2} top={`${D.a.toUpperCase()} · ${D.b.toUpperCase()}`} bottom={`EST. ${toRoman(year)}`} foil gap="var(--ma-paper)" ink="#561925" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="ma-deep ma-foot" style={{ '--ma-foot': `${footSize}px`, '--ma-foot-ph': `${footSizePhone}px` }}>
        <div className="ma-grid">
          <div className="ma-foot-seal" data-foil="">
            <Seal a={I1} b={I2} top={`${D.a.toUpperCase()} · ${D.b.toUpperCase()}`} bottom={`EST. ${toRoman(year)}`} foil gap="#3E101A" />
          </div>
          <div className="ma-foot-text">
            <p className="ma-foot-names">
              {D.a} <em>&amp;</em> {D.b}
            </p>
            <p className="ma-foot-quote">{D.quote}</p>
            <p className="ma-cap ma-foot-date">
              {dotted(D.start)} — {D.place}
            </p>
            {D.hashtag && <p className="ma-foot-tag">{D.hashtag}</p>}
            <div className="ma-foot-social" aria-hidden="true">
              <span>
                <Icon name="instagram" size={18} stroke={1.2} />
              </span>
              <span>
                <Icon name="facebook" size={18} stroke={1.2} />
              </span>
              <span>
                <Icon name="mail" size={18} stroke={1.2} />
              </span>
            </div>
          </div>
          <div className="ma-foot-bottom">
            <p>{D.closing}</p>
            <button type="button" className="ma-cap" onClick={() => scrollToId('top')}>
              Back to top ↑
            </button>
          </div>
        </div>
      </footer>
    </TemplateRoot>
  );
}
