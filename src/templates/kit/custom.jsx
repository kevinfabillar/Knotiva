import { createContext, useContext, useMemo } from 'react';

/**
 * A couple's own edits to a template: `details` (names, date, venue…) and `photos`
 * (default photo URL → their uploaded photo URL). `registry` collects what the template
 * uses, so the customise page knows which fields and photos to offer.
 */
export const CustomContext = createContext({ details: null, photos: null, registry: null });

/** The template's details with the couple's edits on top. Empty edits fall back to the default. */
export function useDetails(defaults) {
  const { details, registry } = useContext(CustomContext);
  if (registry) registry.details = defaults;
  return useMemo(() => {
    const out = { ...defaults };
    Object.entries(details || {}).forEach(([k, v]) => {
      if (typeof v === 'string' && v.trim() && k in defaults) out[k] = v.trim();
    });
    return out;
  }, [defaults, details]);
}

/** Returns photo(src): the couple's replacement for a default photo, or the default itself. */
export function usePhoto() {
  const { photos, registry } = useContext(CustomContext);
  return (src) => {
    if (registry && !registry.photos.includes(src)) registry.photos.push(src);
    return photos?.[src] || src;
  };
}

/** First letters of the couple's names, e.g. initials(D) → ['N', 'L']. */
export const initials = (D) => [(D.a || '?').trim()[0].toUpperCase(), (D.b || '?').trim()[0].toUpperCase()];

/* ---------- Lists the couple can edit as plain text ---------- */

const SEP = /\s+[|–—-]\s+|\s*\|\s*/;

/** Schedule as text: one line per item, "4:30 PM | Ceremony | optional note". */
export const formatSchedule = (items) =>
  items.map((s) => [s.time, s.label || s.tag, s.sub || s.note].filter(Boolean).join(' | ')).join('\n');

export function parseSchedule(text, defaults = []) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line, i) => {
      const [time = '', label = '', note = ''] = line.split(SEP).map((x) => x.trim());
      const base = defaults[i] || { icon: 'heart' };
      return { ...base, time, label: label || time, tag: label || time, sub: note, note };
    });
}

/** Entourage as text: a title line, then one name per line ("A & B" for pairs), blank line between groups. */
export const formatEntourage = (groups) =>
  groups.map((g) => [g.title, ...(g.pairs ? g.pairs.map((p) => p.join(' & ')) : g.names)].join('\n')).join('\n\n');

export function parseEntourage(text) {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((lines) => lines.length > 1)
    .map(([title, ...rows]) => {
      const pairs = rows.every((r) => r.includes(' & ')) ? rows.map((r) => r.split(' & ').map((x) => x.trim())) : null;
      return pairs ? { title, pairs, wide: true } : { title, names: rows };
    });
}

/** The template's schedule, or the couple's edited one. */
export function useSchedule(defaults) {
  const { details, registry } = useContext(CustomContext);
  if (registry) registry.schedule = formatSchedule(defaults);
  const text = details?.schedule;
  return useMemo(() => (text && text.trim() ? parseSchedule(text, defaults) : defaults), [text, defaults]);
}

/** The template's entourage, or the couple's edited one. */
export function useEntourage(defaults) {
  const { details, registry } = useContext(CustomContext);
  if (registry) registry.entourage = formatEntourage(defaults);
  const text = details?.entourage;
  return useMemo(() => (text && text.trim() ? parseEntourage(text) : defaults), [text, defaults]);
}

/** Gift accounts as text: one per line, "GCash | Maria S. | 0917 555 0143". */
export const formatGifts = (accounts) => accounts.map((a) => [a.label, a.name, a.number].join(' | ')).join('\n');

export function parseGifts(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = '', name = '', number = ''] = line.split('|').map((x) => x.trim());
      return number ? { label, name, number } : { label, name: '', number: name || label };
    });
}

export const GIFT_QR = '__gift-qr';

/** The gift note, accounts and optional uploaded payment QR, with the couple's edits. */
export function useGifts(defaults) {
  const { details, photos, registry } = useContext(CustomContext);
  if (registry) registry.gifts = { note: defaults.note, accounts: formatGifts(defaults.accounts) };
  const note = details?.giftNote;
  const text = details?.giftAccounts;
  const qr = photos?.[GIFT_QR] || null;
  return useMemo(
    () => ({
      note: note && note.trim() ? note.trim() : defaults.note,
      accounts: text && text.trim() ? parseGifts(text) : defaults.accounts,
      qr,
    }),
    [note, text, qr, defaults]
  );
}
