import {
  CalendarButton,
  Countdown,
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
import './herbarium.css';

// Herbarium — a garden wedding mounted like a botanist's specimen sheets: white sheets on a sage
// field, pressed botanicals drawn in SVG, typewritten specimen labels and a persimmon collector's stamp.

const P = '/templates/herbarium/';

const DEFAULTS = {
  a: 'Elena',
  b: 'Tomas',
  start: '2027-04-17T15:00:00+08:00',
  end: '2027-04-17T22:00:00+08:00',
  date: '17 April 2027',
  place: 'Silang, Cavite',
  venue: 'The Old Glasshouse',
  venueAddress: 'Silang–Tagaytay Road, Silang, Cavite',
  ceremony: 'Chapel of San Isidro',
  ceremonyAddress: 'Barangay Lucsuhin, Silang, Cavite',
  replyBy: '1 March 2027',
  tagline: 'request the pleasure of your company as they marry in the garden',
  welcome:
    'Some things are worth keeping exactly as they are. We would love you beside us for an afternoon among the trees, a long table under glass, and a dance once the lanterns are lit.',
  story1Year: '2019',
  story1Title: 'First found',
  story1Text: 'A plant sale in the rain. Two people reaching for the same small fern, and neither willing to let the other go home without it.',
  story2Year: '2023',
  story2Title: 'Taking root',
  story2Text: 'A shared balcony crowded with pots, Sunday markets, and the slow, happy discovery that home was wherever the other one was.',
  story3Year: '2026',
  story3Title: 'In full bloom',
  story3Text: 'Under the old acacia where we had our first picnic, one question, one very quick yes, and a ring hidden inside a seed packet.',
  dressNote: 'Garden formal. Think soft, natural tones from our pressed-flower palette; low or block heels are kind to the lawn.',
  closing: 'Thank you for growing alongside us. We cannot wait to see you in the garden.',
};

const NAV = [
  { id: 'invitation', label: 'Invitation' },
  { id: 'the-day', label: 'The Day' },
  { id: 'field-notes', label: 'Field Notes' },
  { id: 'plates', label: 'Plates' },
  { id: 'attire', label: 'Attire' },
  { id: 'company', label: 'Company' },
  { id: 'gifts', label: 'Gifts' },
  { id: 'notes', label: 'Notes' },
];

const SCHEDULE = [
  { time: '2:30 PM', label: 'Guests arrive', note: 'Lemonade under the acacia' },
  { time: '3:00 PM', label: 'The ceremony', note: 'Chapel of San Isidro' },
  { time: '4:00 PM', label: 'Garden hour', note: 'Photographs and canapés' },
  { time: '5:30 PM', label: 'Supper under glass', note: 'The Old Glasshouse' },
  { time: '7:30 PM', label: 'Toasts and first dance' },
  { time: '8:30 PM', label: 'Lanterns and dancing' },
  { time: '10:00 PM', label: 'Send-off', note: 'With dried-petal confetti' },
];

const PALETTE = [
  { name: 'Sage', hex: '#9db3a0' },
  { name: 'Eucalyptus', hex: '#7f9a92' },
  { name: 'Cornflower', hex: '#8a9fc0' },
  { name: 'Apricot', hex: '#e2a37f' },
  { name: 'Buttercup', hex: '#e3c56e' },
];

const ATTIRE = [
  { who: 'For her', text: 'A midi or long dress in a light, flowing fabric. Florals, linen and soft pastels are all welcome.' },
  { who: 'For him', text: 'A light suit or a barong with neat trousers. Ties optional; loafers or suede shoes for the grass.' },
];

const DRESS = {
  note: DEFAULTS.dressNote,
  shape: 'petal',
  attire: [
    { who: 'For her', icon: 'gown', text: ATTIRE[0].text },
    { who: 'For him', icon: 'suit', text: ATTIRE[1].text },
  ],
};

const FAQ = [
  { q: 'Is the whole day outdoors?', a: 'The ceremony is in the chapel and supper is inside the glasshouse; the garden hour in between is outdoors. Bring a light wrap for the evening.' },
  { q: 'What should I wear on my feet?', a: 'Much of the afternoon is on lawn and gravel paths, so block heels, wedges or flats will be far more comfortable than stilettos.' },
  { q: 'Can I bring a guest or children?', a: 'We have reserved the seats shown on your invitation. Our garden is small, so we kindly ask that only those named attend.' },
  { q: 'Is there parking?', a: 'Yes. Both the chapel and the glasshouse have parking, and the drive between them is under ten minutes.' },
  { q: 'Can I take photos?', a: 'Please keep the ceremony unplugged. From the garden hour onwards, snap away and share them with us.' },
  { q: 'Any dietary needs?', a: 'Tell us in your RSVP and our kitchen will look after you.' },
];

const PLATES = [
  { src: `${P}plate-1.svg`, caption: 'The acacia, late afternoon' },
  { src: `${P}plate-2.svg`, caption: 'Market day' },
  { src: `${P}plate-3.svg`, caption: 'Morning fog, Tagaytay' },
  { src: `${P}plate-4.svg`, caption: 'The long walk home' },
  { src: `${P}plate-5.svg`, caption: 'Buttercups' },
];

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
const romanDate = (iso) => {
  const [y, m, d] = iso.slice(0, 10).split('-');
  return `${Number(d)} · ${ROMAN[Number(m) - 1]} · ${y}`;
};

/* ---------- Pressed botanicals, drawn from a curved stem ---------- */

const bez = (a, b, c, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * b[0] + t * t * c[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * b[1] + t * t * c[1]];
const tan = (a, b, c, t) => {
  const dx = 2 * (1 - t) * (b[0] - a[0]) + 2 * t * (c[0] - b[0]);
  const dy = 2 * (1 - t) * (b[1] - a[1]) + 2 * t * (c[1] - b[1]);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};
const leafPath = (L, W) => `M0 0 C ${L * 0.28} ${-W} ${L * 0.72} ${-W} ${L} 0 C ${L * 0.72} ${W} ${L * 0.28} ${W} 0 0 Z`;
const range = (from, to, step) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);

function Stem({ s }) {
  return <path className="hb-stem" d={`M${s[0].join(' ')} Q ${s[1].join(' ')} ${s[2].join(' ')}`} />;
}

function Leaf({ at, angle, L, W, cls = 'hb-leaf' }) {
  return (
    <g transform={`translate(${at[0].toFixed(1)} ${at[1].toFixed(1)}) rotate(${angle.toFixed(1)})`}>
      <path className={cls} d={leafPath(L, W)} />
      <path className="hb-vein" d={`M0 0 L${L * 0.86} 0`} />
    </g>
  );
}

function Eucalyptus() {
  const s = [[100, 410], [62, 230], [118, 18]];
  return (
    <>
      <Stem s={s} />
      {range(0.1, 0.96, 0.085).map((t, i) => {
        const p = bez(...s, t);
        const r = 24 - t * 13;
        const side = i % 2 ? 1 : -1;
        const a = tan(...s, t) + side * 90;
        const off = [p[0] + Math.cos((a * Math.PI) / 180) * r * 0.8, p[1] + Math.sin((a * Math.PI) / 180) * r * 0.8];
        return <ellipse key={t} className="hb-leaf hb-leaf--euc" cx={off[0]} cy={off[1]} rx={r} ry={r * 0.86} />;
      })}
    </>
  );
}

function Fern() {
  const s = [[96, 410], [116, 210], [86, 14]];
  return (
    <>
      <Stem s={s} />
      {range(0.16, 0.97, 0.052).map((t) => {
        const p = bez(...s, t);
        const base = tan(...s, t);
        const L = 74 * Math.sin(Math.PI * Math.min(1, (1 - t) * 1.05)) + 8;
        return (
          <g key={t}>
            <Leaf at={p} angle={base - 62} L={L} W={L * 0.16} cls="hb-leaf hb-leaf--fern" />
            <Leaf at={p} angle={base + 62} L={L} W={L * 0.16} cls="hb-leaf hb-leaf--fern" />
          </g>
        );
      })}
    </>
  );
}

function Cosmos() {
  const s = [[104, 410], [86, 260], [110, 112]];
  const head = s[2];
  const bud = [[94, 300], [52, 230], [46, 170]];
  return (
    <>
      <Stem s={s} />
      <Stem s={bud} />
      <Leaf at={bez(...s, 0.35)} angle={-150} L={70} W={7} cls="hb-leaf hb-leaf--olive" />
      <Leaf at={bez(...s, 0.55)} angle={-20} L={62} W={6} cls="hb-leaf hb-leaf--olive" />
      <ellipse className="hb-bud" cx={46} cy={162} rx={9} ry={13} />
      {range(0, 315, 45).map((a) => (
        <g key={a} transform={`translate(${head[0]} ${head[1]}) rotate(${a - 90})`}>
          <path className="hb-petal" d="M6 0 C 14 -15 46 -17 56 -6 C 58 -2 58 2 56 6 C 46 17 14 15 6 0 Z" />
        </g>
      ))}
      <circle className="hb-heart" cx={head[0]} cy={head[1]} r={11} />
    </>
  );
}

function Olive() {
  const s = [[90, 410], [128, 220], [70, 20]];
  return (
    <>
      <Stem s={s} />
      {range(0.08, 0.95, 0.07).map((t, i) => {
        const p = bez(...s, t);
        const side = i % 2 ? 1 : -1;
        const L = 64 - t * 26;
        return <Leaf key={t} at={p} angle={tan(...s, t) + side * 34} L={L} W={L * 0.17} cls="hb-leaf hb-leaf--olive" />;
      })}
      {[0.3, 0.52, 0.71].map((t, i) => {
        const p = bez(...s, t);
        return <ellipse key={t} className="hb-berry" cx={p[0] + (i % 2 ? 16 : -16)} cy={p[1] + 10} rx={6} ry={8} />;
      })}
    </>
  );
}

const KINDS = { eucalyptus: Eucalyptus, fern: Fern, cosmos: Cosmos, olive: Olive };

function Specimen({ kind, className = '' }) {
  const Draw = KINDS[kind];
  return (
    <svg className={`hb-specimen ${className}`} viewBox="0 0 200 420" aria-hidden="true">
      <Draw />
      <path className="hb-strap" d="M74 352 L130 344 L132 360 L76 368 Z" />
    </svg>
  );
}

/** A pressed-leaf colour swatch. */
function Swatch({ hex, i }) {
  return (
    <svg className="hb-swatch" viewBox="0 0 120 60" aria-hidden="true" style={{ rotate: `${(i % 2 ? 1 : -1) * (6 + i * 3)}deg` }}>
      <path transform="translate(8 30)" d={leafPath(104, 24)} fill={hex} />
      <path d="M8 30 L104 30" stroke="rgba(30,50,40,0.28)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function SectionHead({ n, title, sub, dark = false }) {
  return (
    <header className={`hb-head rv${dark ? ' is-dark' : ''}`}>
      <p className="hb-mono hb-head-n">
        Sheet {n}
        <span aria-hidden="true" />
      </p>
      <h2 className="hb-h2">{title}</h2>
      {sub && <p className="hb-head-sub">{sub}</p>}
    </header>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-hb', cover: `${P}hero.svg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function Herbarium() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const schedule = useSchedule(SCHEDULE);
  const entourage = useEntourage(demo.entourage(D));
  const gifts = useGifts(demo.gifts(D));
  const { guest } = useInvite();
  const [I1, I2] = initials(D);

  const hero = photo(`${P}hero.svg`);
  const plates = PLATES.map((p, i) => ({ src: photo(p.src), alt: `${D.a} and ${D.b}: ${p.caption}`, caption: p.caption, n: ROMAN[i] }));
  const lightbox = useLightbox(plates);
  const roman = romanDate(D.start);

  const story = [1, 2, 3].map((n) => ({ year: D[`story${n}Year`], title: D[`story${n}Title`], text: D[`story${n}Text`] }));
  const venues = [
    { kind: 'Ceremony', name: D.ceremony, address: D.ceremonyAddress, icon: 'rings' },
    { kind: 'Supper & dancing', name: D.venue, address: D.venueAddress, icon: 'cheers' },
  ];
  const event = { title: `${D.a} & ${D.b}’s wedding`, start: D.start, end: D.end, location: `${D.ceremony}, ${D.ceremonyAddress}` };

  return (
    <TemplateRoot
      className="t-hb"
      nav={NAV}
      rsvp="rsvp"
      monogram={`${I1} · ${I2}`}
      music="reverie"
      gate={{
        variant: 'ribbon',
        names: `${D.a} & ${D.b}`,
        monogram: `${I1}·${I2}`,
        eyebrow: 'A pressed invitation for you',
        date: D.date,
        button: 'Untie the ribbon',
        hint: 'Tap the bow',
      }}
    >
      {/* ---------- Hero: one mounted specimen sheet ---------- */}
      <section className="hb-hero">
        <header className="hb-top k-topnav">
          <a className="hb-top-mark" href="#top">
            <span className="hb-mono">Herbarium of</span> {D.a} &amp; {D.b}
          </a>
          <nav aria-label="Sections">
            {NAV.slice(0, 5).map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
            <button type="button" className="hb-top-rsvp" onClick={() => scrollToId('rsvp')}>
              Reply
            </button>
          </nav>
        </header>

        <div className="hb-sheet hb-hero-sheet">
          <span className="hb-sheet-no hb-mono">No. 0417</span>
          <div className="hb-hero-text">
            <p className="hb-mono hb-hero-kicker rv">Collected at {D.place}</p>
            <h1 className="hb-names rv d1">
              <span>{D.a}</span>
              <em>&amp;</em>
              <span>{D.b}</span>
            </h1>
            <p className="hb-hero-tag rv d2">{D.tagline}</p>
            <dl className="hb-label rv d3">
              <div>
                <dt>Date</dt>
                <dd>{D.date}</dd>
              </div>
              <div>
                <dt>Locality</dt>
                <dd>
                  {D.venue}, {D.place}
                </dd>
              </div>
              <div>
                <dt>Reply by</dt>
                <dd>{D.replyBy}</dd>
              </div>
            </dl>
          </div>
          <figure className="hb-mount rv d1">
            <img src={hero} alt={`${D.a} and ${D.b}`} fetchpriority="high" />
            <i className="hb-corner hb-corner--tl" />
            <i className="hb-corner hb-corner--tr" />
            <i className="hb-corner hb-corner--bl" />
            <i className="hb-corner hb-corner--br" />
          </figure>
          <Specimen kind="eucalyptus" className="hb-hero-sprig" />
          <Specimen kind="cosmos" className="hb-hero-bloom" />
          <div className="hb-stamp" aria-hidden="true">
            <span>
              {I1}·{I2}
            </span>
            <small>{roman}</small>
          </div>
        </div>
      </section>

      {/* ---------- Invitation + countdown ---------- */}
      <section className="hb-invite" id="invitation">
        <div className="hb-invite-in">
          <Specimen kind="fern" className="hb-invite-fern" />
          <div>
            <SectionHead n="I" title="The invitation" />
            <p className="hb-lede rv d1">{D.welcome}</p>
            <Countdown date={D.start} className="hb-count rv d2" labels={['days', 'hours', 'minutes', 'seconds']} />
            <div className="hb-invite-cta rv d3">
              <CalendarButton event={event} className="hb-btn" label="Keep the date" icon={false} />
              <button type="button" className="hb-btn hb-btn--line" onClick={() => scrollToId('rsvp')}>
                Reply to the invitation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- The day: venues and order of the day on one wide sheet ---------- */}
      <section className="hb-day" id="the-day">
        <div className="hb-sheet hb-day-sheet">
          <SectionHead n="II" title="The day" sub={D.date} />
          <div className="hb-day-grid">
            <Venues items={venues} className="hb-venues" />
            <ol className="hb-sched">
              {schedule.map((s, i) => (
                <li key={`${s.time}${i}`} className={`rv d${(i % 4) + 1}`}>
                  <span className="hb-mono hb-sched-time">{s.time}</span>
                  <span className="hb-sched-node" aria-hidden="true" />
                  <span className="hb-sched-what">
                    {s.label || s.tag}
                    {(s.note || s.sub) && <small>{s.note || s.sub}</small>}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---------- Field notes (story) on dark green ---------- */}
      <section className="hb-notes-sec" id="field-notes">
        <SectionHead n="III" title="Field notes" sub="How it grew" dark />
        <div className="hb-field">
          {story.map((s, i) => (
            <article key={i} className={`hb-field-card rv d${i + 1}`}>
              <Specimen kind={['olive', 'fern', 'cosmos'][i]} className="hb-field-sprig" />
              <p className="hb-field-year">{s.year}</p>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Plates (gallery) ---------- */}
      <section className="hb-plates-sec" id="plates">
        <SectionHead n="IV" title="Plates" sub="A few we pressed and kept" />
        <div className="hb-plates">
          {plates.map((p, i) => (
            <figure key={p.src + i} className={`hb-plate hb-plate--${i + 1} rv d${(i % 4) + 1}`}>
              <button type="button" onClick={() => lightbox.open(i)} aria-label={`Open plate ${p.n}`}>
                <img src={p.src} alt={p.alt} loading="lazy" />
              </button>
              <figcaption>
                <span className="hb-mono">Pl. {p.n}</span> {p.caption}
              </figcaption>
            </figure>
          ))}
        </div>
        {lightbox.node}
      </section>

      {/* ---------- Attire ---------- */}
      <section className="hb-attire-sec" id="attire">
        <div className="hb-sheet hb-attire-sheet">
          <SectionHead n="V" title="What to wear" />
          <p className="hb-lede hb-lede--sm rv d1">{D.dressNote}</p>
          <ul className="hb-swatches rv d2" aria-label="Colour palette">
            {PALETTE.map((c, i) => (
              <li key={c.name}>
                <Swatch hex={c.hex} i={i} />
                <span className="hb-mono">{String(i + 1).padStart(2, '0')}</span>
                <b>{c.name}</b>
              </li>
            ))}
          </ul>
          <div className="hb-attire">
            {ATTIRE.map((a, i) => (
              <div key={a.who} className={`hb-attire-item rv d${i + 2}`}>
                <h3>{a.who}</h3>
                <p>{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Entourage ---------- */}
      <section className="hb-company" id="company">
        <SectionHead n="VI" title="In good company" sub="Family, sponsors and friends standing with us" />
        <Entourage groups={entourage} className="hb-ent" />
      </section>

      {/* ---------- RSVP ---------- */}
      <section className="hb-rsvp" id="rsvp">
        <div className="hb-rsvp-in">
          <Specimen kind="olive" className="hb-rsvp-sprig" />
          <SectionHead n="VII" title="Kindly reply" dark />
          <p className="hb-rsvp-line rv d1">
            {guest?.name ? `${guest.name}, we` : 'We'} have kept {seatLine(guest)} at our table for you. Please let us know by {D.replyBy}.
          </p>
          <div className="rv d2">
            <Rsvp couple={D} deadline={D.replyBy} className="hb-rsvp-card" />
          </div>
        </div>
      </section>

      {/* ---------- Gifts ---------- */}
      <section className="hb-gifts" id="gifts">
        <div className="hb-sheet hb-gifts-sheet">
          <SectionHead n="VIII" title="Gifts" />
          <Gifts note={gifts.note} accounts={gifts.accounts} qr={gifts.qr} className="hb-gifts-kit" />
        </div>
      </section>

      {/* ---------- Notes (FAQ) ---------- */}
      <section className="hb-faq-sec" id="notes">
        <div className="hb-faq-grid">
          <SectionHead n="IX" title="Notes for guests" sub="Small things worth knowing before the day" />
          <Faq items={FAQ} first={0} className="hb-faq" />
        </div>
      </section>

      <footer className="hb-foot">
        <Specimen kind="cosmos" className="hb-foot-bloom" />
        <p className="hb-foot-close">{D.closing}</p>
        <p className="hb-foot-names">
          {D.a} <em>&amp;</em> {D.b}
        </p>
        <p className="hb-mono hb-foot-meta">
          {roman} — {D.place}
        </p>
      </footer>
    </TemplateRoot>
  );
}
