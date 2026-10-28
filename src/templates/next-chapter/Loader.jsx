import { useEffect, useRef, useState } from 'react';
import { Layer, useInvite, useMusic } from '../kit/index.js';
import { Monogram } from './motifs.jsx';

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mostly linear with a quick start and a gentle finish, like a real download.
const curve = (t) => 0.55 * t + 0.45 * (1 - (1 - t) ** 3);

/** Resolves when the fonts and the hero photo are in (or after `ms`, whichever comes first). */
function whenReady(image, ms) {
  const fonts = document.fonts?.ready || Promise.resolve();
  const photo = image
    ? new Promise((res) => {
        const img = new Image();
        img.onload = res;
        img.onerror = res;
        img.src = image;
      })
    : Promise.resolve();
  return Promise.race([Promise.all([fonts, photo]), new Promise((res) => setTimeout(res, ms))]);
}

/**
 * Starts the music on the guest's first tap or key press, since browsers only allow sound after one.
 * Taps on the music button itself are left to that button.
 */
function useMusicOnFirstGesture(player) {
  useEffect(() => {
    if (!player) return undefined;
    let done = false;
    const stop = () => {
      done = true;
      window.removeEventListener('pointerdown', go, true);
      window.removeEventListener('keydown', go, true);
      unsub();
    };
    function go(e) {
      if (done) return;
      if (e.target?.closest?.('.k-music')) return stop();
      if (!player.playing) player.play();
      stop();
    }
    const unsub = player.subscribe(() => !done && stop());
    window.addEventListener('pointerdown', go, true);
    window.addEventListener('keydown', go, true);
    return stop;
  }, [player]);
}

/**
 * The opening screen: a "G/A" monogram over blurred foliage, and a bronze line that fills as the
 * invitation loads, counting 0 → 100 %. At 100 % it fades away by itself and calls `onReveal`.
 */
export default function Loader({ names, letters, eyebrow = 'A new chapter begins', line = 'Loading our love story…', image, background, onReveal }) {
  const { mode, gate } = useInvite();
  const player = useMusic();
  const active = mode !== 'thumb' && gate !== false;
  const [phase, setPhase] = useState(active ? 'loading' : 'gone'); // loading → leaving → gone
  const [pct, setPct] = useState(0);
  const bar = useRef(null);
  const revealRef = useRef(onReveal);
  revealRef.current = onReveal;

  useMusicOnFirstGesture(player);

  // Keep the page still and out of the tab order until the loader has gone.
  useEffect(() => {
    if (phase !== 'loading') return undefined;
    const root = document.getElementById('top');
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    if (root) root.inert = true;
    return () => {
      html.style.overflow = prev;
      if (root) root.inert = false;
    };
  }, [phase]);

  useEffect(() => {
    if (!active) return undefined;
    const calm = reduced();
    const duration = calm ? 900 : 3000;
    let ready = false;
    let raf = 0;
    let shown = 0;
    let last = performance.now();
    const start = last;
    const timers = [];
    whenReady(image, 7000).then(() => {
      ready = true;
    });

    const frame = (now) => {
      const dt = now - last;
      last = now;
      const t = Math.min(1, (now - start) / duration);
      const goal = ready ? curve(t) : Math.min(curve(t), 0.94);
      // Ease the shown value toward the goal so the line never jumps.
      shown += (goal - shown) * (calm ? 1 : 1 - Math.exp(-dt / 140));
      if (goal === 1 && shown > 0.997) shown = 1;
      if (bar.current) bar.current.style.transform = `scaleX(${shown.toFixed(4)})`;
      setPct(Math.round(shown * 100));
      if (shown < 1) {
        raf = requestAnimationFrame(frame);
        return;
      }
      timers.push(
        setTimeout(() => {
          window.scrollTo(0, 0);
          setPhase('leaving');
          revealRef.current?.();
          timers.push(setTimeout(() => setPhase('gone'), calm ? 350 : 1250));
        }, calm ? 120 : 420)
      );
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(clearTimeout);
    };
  }, [active, image]);

  if (phase === 'gone') return null;

  return (
    <Layer>
      <div
        className={`nc-loader${phase === 'leaving' ? ' is-leaving' : ''}`}
        style={background ? { '--nc-loader-img': `url("${background}")` } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={`${names}: invitation loading`}
      >
        <div className="nc-loader-bg" aria-hidden="true" />
        <div className="nc-loader-in">
          <Monogram a={letters[0]} b={letters[1]} className="nc-loader-mono" />
          <p className="nc-loader-eyebrow">{eyebrow}</p>
          <div className="nc-loader-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Loading">
            <span ref={bar} />
          </div>
          <p className="nc-loader-line">{line}</p>
          <p className="nc-loader-pct" aria-hidden="true">
            {String(pct).padStart(2, '0')}
            <small>%</small>
          </p>
        </div>
      </div>
    </Layer>
  );
}
