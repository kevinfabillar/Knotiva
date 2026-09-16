import { useRef, useState } from 'react';
import WalkInScene from '../scenes/WalkInScene.jsx';

const ACCENT = '#b96f6f';

const TEMPLATES = [
  { name: 'Ribbon & Rope', style: 'Classic', price: 'from ₱68/set', slot: '[ photo of letterpress suite ]', note: 'Deckled edge, knot monogram, grosgrain tie.', tag: 'classic' },
  { name: 'Garden Longhand', style: 'Script', price: 'from ₱74/set', slot: '[ photo of calligraphy suite ]', note: 'Hand-lettered names, pressed-flower vellum band.', tag: 'script' },
  { name: 'Bayanihan Blue', style: 'Modern', price: 'from ₱59/set', slot: '[ photo of two-colour suite ]', note: 'Two-ink risograph, Filipino motifs, matte stock.', tag: 'modern' },
  { name: 'Wax & Willow', style: 'Classic', price: 'from ₱82/set', slot: '[ photo of wax-sealed suite ]', note: 'Hand-poured seal, cotton envelope, silk ribbon.', tag: 'classic' },
  { name: 'Quiet Type', style: 'Modern', price: 'from ₱52/set', slot: '[ photo of minimal suite ]', note: 'One typeface, deep margins, nothing else.', tag: 'modern' },
  { name: 'Gold Knotwork', style: 'Script', price: 'from ₱96/set', slot: '[ photo of foiled suite ]', note: 'Foiled knot border, blind deboss, tissue liner.', tag: 'script' },
];

const CRAFTS = [
  { n: '01', title: 'Lettering', body: 'Names drawn by hand or set in metal — your call. Three directions, one proof.' },
  { n: '02', title: 'Printing', body: 'Letterpress, riso and digital in-house, so the stock choice never gets vetoed by a supplier.' },
  { n: '03', title: 'Sealing', body: 'Wax poured and stamped per envelope, colour-matched to the suite.' },
  { n: '04', title: 'Finishing', body: 'Ribbon, vellum, addressing, postage weight check, boxed and ready to post.' },
];

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'classic', label: 'Classic' },
  { key: 'script', label: 'Script' },
  { key: 'modern', label: 'Modern' },
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

  const shown = filter === 'all' ? TEMPLATES : TEMPLATES.filter((t) => t.tag === filter);

  const submit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setSentName((data.get('name') || 'friend').toString().trim());
    setSent(true);
  };

  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '0 24px 88px' }}>
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
          <h2 style={sectionHeading}>Templates</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,258px),1fr))', gap: 26, paddingTop: 30 }}>
          {shown.map((t) => (
            <article key={t.name} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ position: 'relative', aspectRatio: '3/4', border: '1px solid #ddd3c2', borderRadius: 14, overflow: 'hidden', backgroundColor: '#fbf7ef', backgroundImage: 'repeating-linear-gradient(135deg,rgba(43,58,79,0.055) 0 8px,transparent 8px 16px)' }}>
                <span style={{ position: 'absolute', left: 14, top: 14, padding: '5px 10px', background: '#f4f0e9', border: '1px solid #ddd3c2', borderRadius: 999, fontFamily: mono, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#7b7266' }}>
                  {t.style}
                </span>
                <span style={{ position: 'absolute', inset: 'auto 14px 14px', fontFamily: mono, fontSize: 10, lineHeight: 1.5, letterSpacing: '0.06em', color: '#8b8172' }}>
                  {t.slot}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: 19, fontWeight: 400 }}>{t.name}</h3>
                <span style={{ fontFamily: mono, fontSize: 11, color: '#7b7266' }}>{t.price}</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: '#5d6a80' }}>{t.note}</p>
              <a href="#contact" style={{ fontFamily: mono, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', borderBottom: '1px solid #c9bda8', paddingBottom: 3, alignSelf: 'flex-start' }}>
                Request this set
              </a>
            </article>
          ))}
        </div>
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
                name="note"
                rows="4"
                placeholder="We liked the Ribbon & Rope set — garden ceremony, 140 guests."
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
