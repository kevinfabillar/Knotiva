import { useEffect, useMemo, useRef, useState } from 'react';
import { ThemeContext, useInvite } from './context.jsx';
import { createMusic } from './music.js';
import Gate from './Gate.jsx';
import MobileBar from './MobileBar.jsx';
import MusicButton from './MusicButton.jsx';
import '../shared/base.css';
import './kit.css';

function useReveal(ref, enabled) {
  useEffect(() => {
    if (!enabled || !ref.current) return undefined;
    const root = ref.current;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.06 }
    );
    const watch = () => root.querySelectorAll('.rv:not(.in)').forEach((el) => io.observe(el));
    watch();
    // Some sections mount later (e.g. RSVP steps); keep watching for new .rv elements.
    const mo = new MutationObserver(watch);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [ref, enabled]);
}

/**
 * Root element for every template.
 *
 * - `className`  the template's root class (holds its CSS variables)
 * - `nav`        [{ id, label }] — section links for the phone menu
 * - `monogram`   short text for the phone bar, e.g. "N & L"
 * - `gate`       opening-screen options (see Gate.jsx); omit for no gate
 * - `music`      a built-in tune ('canon', 'reverie') or an audio file URL; omit for no music
 * - `rsvp`       id of the RSVP section (for the menu's RSVP button)
 *
 * The root is a size container, so templates lay out with container queries.
 * Elements with the class `rv` fade up as they scroll into view.
 */
export function TemplateRoot({ className, nav = [], monogram, gate, music, rsvp = 'rsvp', style, children }) {
  const { mode, gate: gateAllowed } = useInvite();
  const thumb = mode === 'thumb';
  const ref = useRef(null);
  const [open, setOpen] = useState(() => thumb || !gate || gateAllowed === false);
  const player = useMemo(() => (music && !thumb && typeof window !== 'undefined' ? createMusic(music) : null), [music, thumb]);

  useEffect(() => () => player?.destroy(), [player]);
  useReveal(ref, !thumb && open);

  // Keep the page still (and out of the tab order) while the gate is up.
  useEffect(() => {
    if (ref.current) ref.current.inert = !open;
    if (open) return undefined;
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  const theme = useMemo(() => ({ className, music: player }), [className, player]);

  return (
    <ThemeContext.Provider value={theme}>
      <div ref={ref} id="top" className={`tpl ${className}${thumb ? ' is-static' : ''}${open ? ' is-open' : ' is-gated'}`} style={style}>
        {children}
      </div>
      {nav.length > 0 && <MobileBar nav={nav} monogram={monogram} rsvp={rsvp} static={thumb} />}
      {player && open && <MusicButton player={player} />}
      {!open && (
        <Gate
          {...gate}
          onBegin={() => player?.play()}
          onOpen={() => {
            window.scrollTo(0, 0);
            setOpen(true);
          }}
        />
      )}
    </ThemeContext.Provider>
  );
}
