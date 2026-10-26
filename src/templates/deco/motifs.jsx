// Gilded Deco motifs. All decorative: aria-hidden. Colours come from CSS (currentColor) unless noted.

/** Sunburst fan used above every section title (render at 84 x 42; phone 70 x 35). */
export const Fan = (p) => (
  <svg viewBox="0 0 120 60" aria-hidden="true" {...p}>
    <path d="M46 59L2 54M47 56L18 46M48 53L10 31M50 51L27 31M52 49L26 13M54 47L42 20M57 46L48 3M60 46L60 16M63 46L72 3M66 47L78 20M68 49L94 13M70 51L93 31M72 53L110 31M73 56L102 46M74 59L118 54" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <path d="M48 60 A12 12 0 0 1 72 60 Z" fill="currentColor" />
  </svg>
);

/** Diamond divider under titles (240 x 12; phone 160 x 8). */
export const Divider = (p) => (
  <svg viewBox="0 0 240 12" aria-hidden="true" {...p}>
    <path d="M0 6H104M136 6H240" stroke="#b8913f" strokeWidth="1" />
    <path d="M120 0L126 6L120 12L114 6Z" fill="#d4b26a" />
    <path d="M108 6L111 3L114 6L111 9Z M126 6L129 3L132 6L129 9Z" fill="#b8913f" />
  </svg>
);

/** Hero stepped arch with its sunburst crown (desktop 640 x 780). */
export const HeroArch = (p) => (
  <svg viewBox="0 0 640 780" aria-hidden="true" {...p}>
    <path d="M0 780 V320 H40 V280 H80 V240 H120 V200 A200 200 0 0 1 520 200 V240 H560 V280 H600 V320 H640 V780 Z" fill="#0b0f0d" stroke="#d4b26a" strokeWidth="1.5" />
    <path d="M12 768 V320 H52 V280 H92 V240 H132 V200 A188 188 0 0 1 508 200 V240 H548 V280 H588 V320 H628 V768 Z" fill="none" stroke="#b8913f" strokeWidth="1" />
    <path d="M274 313L153 300M275 308L187 290M276 304L160 266M278 299L196 263M280 295L175 234M283 291L210 238M286 287L195 206M289 284L229 217M293 281L221 182M297 278L252 200M301 276L252 165M306 274L278 189M310 273L285 154M315 272L306 183M320 272L320 150M325 272L334 183M330 273L355 154M334 274L362 189M339 276L388 165M343 278L388 200M347 281L419 182M351 284L411 217M354 287L445 206M357 291L430 238M360 295L465 234M362 299L444 263M364 304L480 266M365 308L453 290M366 313L487 300" stroke="#d4b26a" strokeWidth="1.1" />
    <path d="M286 318 A34 34 0 0 1 354 318 Z" fill="#d4b26a" />
    <path d="M300 318 A20 20 0 0 1 340 318" fill="none" stroke="#0b0f0d" strokeWidth="1.5" />
  </svg>
);

/** Phone hero arch (340 x 640). */
export const PhoneArch = (p) => (
  <svg viewBox="0 0 340 640" aria-hidden="true" {...p}>
    <path d="M0 640 V170 H22 V148 H44 V126 H66 V104 A104 104 0 0 1 274 104 V126 H296 V148 H318 V170 H340 V640 Z" fill="#0b0f0d" stroke="#d4b26a" strokeWidth="1.3" />
    <path d="M9 631 V170 H31 V148 H53 V126 H75 V104 A95 95 0 0 1 265 104 V126 H287 V148 H309 V170 H331 V631 Z" fill="none" stroke="#b8913f" strokeWidth="0.9" />
    <path d="M140 177L67 169M141 173L88 160M142 169L73 143M144 166L96 140M146 162L86 119M148 159L109 122M151 157L105 99M154 154L126 108M158 153L128 85M161 151L146 99M165 150L154 77M169 150L168 96M173 150L181 77M177 151L190 98M181 152L207 83M184 154L210 106M188 156L231 96M191 158L228 119M193 161L251 115M196 164L242 136M197 168L265 138M199 171L251 156M200 175L273 164" stroke="#d4b26a" strokeWidth="1" />
    <path d="M148 180 A22 22 0 0 1 192 180 Z" fill="#d4b26a" />
  </svg>
);

/** Venue panel arch, if you draw it inline instead of using arch-panel.svg (380 x 440). */
export const PanelArch = (p) => (
  <svg viewBox="0 0 380 440" aria-hidden="true" {...p}>
    <path d="M0 440 V190 H24 V166 H48 V142 H72 V118 A118 118 0 0 1 308 118 V142 H332 V166 H356 V190 H380 V440 Z" fill="#101814" stroke="#d4b26a" strokeWidth="1.2" />
    <path d="M9 431 V190 H33 V166 H57 V142 H81 V118 A109 109 0 0 1 299 118 V142 H323 V166 H347 V190 H371 V431 Z" fill="none" stroke="rgba(212, 178, 106, 0.4)" strokeWidth="1" />
  </svg>
);

/** Gold-line skyscrapers (260 x 560). Mirror the right one with style={{ transform: 'scaleX(-1)' }}. */
export const Skyline = (p) => (
  <svg viewBox="0 0 260 560" aria-hidden="true" {...p}>
    <path d="M92 560 L92 250 L100 250 L100 214 L110 214 L110 186 L116 186 L116 170 L164 170 L164 186 L170 186 L170 214 L180 214 L180 250 L188 250 L188 560 M18 560 L18 330 L28 330 L28 306 L40 306 L40 290 L70 290 L70 306 L82 306 L82 330 L92 330 M188 360 L196 360 L196 340 L206 340 L206 322 L238 322 L238 340 L248 340 L248 360 L256 360 L256 560 M116 170 A24 24 0 0 1 164 170 M124 170 A16 16 0 0 1 156 170 M132 170 A8 8 0 0 1 148 170 M140 146 V64" fill="none" stroke="#d4b26a" strokeWidth="1.2" />
    <path d="M124 196 V560 M132 196 V560 M140 196 V560 M148 196 V560 M156 196 V560 M48 316 V560 M56 316 V560 M64 316 V560 M214 348 V560 M222 348 V560 M230 348 V560" fill="none" stroke="#b8913f" strokeWidth="0.8" opacity="0.6" />
  </svg>
);

/** Stepped corner ornament (24 x 24). corner = 'tl' | 'tr' | 'bl' | 'br'. */
const FLIP = { tl: 'none', tr: 'scaleX(-1)', bl: 'scaleY(-1)', br: 'scale(-1, -1)' };
export const Corner = ({ corner = 'tl', style, ...p }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" style={{ transform: FLIP[corner], ...style }} {...p}>
    <path d="M1 23V9h4V5h4V1h14M5.5 23V13.5h4V9.5h4V5.5h9.5" fill="none" stroke="#d4b26a" strokeWidth="1.1" />
  </svg>
);

/** Chevron band: use the CSS in Appendix A.2, or this 1280-wide strip (12px tall, preserveAspectRatio none). */
export const Chevron = (p) => (
  <svg viewBox="0 0 1280 12" preserveAspectRatio="none" aria-hidden="true" {...p}>
    <path d="M0 11 L12 1 L24 11 L36 1 L48 11 L60 1 L72 11 L84 1 L96 11 L108 1 L120 11 L132 1 L144 11 L156 1 L168 11 L180 1 L192 11 L204 1 L216 11 L228 1 L240 11 L252 1 L264 11 L276 1 L288 11 L300 1 L312 11 L324 1 L336 11 L348 1 L360 11 L372 1 L384 11 L396 1 L408 11 L420 1 L432 11 L444 1 L456 11 L468 1 L480 11 L492 1 L504 11 L516 1 L528 11 L540 1 L552 11 L564 1 L576 11 L588 1 L600 11 L612 1 L624 11 L636 1 L648 11 L660 1 L672 11 L684 1 L696 11 L708 1 L720 11 L732 1 L744 11 L756 1 L768 11 L780 1 L792 11 L804 1 L816 11 L828 1 L840 11 L852 1 L864 11 L876 1 L888 11 L900 1 L912 11 L924 1 L936 11 L948 1 L960 11 L972 1 L984 11 L996 1 L1008 11 L1020 1 L1032 11 L1044 1 L1056 11 L1068 1 L1080 11 L1092 1 L1104 11 L1116 1 L1128 11 L1140 1 L1152 11 L1164 1 L1176 11 L1188 1 L1200 11 L1212 1 L1224 11 L1236 1 L1248 11 L1260 1 L1272 11" fill="none" stroke="#b8913f" strokeWidth="1" />
  </svg>
);
