// Thin line icons shared by every template. They draw in currentColor.
const PATHS = {
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M7.5 13h1M11.5 13h1M15.5 13h1M7.5 16.5h1M11.5 16.5h1M15.5 16.5h1" strokeWidth="1.6" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-6.5-6-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21z" />
      <circle cx="12" cy="9.8" r="2.4" />
    </>
  ),
  cocktail: (
    <>
      <path d="M4.5 4.5h15L12 12.5z" />
      <path d="M12 12.5v7M8 20h8M6.8 7h10.4" />
      <circle cx="14.6" cy="6.2" r="0.9" />
    </>
  ),
  cheers: (
    <>
      <g transform="rotate(14 8 12)">
        <path d="M5.5 5h5l-.5 5.2a2 2 0 0 1-4 0z" />
        <path d="M8 12.3v6.7M6 19h4" />
      </g>
      <g transform="rotate(-14 16 12)">
        <path d="M13.5 5h5l-.5 5.2a2 2 0 0 1-4 0z" />
        <path d="M16 12.3v6.7M14 19h4" />
      </g>
      <path d="M12 1.8v2M9.6 2.6l.8 1.3M14.4 2.6l-.8 1.3" />
    </>
  ),
  rings: (
    <>
      <circle cx="9" cy="14.5" r="5" />
      <circle cx="15" cy="14.5" r="5" />
      <path d="M13.2 6.8 15 4.6l1.8 2.2L15 9z" />
    </>
  ),
  camera: (
    <>
      <rect x="3" y="7" width="18" height="12.5" rx="1.8" />
      <path d="M8.2 7l1.4-2.4h4.8L15.8 7" />
      <circle cx="12" cy="13.2" r="3.4" />
      <path d="M17.6 9.8h.8" />
    </>
  ),
  dinner: (
    <>
      <circle cx="12" cy="12" r="5.6" />
      <circle cx="12" cy="12" r="3.4" />
      <path d="M3 4v4.2a1.4 1.4 0 0 0 2.8 0V4M4.4 4v16" />
      <path d="M20.6 20V4c-1.8 1.4-2.4 4.2-2.4 7.2h2.4" />
    </>
  ),
  cutlery: (
    <>
      <path d="M7 3v6a2 2 0 0 0 4 0V3M9 3v18" />
      <path d="M17 21V3c-2.2 1.8-2.8 5.4-2.6 9.4H17" />
    </>
  ),
  music: (
    <>
      <path d="M9 17.5V6.2l10-2.2v11.2" />
      <path d="M9 9.4l10-2.2" />
      <ellipse cx="6.8" cy="17.6" rx="2.3" ry="1.9" />
      <ellipse cx="16.8" cy="15.4" rx="2.3" ry="1.9" />
    </>
  ),
  mountain: (
    <>
      <path d="M2 19.5 8.6 9l3.6 5.6L15.4 10 22 19.5z" />
      <path d="M7 11.6l1.6-2.6 1.7 2.6-1 .8zM14 12l1.4-2 1.3 2" />
    </>
  ),
  heart: <path d="M12 20s-7.2-4.6-7.2-10.1A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.2 2.5C19.2 15.4 12 20 12 20z" />,
  wreath: (
    <>
      <circle cx="12" cy="12" r="6.5" strokeDasharray="0.1 2.6" strokeLinecap="round" strokeWidth="2.6" />
      <circle cx="12" cy="12" r="6.5" />
      <path d="M12 18.5c-.8 1.6-2.2 2.2-3.6 2.2M12 18.5c.8 1.6 2.2 2.2 3.6 2.2" />
    </>
  ),
  flower: (
    <>
      <circle cx="12" cy="9" r="2" />
      <path d="M12 7c-1.4-3.4 1.4-3.4 0 0M14 9c3.4-1.4 3.4 1.4 0 0M12 11c1.4 3.4-1.4 3.4 0 0M10 9c-3.4 1.4-3.4-1.4 0 0" />
      <path d="M13.4 7.6c1.6-2.6 3.2-1 .2.6M13.4 10.4c2.6 1.6 1 3.2-.6.2M10.6 10.4c-1.6 2.6-3.2 1-.2-.6M10.6 7.6c-2.6-1.6-1-3.2.6-.2" />
      <path d="M12 11.5V21M12 17c-2.6-.2-3.6-1.6-3.8-3 1.8 0 3.2.8 3.8 3z" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c-3 3-3 14 0 17M12 3.5c3 3 3 14 0 17M5 7.5h14M5 16.5h14" />
    </>
  ),
  house: (
    <>
      <path d="M4 20V10.5L12 4l8 6.5V20z" />
      <path d="M10 20v-5h4v5M7 12.5h2M15 12.5h2M11 9h2" />
    </>
  ),
  map: (
    <>
      <path d="M3 6.5 9 4.5l6 2 6-2v13l-6 2-6-2-6 2z" />
      <path d="M9 4.5v13M15 6.5v13" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" />
    </>
  ),
  facebook: <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8.2v3h2.5V21" />,
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.5" />
      <path d="m3.5 6.5 8.5 6.5 8.5-6.5" />
    </>
  ),
  arrow: <path d="M4 12h15M14 6.5l5.5 5.5-5.5 5.5" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="m6 9.5 6 6 6-6" />,
  left: <path d="m14.5 5.5-6.5 6.5 6.5 6.5" />,
  right: <path d="m9.5 5.5 6.5 6.5-6.5 6.5" />,
  smile: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 14.2c1.8 2.2 5.2 2.2 7 0M9.2 9.6h.1M14.7 9.6h.1" strokeWidth="2" />
    </>
  ),
  star: <path d="m12 3.5 2.4 5.3 5.8.6-4.3 3.9 1.2 5.7L12 16.1 6.9 19l1.2-5.7-4.3-3.9 5.8-.6z" />,
  bed: (
    <>
      <path d="M3 18.5V6M3 14h18v4.5M21 14v-2.5a3 3 0 0 0-3-3h-7V14" />
      <circle cx="7" cy="10.5" r="1.8" />
    </>
  ),
  copy: (
    <>
      <rect x="8.5" y="8.5" width="11.5" height="11.5" rx="1.6" />
      <path d="M15.5 8.5V5.6A1.6 1.6 0 0 0 13.9 4H5.6A1.6 1.6 0 0 0 4 5.6v8.3a1.6 1.6 0 0 0 1.6 1.6h2.9" />
    </>
  ),
  check: <path d="m4.5 12.5 4.6 4.5L19.5 7" />,
  gift: (
    <>
      <rect x="3.5" y="9" width="17" height="4" rx="0.8" />
      <path d="M5 13v7.5h14V13M12 9v11.5" />
      <path d="M12 9c-1.6-3.8-6.2-4.6-6.2-1.7C5.8 9 9 9 12 9zM12 9c1.6-3.8 6.2-4.6 6.2-1.7C18.2 9 15 9 12 9z" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6" />
      <path d="m15 15 5.5 5.5" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.3" />
      <path d="M2.8 19.5c.6-3.4 3.1-5.4 6.2-5.4s5.6 2 6.2 5.4" />
      <circle cx="16.6" cy="9.4" r="2.6" />
      <path d="M16.8 14.1c2.4.2 4 1.9 4.5 4.6" />
    </>
  ),
  gown: (
    <>
      <circle cx="12" cy="3.6" r="1.7" />
      <path d="M10.4 7.2c1-.4 2.2-.4 3.2 0l-.5 4.6h-2.2z" />
      <path d="M10.9 11.8C9 15 6.6 18.6 5.6 21.4c4.2.9 8.6.9 12.8 0-1-2.8-3.4-6.4-5.3-9.6" />
      <path d="M10.4 7.4 8.8 11.2M13.6 7.4l1.6 3.8" />
    </>
  ),
  suit: (
    <>
      <circle cx="12" cy="3.6" r="1.7" />
      <path d="M8 7.4c1.2-.9 2.6-1.2 4-1.2s2.8.3 4 1.2l.8 7.6H7.2z" />
      <path d="M10.6 6.6 12 10l1.4-3.4M12 10v5" />
      <path d="M8.6 15l.4 6.5M15.4 15l-.4 6.5M12 15.5V21" />
    </>
  ),
  barong: (
    <>
      <circle cx="12" cy="3.6" r="1.7" />
      <path d="M8 7.4c1.2-.9 2.6-1.2 4-1.2s2.8.3 4 1.2l.9 9.1H7.1z" />
      <path d="M10.8 6.6h2.4M12 7v9.5M10 9.2v5M14 9.2v5" strokeDasharray="0.6 1.4" />
      <path d="M8.8 16.5l.3 5M15.2 16.5l-.3 5" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  ring: (
    <>
      <circle cx="12" cy="14.5" r="6" />
      <path d="m9.6 6.4 2.4-3 2.4 3-2.4 2.4z" />
    </>
  ),
};

export default function Icon({ name, size = 28, stroke = 1.25, className, style }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
