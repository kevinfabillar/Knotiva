import { useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { Countdown, Entourage, Rsvp, TemplateRoot, initials, mapsUrl, scrollToId, seatLine, useDetails, useEntourage, useInvite, useLightbox, usePhoto } from '../kit/index.js';
import Loader from './Loader.jsx';
import { AttireArt, Chevron, DressIcon, JeansIcon, MapArt, PlaneIcon, Sprig, YoutubeIcon } from './motifs.jsx';
import './next-chapter.css';

const P = '/templates/next-chapter/';

const DEFAULTS = {
  a: 'Gabriela',
  aLast: 'Lim',
  b: 'Adrian',
  bLast: 'Tan',
  start: '2026-12-12T15:00:00+08:00',
  end: '2026-12-12T22:00:00+08:00',
  date: '12 December 2026',
  place: 'Manila',
  ceremony: 'Manila Cathedral',
  ceremonyAddress: 'Cabildo St. cor. Beaterio St., Intramuros, Manila',
  venue: 'The Fifth at Rockwell',
  venueAddress: '5/F Power Plant Mall, Rockwell Center, Makati City',
  receptionTime: 'Immediately following the ceremony',
  replyBy: '1 November 2026',
  storyIntro: 'It started with simple conversations, turned into endless adventures, and now, a lifetime of choosing you.',
  story1Year: '2020',
  story1Title: 'Met in Manila',
  story1Text: 'A chance encounter that changed everything.',
  story2Year: '2022',
  story2Title: 'Found our rhythm',
  story2Text: 'Through busy days and greater dreams.',
  story3Year: '2026',
  story3Title: 'Forever starts here',
  story3Text: 'Same hearts, a bigger tomorrow.',
  dressTitle: 'Cocktail formal',
  dressNote: 'Dress up a little: tailored suits and cocktail or floor-length dresses in soft, earthy tones inspired by the old city.',
  closing: 'Thank you for being part of our story. We can’t wait to celebrate with you in Manila!',
  hashtag: '#GabrielaAndAdrian',
};

const NAV = [
  { id: 'story', label: 'Our Story' },
  { id: 'wedding', label: 'Our Wedding' },
  { id: 'details', label: 'Wedding Details' },
  { id: 'entourage', label: 'Entourage' },
  { id: 'attire', label: 'Dress Code' },
  { id: 'map', label: 'Map & Directions' },
  { id: 'gallery', label: 'Gallery' },
];

const ENTOURAGE = [
  {
    title: 'Principal Sponsors',
    wide: true,
    pairs: [
      ['Mr. Ramon Lim', 'Mrs. Teresa Lim'],
      ['Mr. Vicente Tan', 'Mrs. Lourdes Tan'],
      ['Dr. Antonio Reyes', 'Dr. Carmela Reyes'],
      ['Mr. Eduardo Cruz', 'Mrs. Isabel Cruz'],
    ],
  },
  { title: 'Best Man', names: ['Marco Tan'] },
  { title: 'Maid of Honor', names: ['Bianca Lim'] },
  { title: 'Bridesmaids', names: ['Nina Aquino', 'Trisha Mendoza', 'Celine Go'] },
  { title: 'Groomsmen', names: ['Paolo Reyes', 'Luis Navarro', 'Enzo Sy'] },
];

const PALETTE = [
  { name: 'Olive', hex: '#6B6B4E' },
  { name: 'Sage', hex: '#8A8F6A' },
  { name: 'Khaki', hex: '#B9AE8C' },
  { name: 'Beige', hex: '#D9CBB4' },
  { name: 'Blush', hex: '#E8C7BF' },
  { name: 'Cream', hex: '#EEE7DC' },
];

const DRESS = {
  note: DEFAULTS.dressNote,
  shape: 'circle',
  attire: [
    { who: 'Ladies', icon: 'gown', text: 'Cocktail or floor-length dresses in olive, sage, khaki, beige or blush.' },
    { who: 'Gentlemen', icon: 'suit', text: 'A suit in olive, khaki or stone. A tie is welcome but not required.' },
  ],
};

const SCHEDULE = [
  { time: '3:00 PM', label: 'Ceremony', note: 'Manila Cathedral', icon: 'rings' },
  { time: '5:00 PM', label: 'Cocktails', note: 'The Fifth at Rockwell', icon: 'cheers' },
  { time: '6:30 PM', label: 'Dinner & dancing', icon: 'dinner' },
];

const day = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
const longDate = (iso) => day(iso).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
function timeOf(iso) {
  const m = /T(\d{2}):(\d{2})/.exec(iso || '');
  if (!m) return '';
  const h = Number(m[1]);
  return `${((h + 11) % 12) + 1}:${m[2]} ${h < 12 ? 'AM' : 'PM'}`;
}
const directions = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

function Head({ title, eyebrow, sprig = false, center = false, children }) {
  return (
    <header className={`nc-head${center ? ' is-center' : ''}`}>
      <div className="nc-head-text">
        <h2 className="nc-title rv">{title}</h2>
        {eyebrow && <p className="nc-eyebrow rv d1">{eyebrow}</p>}
        {children}
      </div>
      {sprig && <Sprig className="nc-head-sprig rv d2" />}
    </header>
  );
}

export const meta = { defaults: DEFAULTS, className: 't-next-chapter', cover: `${P}hero.svg`, schedule: SCHEDULE, palette: PALETTE, dress: DRESS };

export default function NextChapter() {
  const D = useDetails(DEFAULTS);
  const photo = usePhoto();
  const entourage = useEntourage(ENTOURAGE);
  const { mode, gate, guest } = useInvite();
  const [ready, setReady] = useState(() => mode === 'thumb' || gate === false);
  const [tab, setTab] = useState(0);
  const [I1, I2] = initials(D);

  const names = `${D.a} & ${D.b}`;
  const when = longDate(D.start);
  const STORY = [1, 2, 3].map((n) => ({ year: D[`story${n}Year`], title: D[`story${n}Title`], text: D[`story${n}Text`], img: `story-${DEFAULTS[`story${n}Year`]}.svg` }));
  const hero = photo(`${P}hero.svg`);
  const foliage = photo(`${P}loader.svg`);

  const VENUES = [
    {
      kind: 'Ceremony',
      name: D.ceremony,
      address: D.ceremonyAddress,
      when: `${when} · ${timeOf(D.start)}`,
      img: photo(`${P}ceremony.svg`),
      alt: `${D.ceremony} at dusk`,
    },
    {
      kind: 'Reception',
      name: D.venue,
      address: D.venueAddress,
      when: D.receptionTime,
      img: photo(`${P}reception.svg`),
      alt: `The reception hall at ${D.venue}`,
    },
  ].map((v) => ({ ...v, query: `${v.name}, ${v.address}` }));

  const GALLERY = [
    { src: photo(`${P}gallery-1.svg`), alt: `${D.a} and ${D.b} at sunset on the city walls` },
    { src: photo(`${P}gallery-2.svg`), alt: 'Under the arches, in black and white' },
    { src: photo(`${P}gallery-3.svg`), alt: 'Laughing in the street' },
    { src: photo(`${P}gallery-4.svg`), alt: 'Holding hands' },
    { src: photo(`${P}gallery-5.svg`), alt: 'A quiet moment, in black and white' },
  ];
  const lightbox = useLightbox(GALLERY);

  return (
    <TemplateRoot
      className="t-next-chapter"
      nav={NAV}
      monogram={names}
      music="reverie"
      style={{ '--img-hero': `url("${hero}")`, '--img-foliage': `url("${foliage}")`, '--img-wedding': `url("${photo(`${P}wedding.svg`)}")` }}
    >
      <Loader names={names} letters={[I1, I2]} image={hero} background={foliage} onReveal={() => setReady(true)} />

      {/* 2. Hero */}
      <section className={`nc-hero${ready ? ' is-ready' : ''}`} aria-label={`${names}, ${D.date}`}>
        <div className="nc-hero-photo" role="img" aria-label={`${D.a} and ${D.b} at golden hour`} />
        <header className="nc-topnav k-topnav">
          <a href="#top" className="nc-topnav-names">
            {D.a} &amp; {D.b}
          </a>
          <nav aria-label="Sections">
            {NAV.map(({ id, label }) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
            <a href="#rsvp" className="nc-topnav-rsvp">
              RSVP
            </a>
          </nav>
        </header>
        <div className="nc-hero-in">
          <p className="nc-eyebrow nc-hero-eyebrow">Together with their families</p>
          <h1 className="nc-hero-names">
            <span>
              {D.a} {D.aLast}
            </span>
            <span>
              <em>&amp;</em> {D.b} {D.bLast}
            </span>
          </h1>
          <p className="nc-eyebrow nc-hero-line">Invite you to celebrate the beginning of our forever</p>
          <button type="button" className="nc-circle nc-hero-down" onClick={() => scrollToId('story')} aria-label="Scroll to our story">
            <Chevron />
          </button>
        </div>
      </section>

      {/* 3. Our Story */}
      <section className="nc-sec nc-story" id="story">
        <div className="nc-wrap">
          <Head title="Our Story" eyebrow="Same places. Brighter together." />
          <p className="nc-intro rv d2">{D.storyIntro}</p>
          <ol className="nc-tl">
            {STORY.map((s, i) => (
              <li key={s.img} className={`nc-tl-item rv d${i + 1}`}>
                <span className="nc-tl-dot" aria-hidden="true" />
                <figure className="nc-tl-photo">
                  <img src={photo(`${P}${s.img}`)} alt={`${s.title}, ${s.year}`} loading="lazy" />
                </figure>
                <div className="nc-tl-text">
                  <p className="nc-tl-year">{s.year}</p>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Our Wedding: countdown */}
      <section className="nc-dark nc-wedding" id="wedding">
        <div className="nc-wedding-photo" role="img" aria-label={`${D.a} and ${D.b} above the city`} />
        <div className="nc-wedding-in">
          <p className="nc-eyebrow rv">The next chapter</p>
          <h2 className="nc-title rv d1">Our Wedding</h2>
          <Countdown date={D.start} className="nc-count rv d2" />
          <i className="nc-dash rv d3" aria-hidden="true" />
          <p className="nc-quote rv d3">&ldquo;Same city. New beginning. We can&rsquo;t wait to celebrate with you.&rdquo;</p>
        </div>
      </section>

      {/* 5. Wedding Details */}
      <section className="nc-sec nc-details" id="details">
        <div className="nc-wrap">
          <Head title="Wedding Details" eyebrow="A day of faith, love and a beautiful celebration." />
          <div className="nc-cards">
            {VENUES.map((v, i) => (
              <article key={v.kind} className={`nc-card rv d${i + 1}`}>
                <img src={v.img} alt={v.alt} loading="lazy" />
                <div className="nc-card-body">
                  <p className="nc-label">{v.kind}</p>
                  <h3>{v.name}</h3>
                  <p className="nc-card-when">{v.when}</p>
                  <p className="nc-card-addr">
                    <Icon name="pin" size={15} stroke={1.3} />
                    <span>{v.address}</span>
                  </p>
                  <a className="nc-pill" href={mapsUrl(v.query)} target="_blank" rel="noreferrer">
                    View map
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Entourage */}
      <section className="nc-sec nc-ent" id="entourage">
        <div className="nc-wrap">
          <Head title="Entourage" eyebrow="The people who made us who we are today." sprig />
          <figure className="nc-ent-photo rv">
            <img src={photo(`${P}entourage.svg`)} alt="Our families and friends" loading="lazy" />
          </figure>
          <Entourage groups={entourage} className="nc-ent-list" />
        </div>
      </section>

      {/* 7. Dress Code */}
      <section className="nc-sec nc-attire" id="attire">
        <div className="nc-wrap">
          <Head title="Dress Code" eyebrow={D.dressTitle} />
          <div className="nc-attire-grid">
            <AttireArt className="rv d1" />
            <div className="nc-attire-text">
              <p className="nc-body rv">{D.dressNote}</p>
              <ul className="nc-swatches rv d1" aria-label="Colour palette">
                {PALETTE.map((c) => (
                  <li key={c.name} style={{ background: c.hex }} title={c.name}>
                    <span className="nc-sr">{c.name}</span>
                  </li>
                ))}
              </ul>
              <p className="nc-palette-note rv d2">A palette of modern elegance.</p>
              <ul className="nc-rules rv d3">
                <li>
                  <span className="nc-circle">
                    <DressIcon />
                  </span>
                  {D.dressTitle}
                </li>
                <li>
                  <span className="nc-circle">
                    <JeansIcon />
                  </span>
                  No jeans, please
                </li>
                <li>
                  <span className="nc-circle">
                    <DressIcon crossed />
                  </span>
                  Kindly avoid white
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Map & Directions */}
      <section className="nc-sec nc-map" id="map">
        <div className="nc-wrap">
          <Head title="Map & Directions" eyebrow="Find your way to our special day." />
          <div className="nc-tabs rv d1" role="tablist" aria-label="Venue">
            {VENUES.map((v, i) => (
              <button key={v.kind} type="button" role="tab" id={`nc-tab-${i}`} aria-selected={tab === i} aria-controls={`nc-panel-${i}`} className={tab === i ? 'is-on' : ''} onClick={() => setTab(i)}>
                {v.kind}
              </button>
            ))}
          </div>
          <div className="nc-maps">
            {VENUES.map((v, i) => (
              <div key={v.kind} id={`nc-panel-${i}`} role="tabpanel" aria-labelledby={`nc-tab-${i}`} className={`nc-map-card rv d${i + 1}${tab === i ? ' is-on' : ''}`}>
                <a className="nc-map-box" href={mapsUrl(v.query)} target="_blank" rel="noreferrer" aria-label={`Open ${v.name} in Google Maps`}>
                  <MapArt seed={i} />
                  <span className="nc-map-kind">{v.kind}</span>
                </a>
                <div className="nc-map-row">
                  <img src={v.img} alt="" loading="lazy" />
                  <div>
                    <h3>{v.name}</h3>
                    <p>{v.address}</p>
                  </div>
                </div>
                <a className="nc-btn" href={directions(v.query)} target="_blank" rel="noreferrer">
                  Get directions
                  <PlaneIcon />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. RSVP */}
      <section className="nc-sec nc-rsvp-sec" id="rsvp">
        <div className="nc-wrap nc-wrap--narrow">
          <Head title="RSVP" eyebrow="Your presence means the world to us.">
            <p className="nc-body nc-rsvp-note rv d2">
              We have reserved {seatLine(guest)} for you{guest?.name ? `, ${guest.name}` : ''}. Kindly reply by {D.replyBy}.
            </p>
          </Head>
          <div className="rv d2">
            <Rsvp couple={D} deadline={D.replyBy} className="nc-rsvp" />
          </div>
        </div>
      </section>

      {/* 10. Gallery */}
      <section className="nc-sec nc-gallery" id="gallery">
        <div className="nc-wrap">
          <Head title="Gallery" eyebrow="A few of our favorite moments so far." />
          <div className="nc-mosaic">
            {GALLERY.map((g, i) => (
              <button key={g.src} type="button" className={`nc-ph nc-ph--${i} rv d${(i % 4) + 1}`} onClick={() => lightbox.open(i)} aria-label={`Open photo ${i + 1}: ${g.alt}`}>
                <img src={g.src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
          <p className="nc-script nc-more rv">More chapters to come&hellip;</p>
          {lightbox.node}
        </div>
      </section>

      {/* 11. See You There */}
      <section className="nc-sec nc-see">
        <div className="nc-wrap nc-see-in">
          <h2 className="nc-title rv">See You There</h2>
          <p className="nc-body rv d1">
            {D.closing}
          </p>
          <Sprig className="nc-see-sprig rv d2" />
          <p className="nc-script nc-sign rv d2">{names}</p>
          <p className="nc-eyebrow rv d3">{when}</p>
        </div>
        <div className="nc-see-photo" role="img" aria-label={`${D.a} and ${D.b} watching the sunset`} style={{ '--img': `url("${photo(`${P}seeyou.svg`)}")` }} />
      </section>

      {/* 12. Footer */}
      <footer className="nc-dark nc-foot">
        <p className="nc-foot-names">
          {D.a} &amp; {D.b}
        </p>
        <p className="nc-foot-date">{D.date}</p>
        <i className="nc-dash" aria-hidden="true" />
        <p className="nc-quote">&ldquo;Different paths, same home.&rdquo;</p>
        <Sprig className="nc-foot-sprig" />
        <div className="nc-social" aria-label="Follow along">
          <span title="Instagram">
            <Icon name="instagram" size={18} stroke={1.3} />
          </span>
          <span title="Facebook">
            <Icon name="facebook" size={18} stroke={1.3} />
          </span>
          <span title="YouTube">
            <YoutubeIcon />
          </span>
        </div>
        <p className="nc-hashtag">{D.hashtag}</p>
        <button type="button" className="nc-circle nc-top" onClick={() => scrollToId('top')} aria-label="Back to top">
          <Chevron up />
        </button>
      </footer>
    </TemplateRoot>
  );
}
