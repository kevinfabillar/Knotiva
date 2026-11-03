import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Layer, useInvite, useMusic } from '../kit/index.js';
import { MONO, Speaker, UnionStage, findAnchor, inkOf, monoLayout, toRoman } from './motifs.jsx';
import { E, clamp01, enableTilt, prefersReduced } from './motion.js';
import { formalDay, seatsLine, yearWords } from './words.js';

const lerp = (a, b, k) => a + (b - a) * k;
const lerpPt = (p, q, k) => ({ x: lerp(p.x, q.x, k), y: lerp(p.y, q.y, k) });

/** Resolves once both Noto Serif Display cuts are really in (the Google stylesheet may still be loading), or after `ms`. */
function fontsReady(ms) {
  const faces = ["300 300px 'Noto Serif Display'", "italic 300 300px 'Noto Serif Display'"];
  const until = performance.now() + ms;
  return new Promise((resolve) => {
    const tryLoad = () => {
      if (!document.fonts) return resolve();
      Promise.all(faces.map((f) => document.fonts.load(f)))
        .catch(() => {})
        .then(() => {
          if (faces.every((f) => document.fonts.check(f)) || performance.now() > until) resolve();
          else setTimeout(tryLoad, 100);
        });
    };
    tryLoad();
  });
}

/** Rest, locked and seal geometry for a viewport (§8.3). */
function geometry(w, h, a, b) {
  const phone = w <= 640;
  const size = phone ? Math.min(230, w * 0.59) : Math.min(300, h * 0.375, w * 0.234);
  const s = size / 1000;
  const L = monoLayout(a, b);
  const cx = w / 2;
  const cy = h / 2;
  const end = {
    A: { x: cx + L.ax * s, y: cy + L.by * s },
    B: { x: cx + L.bx * s, y: cy + (L.by + MONO.dropB) * s },
  };
  const margin = phone ? 24 : 80;
  // On short phones keep a descending second initial (J, Q) clear of the date lines at the bottom.
  const descB = Math.max(0, inkOf(b, true)[3]) * s * MONO.scaleB;
  const rest = phone
    ? {
        A: { x: margin - inkOf(a)[0] * s, y: h * 0.374 },
        B: { x: w - margin - inkOf(b, true)[1] * s * MONO.scaleB, y: Math.min(h * 0.732, h - 168 - descB) },
      }
    : {
        A: { x: margin - inkOf(a)[0] * s, y: end.A.y },
        B: { x: w - margin - inkOf(b, true)[1] * s * MONO.scaleB, y: end.B.y },
      };
  const ringR = Math.min(1.1 * size, 0.47 * Math.min(w, h));
  return { w, h, phone, size, cx, cy, end, rest, ringR };
}

const AT_REST = { gapOn: 0, foil: 1, zoom: 1, sheen: 0.1, fade: 1, sealDraw: 0, textOn: 0, k: 0 };

/**
 * The Union: Maison's opening gate. Two foil initials stand at the margins of a bordeaux lacquer field; on tap they
 * glide together, lock into the house monogram, the seal draws, then the letters turn into windows onto the hero
 * and the camera flies through a stroke. Rendered as TemplateRoot's first child (no `gate` prop).
 */
export default function Union({ D, letters, heroSrc, onArrive, onDone }) {
  const { mode, gate, guest } = useInvite();
  const player = useMusic();
  const active = mode !== 'thumb' && gate !== false;
  const [a, b] = letters;
  const [phase, setPhase] = useState(active ? 'loading' : 'gone'); // loading → rest → go → leaving → gone
  const [geo, setGeo] = useState(() => (typeof window === 'undefined' ? null : geometry(innerWidth, innerHeight, a, b)));
  const [anchor, setAnchor] = useState(null);
  const [v, setV] = useState(AT_REST); // animated values; v.k is the glide progress
  const phaseRef = useRef(phase);
  phaseRef.current = phase;
  const cbs = useRef({ onArrive, onDone });
  cbs.current = { onArrive, onDone };
  const timers = useRef([]);
  const raf = useRef(0);

  // Thumbnails and ?cover=off: nothing to show.
  useEffect(() => {
    if (!active) cbs.current.onDone?.();
  }, [active]);

  // Keep the page still and out of the tab order until the gate has gone (as next-chapter's Loader).
  useEffect(() => {
    if (!active || phase === 'gone') return undefined;
    const root = document.getElementById('top');
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = 'hidden';
    if (root) root.inert = true;
    return () => {
      html.style.overflow = prev;
      if (root) root.inert = false;
    };
  }, [active, phase === 'gone']); // eslint-disable-line react-hooks/exhaustive-deps

  // Fonts (raced against 2.5 s) and the hero photo.
  const heroLoaded = useRef(false);
  useEffect(() => {
    if (!active) return undefined;
    let alive = true;
    const img = new Image();
    img.onload = img.onerror = () => {
      heroLoaded.current = true;
    };
    img.src = heroSrc;
    fontsReady(2500).then(() => alive && setPhase((p) => (p === 'loading' ? 'rest' : p)));
    return () => {
      alive = false;
    };
  }, [active, heroSrc]);

  // Geometry and fly-through anchor: on fonts loaded, and on resize while at rest.
  useLayoutEffect(() => {
    if (!active || phase !== 'rest') return undefined;
    const measure = () => {
      const g = geometry(innerWidth, innerHeight, a, b);
      setGeo(g);
      try {
        setAnchor(findAnchor({ w: g.w, h: g.h, a, b, size: g.size, A: g.end.A, B: g.end.B, center: { x: g.cx, y: g.cy } }));
      } catch {
        setAnchor({ x: g.cx, y: g.cy, r: 1, zoomEnd: 48 });
      }
    };
    measure();
    let t = 0;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(measure, 120);
    };
    addEventListener('resize', onResize);
    return () => {
      clearTimeout(t);
      removeEventListener('resize', onResize);
    };
  }, [active, phase, a, b]);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      timers.current.forEach(clearTimeout);
    },
    []
  );

  const finish = useCallback(() => {
    if (phaseRef.current === 'gone' || phaseRef.current === 'leaving') return;
    cancelAnimationFrame(raf.current);
    timers.current.forEach(clearTimeout);
    phaseRef.current = 'leaving';
    setPhase('leaving');
    window.scrollTo(0, 0);
    cbs.current.onArrive?.();
    cbs.current.onDone?.();
    timers.current.push(setTimeout(() => setPhase('gone'), 0));
  }, []);

  const begin = useCallback(() => {
    if (phaseRef.current !== 'rest' || !geo) return;
    phaseRef.current = 'go';
    setPhase('go');
    player?.play();
    navigator.vibrate?.(8);
    enableTilt();

    if (prefersReduced()) {
      // No glide, zoom or sheen: show the locked monogram with its seal, then cross-fade the gate out.
      setV({ ...AT_REST, k: 1, gapOn: 1, sealDraw: 1, textOn: 1, sheen: 0.42 });
      timers.current.push(
        setTimeout(() => {
          phaseRef.current = 'fading';
          setPhase('fading');
          cbs.current.onArrive?.();
          timers.current.push(setTimeout(finish, 400));
        }, 300)
      );
      return;
    }

    const zoomEnd = anchor?.zoomEnd || 48;
    let t0 = performance.now();
    let held = 0;
    let arrived = false;
    const frame = (now) => {
        let t = now - t0;
      // Hold at 2300 ms (up to 2 s more) until the hero photograph has loaded, so the windows never show paper.
      if (t > 2300 && !heroLoaded.current && held < 2000) {
        const over = t - 2300;
        held += over;
        t0 += over;
        t = 2300;
      }
      const k = E.glide(clamp01(t / 1100));
      const seal = E.seal(clamp01((t - 1300) / 700));
      const next = {
        k,
        gapOn: t < 1100 ? 0 : E.lock(clamp01((t - 1100) / 200)),
        sealDraw: seal,
        sheen: 0.1 + 0.8 * seal,
        textOn: clamp01((t - 1600) / 400),
        foil: 1 - E.inout(clamp01((t - 2300) / 250)),
        zoom: zoomEnd ** E.zoom(clamp01((t - 2550) / 1000)),
        fade: 1 - clamp01((t - 3300) / 250),
      };
      setV(next);
      if (!arrived && t >= 2550) {
        arrived = true;
        cbs.current.onArrive?.();
      }
      if (t >= 3550) {
        finish();
        return;
      }
      raf.current = requestAnimationFrame(frame);
    };
    raf.current = requestAnimationFrame(frame);
  }, [geo, anchor, player, finish]);

  // Escape skips straight to the end.
  useEffect(() => {
    if (!active || phase === 'gone') return undefined;
    const key = (e) => e.key === 'Escape' && finish();
    document.addEventListener('keydown', key);
    return () => document.removeEventListener('keydown', key);
  }, [active, phase === 'gone', finish]); // eslint-disable-line react-hooks/exhaustive-deps

  // Focus the button once the rest state is up.
  const btn = useRef(null);
  useEffect(() => {
    if (phase === 'rest') btn.current?.focus({ preventScroll: true });
  }, [phase]);

  if (!active || phase === 'gone' || !geo) return null;

  const g = geo;
  const A = lerpPt(g.rest.A, g.end.A, v.k);
  const B = lerpPt(g.rest.B, g.end.B, v.k);
  const year = D.start.slice(0, 4);
  const showStage = phase !== 'loading';

  return (
    <Layer>
      <link rel="preload" as="image" href={heroSrc} />
      <div
        className="ma-gate"
        data-phase={phase}
        role="dialog"
        aria-modal="true"
        aria-label={`Invitation from ${D.a} and ${D.b}`}
        onClick={begin}
        style={{ '--ma-gsize': `${g.size}px` }}
      >
        {phase === 'loading' && <i className="ma-gate-load" aria-hidden="true" />}
        {showStage && (
          <UnionStage
            w={g.w}
            h={g.h}
            a={a}
            b={b}
            size={g.size}
            A={A}
            B={B}
            gapOn={v.gapOn}
            foil={v.foil}
            zoom={v.zoom}
            ox={anchor?.x ?? g.cx}
            oy={anchor?.y ?? g.cy}
            sheen={v.sheen}
            fade={v.fade}
            seal={v.sealDraw > 0 ? { x: g.cx, y: g.cy, r: g.ringR, draw: v.sealDraw, text: `EST. ${toRoman(Number(year))}`, textOn: v.textOn } : null}
          />
        )}
        <div className="ma-gate-copy" aria-hidden={phase !== 'rest' && phase !== 'loading' ? 'true' : undefined}>
          {guest?.name && <p className="ma-gate-dear">Dear {guest.name},</p>}
          <p className="ma-gate-seats ma-cap">{seatsLine(guest)}</p>
          <p className="ma-gate-name ma-gate-name--a ma-cap">
            {D.a} {D.aLast}
          </p>
          <div className="ma-gate-amp ma-gate-amp--phone" aria-hidden="true">
            <i />
            <span className="ma-foil">&amp;</span>
            <i />
          </div>
          <p className="ma-gate-name ma-gate-name--b ma-cap">
            {D.b} {D.bLast}
          </p>
          <div className="ma-gate-mid">
            <p className="ma-gate-eyebrow ma-cap">The marriage of</p>
            <div className="ma-gate-amp" aria-hidden="true">
              <i />
              <span className="ma-foil">&amp;</span>
              <i />
            </div>
            <p className="ma-gate-date">{formalDay(D.start)}</p>
            <p className="ma-gate-year ma-cap">
              {yearWords(Number(year))} · {D.place}
            </p>
          </div>
          <button
            ref={btn}
            type="button"
            className="ma-gate-btn"
            onClick={(e) => {
              e.stopPropagation();
              begin();
            }}
          >
            Open the invitation
          </button>
          <p className="ma-gate-sound ma-cap">
            <Speaker /> Best with sound
          </p>
        </div>
      </div>
    </Layer>
  );
}
