// Engraved-stationery wording for Maison: spelled-out dates and times (spec §0.9). Shared by Maison.jsx and Union.jsx.

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve',
  'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const ORD = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh',
  'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth', 'twentieth',
  'twenty-first', 'twenty-second', 'twenty-third', 'twenty-fourth', 'twenty-fifth', 'twenty-sixth', 'twenty-seventh',
  'twenty-eighth', 'twenty-ninth', 'thirtieth', 'thirty-first'];
const COUNT = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];

const under100 = (n) => (n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? `-${ONES[n % 10]}` : ''));

/** 2028 → "two thousand twenty-eight" */
export const yearWords = (y) => {
  const r = y % 1000;
  const rest = r >= 100 ? `${ONES[Math.floor(r / 100)]} hundred${r % 100 ? ` ${under100(r % 100)}` : ''}` : under100(r);
  return `${ONES[Math.floor(y / 1000)]} thousand${r ? ` ${rest}` : ''}`;
};
const dayDate = (iso) => new Date(`${iso.slice(0, 10)}T12:00:00`);
export const weekdayOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { weekday: 'long' });
export const monthOf = (iso) => dayDate(iso).toLocaleDateString('en-US', { month: 'long' });
export const dayNum = (iso) => Number(iso.slice(8, 10));
export const yearOf = (iso) => Number(iso.slice(0, 4));
/** "12 · 02 · 2028" */
export const dotted = (iso) => iso.slice(0, 10).split('-').reverse().join(' · ');
/** "4:00 PM" */
export const timeOf = (iso) => {
  const h = +iso.slice(11, 13);
  return `${h % 12 || 12}:${iso.slice(14, 16)} ${h < 12 ? 'AM' : 'PM'}`;
};
/** "four o’clock in the afternoon", "half past six in the evening" */
export function spokenTime(iso) {
  const h = +iso.slice(11, 13);
  const m = +iso.slice(14, 16);
  const word = (x) => ONES[x % 12 || 12];
  const part = h < 12 ? 'in the morning' : h < 17 ? 'in the afternoon' : 'in the evening';
  const t =
    m === 0 ? `${word(h)} o’clock`
      : m === 15 ? `a quarter past ${word(h)}`
        : m === 30 ? `half past ${word(h)}`
          : m === 45 ? `a quarter to ${word(h + 1)}`
            : `${word(h)} ${under100(m)}`;
  return `${t} ${part}`;
}
/** "Saturday, the twelfth of February" */
export const formalDay = (iso) => `${weekdayOf(iso)}, the ${ORD[dayNum(iso)]} of ${monthOf(iso)}`;
/** "Saturday, the twelfth of February, two thousand twenty-eight, at four o’clock in the afternoon." */
export const formalDate = (iso) => `${formalDay(iso)}, ${yearWords(yearOf(iso))}, at ${spokenTime(iso)}.`;
/** "10 January 2028" or "January 10, 2028" → "the tenth of January"; anything else as typed. */
export function formalReplyBy(text) {
  const a = /^(\d{1,2})\s+([A-Za-z]+)\s+\d{4}$/.exec(text.trim()) || /^([A-Za-z]+)\s+(\d{1,2}),?\s+\d{4}$/.exec(text.trim());
  if (!a) return text;
  const [d, mo] = /^\d/.test(a[1]) ? [+a[1], a[2]] : [+a[2], a[1]];
  return ORD[d] ? `the ${ORD[d]} of ${mo}` : text;
}
export const tzLabel = (iso) => (iso.endsWith('+08:00') ? 'Philippine Standard Time' : 'Local time');
export const seatsCount = (guest) => {
  const n = guest?.seats || 2;
  return `${COUNT[n] || n} seat${n === 1 ? '' : 's'}`;
};
/** "Two seats reserved in your honour" */
export const seatsLine = (guest) => `${seatsCount(guest)} reserved in your honour`;
export const directions = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;
export const ROMAN_SECTIONS = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
/** Fluid names: the largest size (≤ max) at which `text` fits `measure` px. */
export const fit = (text, measure, max) => Math.min(max, Math.floor(measure / (text.length * 0.52)));
