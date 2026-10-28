import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { catalogEntry } from '../templates/catalog.js';
import { LOADERS } from '../templates/registry.js';
import { clearCustom, compressImage, loadCustom, saveCustom } from '../templates/kit/store.js';
import { GIFT_QR } from '../templates/kit/custom.jsx';
import './customize.css';

const LABELS = {
  a: 'Partner 1 — first name',
  b: 'Partner 2 — first name',
  start: 'Ceremony date & time',
  date: 'Date as written on the invitation',
  venue: 'Venue',
  place: 'City or area',
  replyBy: 'RSVP deadline',
  end: 'Celebration ends',
  month: 'Month (short, e.g. Apr)',
  day: 'Day',
  year: 'Year',
  ceremony: 'Ceremony venue',
  ceremonyAddress: 'Ceremony address',
  venueAddress: 'Reception address',
  aLast: 'Partner 1 — surname',
  bLast: 'Partner 2 — surname',
  hashtag: 'Wedding hashtag',
  ceremonyShort: 'Ceremony short label',
  ceremonyNote: 'Ceremony caption',
  venueShort: 'Reception short label',
  venueNote: 'Reception caption',
  receptionTime: 'Reception time',
  subtitle: 'Photo caption',
  tagline: 'Romantic tagline',
  intro: 'Couple introduction',
  welcome: 'Welcome message',
  invitation: 'Invitation message',
  storyTitle: 'Love story heading',
  storyIntro: 'Love story introduction',
  story1Year: 'Story 1 — year',
  story1Title: 'Story 1 — title',
  story1Text: 'Story 1 — text',
  story2Year: 'Story 2 — year',
  story2Title: 'Story 2 — title',
  story2Text: 'Story 2 — text',
  story3Year: 'Story 3 — year',
  story3Title: 'Story 3 — title',
  story3Text: 'Story 3 — text',
  parentsNote: 'Parents section note',
  aParent1: 'Parent of partner 1',
  aParent2: 'Parent of partner 1 (second)',
  bParent1: 'Parent of partner 2',
  bParent2: 'Parent of partner 2 (second)',
  dressTitle: 'Dress code title',
  dressNote: 'Dress code description',
  paletteNote: 'Palette guidance',
  giftTitle: 'Gift section title',
  giftDetails: 'Gift instructions',
  travelIntro: 'Travel introduction',
  hotel: 'Suggested hotel',
  hotelNote: 'Accommodation note',
  transport: 'Getting around',
  airport: 'Airport details',
  reminder1: 'Reminder 1',
  reminder2: 'Reminder 2',
  reminder3: 'Reminder 3',
  closing: 'Closing thank-you message',
  quote: 'Pull quote (a line from the couple)',
  fromCode: 'Pass: departure code (e.g. MNL)',
  fromCity: 'Pass: departure city',
  toCode: 'Pass: arrival code (e.g. USU)',
  toCity: 'Pass: arrival city',
  boat: 'Pass: boat or transfer time',
  jetty: 'Pass: jetty / pier',
  estate: 'Estate or house name (shown on the map and footer)',
  since: 'Year you met (archive starts)',
};
const ORDER = ['a', 'b', 'start', 'date', 'venue', 'place', 'replyBy', 'end'];
const HIDDEN = new Set(['month', 'day', 'year']);

const isIso = (v) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v);
const localPart = (iso) => iso.slice(0, 16);
const offsetPart = (iso) => iso.slice(19) || '';

function formatDate(iso, sample) {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00`);
  const gb = /^\d/.test(sample || '');
  return d.toLocaleDateString(gb ? 'en-GB' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

function PhotoTile({ src, label, custom, onPick, onReset }) {
  const input = useRef(null);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!custom) {
      setPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(custom);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [custom]);
  const name = src.split('/').pop().replace(/\.\w+$/, '');
  return (
    <div className={`cz-photo${custom ? ' is-custom' : ''}`}>
      <button type="button" className="cz-photo-img" onClick={() => input.current?.click()} aria-label={`Replace photo ${name}`}>
        <img src={preview || src} alt="" />
        <span>Replace</span>
      </button>
      <div className="cz-photo-meta">
        <span>{label || (name === 'hero' ? 'Main photo' : name === 'story' ? 'Story photo' : name)}</span>
        {custom && (
          <button type="button" onClick={onReset}>
            Undo
          </button>
        )}
      </div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = '';
        }}
      />
    </div>
  );
}

/** /templates/:slug/customize — the couple fills in their details and photos with a live preview. */
export default function CustomizePage() {
  const { slug } = useParams();
  const meta = catalogEntry(slug);
  const [record, setRecord] = useState(null);
  const [registry, setRegistry] = useState({ details: null, photos: [], schedule: '', entourage: '', gifts: null });
  const [device, setDevice] = useState('phone');
  const [tab, setTab] = useState('edit');
  const [saved, setSaved] = useState('');
  const [busy, setBusy] = useState(false);
  const saveTimer = useRef(null);

  useEffect(() => {
    loadCustom(slug).then((r) => setRecord({ details: r.details || {}, photos: r.photos || {} }));
  }, [slug]);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.origin !== window.location.origin || e.data?.type !== 'knotiva-registry' || e.data.slug !== slug) return;
      setRegistry({ details: e.data.details, photos: e.data.photos, schedule: e.data.schedule, entourage: e.data.entourage, gifts: e.data.gifts });
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [slug]);

  useEffect(() => {
    if (meta) document.title = `Customise ${meta.name} · Knotiva`;
  }, [meta]);

  // Every edit goes through update(fn) so it builds on the latest record; saving is debounced.
  const dirty = useRef(false);
  const update = useCallback((fn) => {
    dirty.current = true;
    setRecord((prev) => fn(prev));
  }, []);

  useEffect(() => {
    if (!record || !dirty.current) return undefined;
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      await saveCustom(slug, record);
      setSaved('Saved on this device');
    }, 300);
    return () => clearTimeout(saveTimer.current);
  }, [record, slug]);

  const defaults = registry.details;
  const fields = useMemo(() => {
    if (!defaults) return [];
    const keys = Object.keys(defaults).filter((k) => !HIDDEN.has(k));
    return keys.sort((x, y) => (ORDER.indexOf(x) + 1 || 99) - (ORDER.indexOf(y) + 1 || 99));
  }, [defaults]);

  if (!meta || !LOADERS[slug]) return <Navigate to="/#templates" replace />;

  const value = (k) => record?.details?.[k] ?? '';
  const setField = (k, v) =>
    update((prev) => {
      const details = { ...prev.details, [k]: v };
      if (v === undefined) delete details[k];
      // Picking the ceremony date also fills in the written date (unless they typed their own).
      if (k === 'start' && v && defaults) {
        if (!prev.details.dateTouched) details.date = formatDate(v, defaults.date);
        const d = new Date(`${v.slice(0, 10)}T12:00:00`);
        if ('month' in defaults) details.month = d.toLocaleDateString('en-US', { month: 'short' });
        if ('day' in defaults) details.day = String(d.getDate());
        if ('year' in defaults) details.year = String(d.getFullYear());
        // Keep the end on the same day as the ceremony (or the day after, if it ran past midnight).
        if (isIso(defaults.end || '') && !prev.details.endTouched) {
          const dayGap = Math.round((new Date(defaults.end.slice(0, 10)) - new Date(defaults.start.slice(0, 10))) / 86400000);
          const endDay = new Date(`${v.slice(0, 10)}T12:00:00`);
          endDay.setDate(endDay.getDate() + dayGap);
          const ymd = `${endDay.getFullYear()}-${String(endDay.getMonth() + 1).padStart(2, '0')}-${String(endDay.getDate()).padStart(2, '0')}`;
          details.end = `${ymd}${defaults.end.slice(10)}`;
        }
      }
      if (k === 'date') details.dateTouched = 'yes';
      if (k === 'end') details.endTouched = 'yes';
      return { ...prev, details };
    });

  const pickPhoto = async (src, file) => {
    setBusy(true);
    try {
      const blob = await compressImage(file);
      update((prev) => ({ ...prev, photos: { ...prev.photos, [src]: blob } }));
    } finally {
      setBusy(false);
    }
  };

  const resetPhoto = (src) =>
    update((prev) => {
      const photos = { ...prev.photos };
      delete photos[src];
      return { ...prev, photos };
    });

  const resetAll = async () => {
    if (!window.confirm('Remove all your changes to this template?')) return;
    dirty.current = false;
    await clearCustom(slug);
    setRecord({ details: {}, photos: {} });
    setSaved('');
  };

  // Photos are .jpg; templates without real photos use .svg placeholders. PNGs are decoration.
  const rank = (p) => (/\/hero\.(jpe?g|svg)$/.test(p) ? 0 : /\/story\.(jpe?g|svg)$/.test(p) ? 1 : 2);
  const photos = registry.photos
    .filter((p) => /\.(jpe?g|svg)$/i.test(p) && p !== GIFT_QR && !p.includes('/shared/'))
    .sort((x, y) => rank(x) - rank(y));

  return (
    <div className="cz">
      <header className="cz-top">
        <Link to={`/templates/${slug}`} className="cz-back">
          ← {meta.name}
        </Link>
        <div className="cz-actions">
          <a className="cz-btn cz-btn--ghost" href={`/templates/${slug}?mine=1`} target="_blank" rel="noreferrer">
            Open full preview
          </a>
          <Link className="cz-btn" to={`/templates/${slug}/print?mine=1`}>
            Print version
          </Link>
        </div>
      </header>

      <div className="cz-tabs" role="tablist">
        <button type="button" role="tab" aria-selected={tab === 'edit'} className={tab === 'edit' ? 'is-on' : ''} onClick={() => setTab('edit')}>
          Edit
        </button>
        <button type="button" role="tab" aria-selected={tab === 'preview'} className={tab === 'preview' ? 'is-on' : ''} onClick={() => setTab('preview')}>
          Preview
        </button>
      </div>

      <div className="cz-body">
        <aside className={`cz-panel${tab === 'edit' ? ' is-on' : ''}`}>
          <h1>Make it yours</h1>
          <p className="cz-lead">Type your names and details and swap in your own photos. The preview updates as you go. Everything is saved in this browser.</p>

          {!record || !defaults ? (
            <p className="cz-loading">Loading the template…</p>
          ) : (
            <>
              <section className="cz-sec">
                <h2>Details</h2>
                {fields.map((k) => {
                  const def = defaults[k];
                  if (typeof def !== 'string') return null;
                  if (isIso(def)) {
                    const v = value(k);
                    return (
                      <label key={k} className="cz-field">
                        <span>{LABELS[k] || k}</span>
                        <input
                          type="datetime-local"
                          value={v ? localPart(v) : localPart(def)}
                          onChange={(e) => setField(k, e.target.value ? `${e.target.value}:00${offsetPart(def)}` : '')}
                        />
                      </label>
                    );
                  }
                  return (
                    <label key={k} className="cz-field">
                      <span>{LABELS[k] || k}</span>
                      <input value={value(k)} placeholder={def} onChange={(e) => setField(k, e.target.value)} />
                    </label>
                  );
                })}
              </section>

              <section className="cz-sec">
                <h2>Schedule</h2>
                <p className="cz-hint">
                  One line per item: <code>time | what happens | optional note</code>. Shown on the invitation and the printed schedule card.
                </p>
                <textarea
                  className="cz-area"
                  rows="7"
                  value={record.details.schedule ?? registry.schedule ?? ''}
                  onChange={(e) => setField('schedule', e.target.value)}
                />
                {record.details.schedule != null && (
                  <button type="button" className="cz-undo" onClick={() => setField('schedule', undefined)}>
                    Use the sample schedule
                  </button>
                )}
              </section>

              <section className="cz-sec">
                <h2>Entourage</h2>
                <p className="cz-hint">
                  A group title on its own line, then one name per line. Write couples as <code>Mr. A &amp; Mrs. B</code>. Leave an empty line between groups.
                </p>
                <textarea
                  className="cz-area"
                  rows="14"
                  value={record.details.entourage ?? registry.entourage ?? ''}
                  onChange={(e) => setField('entourage', e.target.value)}
                />
                {record.details.entourage != null && (
                  <button type="button" className="cz-undo" onClick={() => setField('entourage', undefined)}>
                    Use the sample entourage
                  </button>
                )}
              </section>

              <section className="cz-sec">
                <h2>Gifts</h2>
                <label className="cz-field">
                  <span>Message to guests</span>
                  <textarea
                    className="cz-area cz-area--text"
                    rows="3"
                    value={record.details.giftNote ?? registry.gifts?.note ?? ''}
                    onChange={(e) => setField('giftNote', e.target.value)}
                  />
                </label>
                <label className="cz-field">
                  <span>Accounts</span>
                  <textarea
                    className="cz-area"
                    rows="3"
                    value={record.details.giftAccounts ?? registry.gifts?.accounts ?? ''}
                    onChange={(e) => setField('giftAccounts', e.target.value)}
                  />
                </label>
                <p className="cz-hint">
                  One per line: <code>GCash | Maria S. | 0917 555 0143</code>. Shown on the invitation and the printed gifts card.
                </p>
                <div className="cz-qr">
                  <PhotoTile
                    src="/templates/shared/qr-placeholder.svg"
                    label="GCash / bank QR"
                    custom={record.photos[GIFT_QR]}
                    onPick={(f) => pickPhoto(GIFT_QR, f)}
                    onReset={() => resetPhoto(GIFT_QR)}
                  />
                  <p className="cz-hint">Optional: upload your GCash or bank QR code (screenshot from the app is fine).</p>
                </div>
              </section>

              <section className="cz-sec">
                <h2>Photos</h2>
                <p className="cz-hint">Tap a photo to replace it. Large photos are resized automatically.{busy ? ' Processing…' : ''}</p>
                <div className="cz-photos">
                  {photos.map((src) => (
                    <PhotoTile key={src} src={src} custom={record.photos[src]} onPick={(f) => pickPhoto(src, f)} onReset={() => resetPhoto(src)} />
                  ))}
                </div>
              </section>

              <div className="cz-foot">
                <span className="cz-saved" aria-live="polite">
                  {saved}
                </span>
                <button type="button" className="cz-reset" onClick={resetAll}>
                  Reset everything
                </button>
              </div>
            </>
          )}
        </aside>

        <main className={`cz-stage${tab === 'preview' ? ' is-on' : ''}`}>
          <div className="cz-device" role="group" aria-label="Preview size">
            <button type="button" className={device === 'phone' ? 'is-on' : ''} onClick={() => setDevice('phone')}>
              Phone
            </button>
            <button type="button" className={device === 'desktop' ? 'is-on' : ''} onClick={() => setDevice('desktop')}>
              Desktop
            </button>
          </div>
          <div className={`cz-frame cz-frame--${device}`}>
            <iframe title={`${meta.name} preview`} src={`/templates/${slug}?embed=1`} />
          </div>
        </main>
      </div>
    </div>
  );
}
