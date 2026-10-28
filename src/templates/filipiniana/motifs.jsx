// Contemporary Filipiniana motifs. All decorative: aria-hidden.

const PETALS = [0, 72, 144, 216, 288];

/** One sampaguita: five narrow petals, fine stroke. 40 x 40. */
export const Sampaguita = ({ color = '#a88b4a', ...p }) => (
  <svg viewBox="0 0 40 40" aria-hidden="true" {...p}>
    <g fill="none" stroke={color} strokeWidth="0.9" transform="translate(20 20)">
      {PETALS.map((a) => (
        <ellipse key={a} cx="0" cy="-8" rx="3.6" ry="7.6" transform={`rotate(${a})`} />
      ))}
      <circle cx="0" cy="0" r="2" />
    </g>
  </svg>
);

/** Sampaguita on a curving stem with two buds. 120 x 60. */
export const SampaguitaSprig = ({ color = '#a88b4a', ...p }) => (
  <svg viewBox="0 0 120 60" aria-hidden="true" {...p}>
    <g fill="none" stroke={color} strokeWidth="0.9">
      <path d="M8 50 C 34 50, 50 40, 60 30 C 70 40, 86 50, 112 50" />
      <g transform="translate(60 22)">
        {PETALS.map((a) => (
          <ellipse key={a} cx="0" cy="-8" rx="3.6" ry="7.6" transform={`rotate(${a})`} />
        ))}
        <circle cx="0" cy="0" r="2" />
      </g>
      <ellipse cx="30" cy="44" rx="2.4" ry="5" transform="rotate(-50 30 44)" />
      <ellipse cx="90" cy="44" rx="2.4" ry="5" transform="rotate(50 90 44)" />
      <path d="M22 50 C 26 44, 32 42, 36 44 M98 50 C 94 44, 88 42, 84 44" />
    </g>
  </svg>
);

/** 28px calado divider used between sections on phones. Style .fi-calado-band in CSS. */
export const CaladoBand = () => <div className="fi-calado-band" aria-hidden="true" />;

/** Program time medallion: 74px circle on the spine. active = the ceremony. */
export const TimeMedallion = ({ time, active = false }) => (
  <span className={`fi-medallion${active ? ' is-active' : ''}`} aria-hidden="true">
    <span>{time}</span>
  </span>
);
