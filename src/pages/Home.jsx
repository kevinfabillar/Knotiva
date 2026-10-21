import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import WalkInScene from '../scenes/WalkInScene.jsx';
import TemplateCard from '../components/TemplateCard.jsx';
import { CATALOG, FILTERS, catalogEntry } from '../templates/catalog.js';

const PAGE = 9;

const ACCENT = '#b96f6f';

const CRAFTS = [
  { n: '01', title: 'Lettering', body: 'Names drawn by hand or set in metal — your call. Three directions, one proof.' },
  { n: '02', title: 'Printing', body: 'Letterpress, riso and digital in-house, so the stock choice never gets vetoed by a supplier.' },
  { n: '03', title: 'Sealing', body: 'Wax poured and stamped per envelope, colour-matched to the suite.' },
  { n: '04', title: 'Finishing', body: 'Ribbon, vellum, addressing, postage weight check, boxed and ready to post.' },
];

const mono = "'IBM Plex Mono', monospace";
const serif = "'Libre Baskerville', Georgia, serif";

const eyebrow = { fontFamily: mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#7b7266' };
const pill = { fontFamily: mono, fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', borderRadius: 999 };
const fieldLabel = { display: 'flex', flexDirection: 'column', gap: 7, fontFamily: mono, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#cdd6e2' };
const field = { padding: '13px 15px', background: 'rgba(251,247,239,0.08)', border: '1px solid rgba(251,247,239,0.28)', borderRadius: 10, color: '#fbf7ef', fontFamily: serif, fontSize: 15, letterSpacing: 0 };
const compactField = { ...field, padding: '12px 15px', fontFamily: mono, fontSize: 13 };
const sectionHeading = { margin: 0, fontSize: 'clamp(26px,2.6vw,34px)', fontWeight: 400 };

export default function Home() {
  const [filter, setFilter] = useState('all');
  const [sent, setSent] = useState(false);
  const [sentName, setSentName] = useState('');
  const mascotRef = useRef(null);
  const location = useLocation();
  const [query] = useSearchParams();
  // A template chosen on a demo page ("Use this design") or a card pre-fills the enquiry.
  const [picked, setPicked] = useState(() => catalogEntry(query.get('template'))?.name || '');
  const [limit, setLimit] = useState(PAGE);

  const matching = filter === 'all' ? CATALOG : CATALOG.filter((t) => t.tags.includes(filter));
  const shown = matching.slice(0, limit);
  const filters = FILTERS.filter((f) => f.key === 'all' || CATALOG.some((t) => t.tags.includes(f.key)));

  // Arriving from another page with #templates or #contact: scroll there once the page has laid out.
  useEffect(() => {
    if (!location.hash) return undefined;
    const t = setTimeout(() => document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 80);
    return () => clearTimeout(t);
  }, [location.hash]);

  const requestDesign = (t) => {
    setPicked(t.name);
    setSent(false);
  };

  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setSentName((data.get('name') || 'friend').toString().trim());
    setSent(true);
  };

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 clamp(16px, 4vw, 56px) 88px' }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '26px 0', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{ fontSize: 24, letterSpacing: '0.02em' }}>Knotiva</span>
          <span style={{ ...eyebrow, letterSpacing: '0.18em' }}>wedding invitations, start to bow</span>
        </div>
        <nav style={{ display: 'flex', gap: 26, fontFamily: mono, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          <a href="#templates">Templates</a>
          <a href="#craft">What I do</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,320px),1fr))', gap: 36, alignItems: 'center', borderTop: '1px solid #ddd3c2', paddingTop: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: ACCENT }}>
            one maker · four hands
          </span>
          <h1 style={{ margin: 0, fontSize: 'clamp(34px,4.4vw,56px)', lineHeight: 1.08, fontWeight: 400, textWrap: 'pretty' }}>
            Your invitation, lettered, printed, sealed and tied — by one stubborn generalist.
          </h1>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.65, color: '#53617a', maxWidth: '46ch', textWrap: 'pretty' }}>
            Pick a template, tell me the names and the date, and it arrives at your door ready to post. No agency hand-offs, no six-week silence.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
            <a href="#templates" className="btn-dark" style={{ ...pill, padding: '14px 26px', background: '#2b3a4f', color: '#fbf7ef' }}>
              Browse templates
            </a>
            <a href="#contact" className="btn-outline-dark" style={{ ...pill, padding: '13px 24px', border: '1.5px solid #2b3a4f' }}>
              Ask a question
            </a>
          </div>
          <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,110px),1fr))', gap: 18, margin: '8px 0 0', paddingTop: 20, borderTop: '1px solid #ddd3c2' }}>
            <div>
              <dt style={eyebrow}>Proof in</dt>
              <dd style={{ margin: '6px 0 0', fontSize: 20 }}>48 hours</dd>
            </div>
            <div>
              <dt style={eyebrow}>Templates</dt>
              <dd style={{ margin: '6px 0 0', fontSize: 20 }}>24 sets</dd>
            </div>
            <div>
              <dt style={eyebrow}>Done since</dt>
              <dd style={{ margin: '6px 0 0', fontSize: 20 }}>2019</dd>
            </div>
          </dl>
        </div>
        <div style={{ position: 'relative', aspectRatio: '4/5', minHeight: 380 }}>
          <WalkInScene
            embed
            onController={(controller) => {
              mascotRef.current = controller;
            }}
          />
          <button
            type="button"
            className="btn-outline-dark"
            onClick={() => mascotRef.current?.replay()}
            title="Play the intro again"
            style={{
              position: 'absolute',
              left: 16,
              bottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              padding: '10px 17px',
              background: 'rgba(251,247,239,0.94)',
              border: '1.5px solid #2b3a4f',
              borderRadius: 999,
              fontFamily: mono,
              fontSize: 11,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M20 11a8 8 0 1 0-2.6 6.3" />
              <path d="M20 4.5V11h-6.2" />
            </svg>
            Replay intro
          </button>
        </div>
      </section>

      <section id="templates" style={{ paddingTop: 88 }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap', borderBottom: '1px solid #ddd3c2', paddingBottom: 18 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <h2 style={sectionHeading}>Templates</h2>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#5d6a80', maxWidth: '52ch' }}>
              Digital invitations your guests open on their phones, with an RSVP form, a schedule, maps and a gallery. Open any design to try the live demo.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => {
                  setFilter(f.key);
                  setLimit(PAGE);
                }}
                style={{
                  padding: '9px 16px',
                  borderRadius: 999,
                  border: '1.5px solid #2b3a4f',
                  background: filter === f.key ? '#2b3a4f' : 'transparent',
                  color: filter === f.key ? '#fbf7ef' : '#2b3a4f',
                  fontFamily: mono,
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,360px),1fr))', gap: '44px 30px', paddingTop: 30 }}>
          {shown.map((t) => (
            <TemplateCard key={t.slug} template={t} onRequest={() => requestDesign(t)} />
          ))}
        </div>
        {matching.length > shown.length && (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 44 }}>
            <button
              type="button"
              className="btn-outline-dark"
              onClick={() => setLimit((n) => n + PAGE)}
              style={{ ...pill, padding: '14px 28px', border: '1.5px solid #2b3a4f', background: 'transparent', cursor: 'pointer' }}
            >
              Show more designs ({matching.length - shown.length})
            </button>
          </div>
        )}
      </section>

      <section id="craft" style={{ paddingTop: 88 }}>
        <h2 style={{ ...sectionHeading, margin: '0 0 30px', borderBottom: '1px solid #ddd3c2', paddingBottom: 18 }}>All of it, in-house</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 28 }}>
          {CRAFTS.map((c) => (
            <div key={c.n} style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 14 }}>
              <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.16em', color: ACCENT }}>{c.n}</span>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 400 }}>{c.title}</h3>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: '#5d6a80' }}>{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="contact" style={{ marginTop: 88, background: '#2b3a4f', color: '#fbf7ef', borderRadius: 26, padding: 'clamp(28px,4vw,52px)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap: 40 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <h2 style={{ margin: 0, fontSize: 'clamp(26px,2.8vw,36px)', fontWeight: 400, lineHeight: 1.15 }}>Tell me about the wedding.</h2>
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.65, color: '#cdd6e2', maxWidth: '40ch' }}>
            Names, date, rough guest count and any template you liked. You get a written quote and a printed proof in the post.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontFamily: mono, fontSize: 12, letterSpacing: '0.06em', color: '#cdd6e2', paddingTop: 6 }}>
            <span>hello@knotiva.studio</span>
            <span>+63 917 000 0000</span>
            <span>Mon–Fri · replies within a day</span>
          </div>
        </div>

        {sent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', background: 'rgba(251,247,239,0.07)', border: '1px solid rgba(251,247,239,0.25)', borderRadius: 18, padding: 28 }}>
            <span style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#e6bf6a' }}>Sent</span>
            <p style={{ margin: 0, fontSize: 18, lineHeight: 1.5 }}>
              Thank you, {sentName} — I&rsquo;ll write back within a day with a quote and a proof plan.
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setSentName('');
              }}
              style={{ alignSelf: 'flex-start', marginTop: 6, padding: '11px 20px', background: 'transparent', border: '1.5px solid rgba(251,247,239,0.5)', borderRadius: 999, color: '#fbf7ef', fontFamily: mono, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'grid', gap: 16 }}>
            <label style={fieldLabel}>
              Your names
              <input name="name" required placeholder="Ana & Miguel" style={field} />
            </label>
            <label style={fieldLabel}>
              Email
              <input name="email" type="email" required placeholder="you@email.com" style={field} />
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,140px),1fr))', gap: 16 }}>
              <label style={fieldLabel}>
                Wedding date
                <input name="date" type="date" style={compactField} />
              </label>
              <label style={fieldLabel}>
                Invitations
                <input name="count" type="number" min="20" step="10" placeholder="120" style={compactField} />
              </label>
            </div>
            <label style={fieldLabel}>
              What are you after?
              <textarea
                key={picked}
                name="note"
                rows="4"
                defaultValue={picked ? `We'd like the ${picked} template. ` : ''}
                placeholder="We liked the Cinematic template — beach ceremony, 140 guests."
                style={{ ...field, lineHeight: 1.55, resize: 'vertical' }}
              />
            </label>
            <button
              type="submit"
              className="btn-gold"
              style={{ ...pill, justifySelf: 'start', marginTop: 4, padding: '15px 30px', background: '#e6bf6a', border: 0, color: '#2b3a4f', cursor: 'pointer' }}
            >
              Send enquiry
            </button>
          </form>
        )}
      </section>

      <footer style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap', paddingTop: 36, fontFamily: mono, fontSize: 11, letterSpacing: '0.1em', color: '#7b7266' }}>
        <span>© Knotiva Studio</span>
        <span>Lettering · print · seals · ribbon</span>
      </footer>
    </div>
  );
}
