import { createContext, useContext } from 'react';
import { createPortal } from 'react-dom';

/**
 * How the invitation is being shown:
 * - mode 'live'  — a guest (or a prospective client) viewing the demo
 * - mode 'thumb' — being captured for a catalogue thumbnail: no gate, no music, no animation
 * `guest` personalises the copy (name and reserved seats) from the invite link.
 * `gate` false skips the opening screen.
 */
export const InviteContext = createContext({ mode: 'live', guest: null, gate: true });
export const useInvite = () => useContext(InviteContext);

export const ThemeContext = createContext({ className: '', music: null });
export const useMusic = () => useContext(ThemeContext).music;

/**
 * Renders children into <body>, inside a wrapper that carries the template's class so its
 * CSS variables and fonts apply. Used for anything fixed to the viewport (gate, menus, dialogs),
 * because the template root is a size container and would otherwise trap position: fixed.
 */
export function Layer({ children }) {
  const { className } = useContext(ThemeContext);
  return createPortal(<div className={`tpl-layer ${className}`}>{children}</div>, document.body);
}

/** "2 seats" style text for the guest's reserved seats. */
export function seatLine(guest) {
  const seats = guest?.seats || 2;
  return `${seats} seat${seats === 1 ? '' : 's'}`;
}

const enc = encodeURIComponent;
const stamp = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/** Google Calendar "add event" link. */
export function calendarUrl({ title, start, end, location, details = '' }) {
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${enc(title)}&dates=${stamp(start)}/${stamp(end)}&location=${enc(location)}&details=${enc(details)}`;
}

/** Google Maps search link. */
export const mapsUrl = (query) => `https://www.google.com/maps/search/?api=1&query=${enc(query)}`;

/** Downloads an .ics file (Apple Calendar, Outlook). */
export function downloadIcs({ title, start, end, location, details = '' }) {
  const esc = (s) => String(s).replace(/[\\;,]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Knotiva//Digital Invitation//EN',
    'BEGIN:VEVENT',
    `UID:${stamp(start)}-${Math.random().toString(36).slice(2)}@knotiva`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `${title.replace(/[^\w]+/g, '-').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}
