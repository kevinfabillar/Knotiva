// Maison motion: one scroll/frame scheduler, the easing helpers and the small hooks behind the signature moments.
// Every hook is a no-op (and writes its end state once) when `enabled` is false: reduced motion, thumbnails and
// the Customize preview all pass false.
import { useEffect } from 'react';

/* ------------------------------------------------------------------ Scheduler */

const subs = new Set();
let raf = 0;
const run = () => {
  raf = 0;
  subs.forEach((fn) => fn());
};
const kick = () => {
  if (!raf) raf = requestAnimationFrame(run);
};

/** Runs fn on every scroll/resize frame (and once now). Returns the unsubscribe function. */
export function onFrame(fn) {
  subs.add(fn);
  if (subs.size === 1) {
    addEventListener('scroll', kick, { passive: true });
    addEventListener('resize', kick);
  }
  kick();
  return () => {
    subs.delete(fn);
    if (!subs.size) {
      removeEventListener('scroll', kick);
      removeEventListener('resize', kick);
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

export const prefersReduced = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const easeInOutCubic = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);

/** The same curves as CSS cubic-bezier(). */
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const X = (t) => ((ax * t + bx) * t + cx) * t;
  const Y = (t) => ((ay * t + by) * t + cy) * t;
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i += 1) {
      const e = X(t) - x;
      if (Math.abs(e) < 1e-5) return Y(t);
      const d = dX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0;
    let hi = 1;
    t = x;
    while (hi - lo > 1e-5) {
      if (X(t) < x) lo = t;
      else hi = t;
      t = (lo + hi) / 2;
    }
    return Y(t);
  };
}

export const E = {
  glide: bezier(0.76, 0, 0.24, 1),
  lock: bezier(0.34, 1.56, 0.64, 1),
  seal: bezier(0.65, 0, 0.35, 1),
  zoom: bezier(0.7, 0, 0.84, 0),
  inout: bezier(0.42, 0, 0.58, 1),
};

/* ------------------------------------------------------------------ Surfacing (hero) */

/** Writes --p (0–1) on the hero and toggles .is-paper once the nav sits on paper. */
export function useHeroProgress(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!enabled) {
      el.style.setProperty('--p', '1');
      el.classList.add('is-paper');
      return undefined;
    }
    let last = -1;
    const off = onFrame(() => {
      const r = el.getBoundingClientRect();
      const extra = el.offsetHeight - innerHeight;
      const p = extra > 0 ? easeInOutCubic(clamp01(-r.top / (extra * 0.8))) : 1;
      const v = Math.round(p * 10000) / 10000;
      if (v === last) return;
      last = v;
      el.style.setProperty('--p', String(v));
      el.classList.toggle('is-paper', v >= 0.18);
    });
    return () => {
      off();
      el.style.removeProperty('--p');
    };
  }, [ref, enabled]);
}

/* ------------------------------------------------------------------ Foil sheen */

const tilt = { on: false, x: 0, listeners: new Set() };

/** Call inside the gate's tap: asks iOS for motion permission (same gesture) and starts listening to tilt. */
export function enableTilt() {
  if (tilt.on || typeof window === 'undefined' || !('DeviceOrientationEvent' in window) || prefersReduced()) return;
  if (!matchMedia('(pointer: coarse)').matches) return;
  const start = () => {
    tilt.on = true;
    addEventListener(
      'deviceorientation',
      (e) => {
        if (e.gamma == null) return;
        tilt.x = Math.max(-1, Math.min(1, e.gamma / 45));
        tilt.listeners.forEach((fn) => fn());
      },
      { passive: true }
    );
  };
  const ask = window.DeviceOrientationEvent.requestPermission;
  if (typeof ask === 'function') {
    ask()
      .then((s) => s === 'granted' && start())
      .catch(() => {});
  } else start();
}

/**
 * One sheen value per [data-foil] element: written as --ma-sheen (HTML foil) and as the gradientTransform of every
 * linearGradient[data-sheen] inside it (SVG foil). Driven by scroll position, the pointer (desktop) and tilt (phones).
 */
export function useSheen(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    const write = (el, v) => {
      el.style.setProperty('--ma-sheen', v.toFixed(3));
      el.querySelectorAll('linearGradient[data-sheen]').forEach((g) => {
        g.setAttribute('gradientTransform', `translate(${((v * 2 - 1) * Number(g.dataset.span || 0)).toFixed(1)} 0)`);
      });
    };
    if (!enabled) {
      root.querySelectorAll('[data-foil]').forEach((el) => write(el, 0.42));
      return undefined;
    }
    const items = new Map(); // el → { value, on }
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }),
      { rootMargin: '10% 0px' }
    );
    const watch = () =>
      root.querySelectorAll('[data-foil]').forEach((el) => {
        if (items.has(el)) return;
        items.set(el, { value: 0.42 });
        write(el, 0.42);
        io.observe(el);
      });
    watch();
    const mo = new MutationObserver(() => {
      watch();
      items.forEach((_, el) => {
        if (!el.isConnected) {
          items.delete(el);
          visible.delete(el);
          io.unobserve(el);
        }
      });
      step();
    });
    mo.observe(root, { childList: true, subtree: true });

    let pointerX = 0;
    let loop = 0;
    let last = 0;
    const step = () => {
      if (!loop) {
        last = performance.now();
        loop = requestAnimationFrame(tick);
      }
    };
    function tick(now) {
      loop = 0;
      const dt = Math.min(64, now - last || 16);
      last = now;
      const k = 1 - Math.exp(-dt / 220);
      let moving = false;
      visible.forEach((el) => {
        const s = items.get(el);
        if (!s) return;
        const r = el.getBoundingClientRect();
        const target = clamp01(0.5 - (r.top + r.height / 2 - innerHeight / 2) / innerHeight) + pointerX * 0.08 + (tilt.on ? tilt.x * 0.12 : 0);
        const d = target - s.value;
        if (Math.abs(d) < 0.002) return;
        s.value += d * k;
        write(el, s.value);
        moving = true;
      });
      if (moving) step();
    }
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return;
      pointerX = (e.clientX / innerWidth - 0.5) * 2;
      step();
    };
    addEventListener('pointermove', onMove, { passive: true });
    tilt.listeners.add(step);
    const off = onFrame(step);
    return () => {
      off();
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(loop);
      removeEventListener('pointermove', onMove);
      tilt.listeners.delete(step);
    };
  }, [rootRef, enabled]);
}

/* ------------------------------------------------------------------ Parallax and the programme line */

/** Drifts the image inside every on-screen [data-parallax] figure by up to ±40px (--ma-par). */
export function useParallax(rootRef, enabled) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return undefined;
    const figs = [...root.querySelectorAll('[data-parallax]')];
    const visible = new Set();
    const io = new IntersectionObserver((entries) => entries.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))));
    figs.forEach((f) => io.observe(f));
    const off = onFrame(() => {
      visible.forEach((f) => {
        const r = f.getBoundingClientRect();
        const q = clamp01((innerHeight - r.top) / (innerHeight + r.height));
        const max = Math.min(40, r.height * 0.06);
        f.style.setProperty('--ma-par', `${((0.5 - q) * 2 * max).toFixed(1)}px`);
      });
    });
    return () => {
      off();
      io.disconnect();
    };
  }, [rootRef, enabled]);
}

/** Writes --q (0–1) on the programme list as it crosses 60% of the viewport. */
export function useProgress(listRef, enabled) {
  useEffect(() => {
    const el = listRef.current;
    if (!el) return undefined;
    if (!enabled) {
      el.style.setProperty('--q', '1');
      return undefined;
    }
    let last = -1;
    const off = onFrame(() => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) return;
      const q = Math.round(clamp01((innerHeight * 0.6 - r.top) / r.height) * 1000) / 1000;
      if (q !== last) el.style.setProperty('--q', String((last = q)));
    });
    return off;
  }, [listRef, enabled]);
}

/* ------------------------------------------------------------------ The lookbook */

/**
 * Desktop (≥ 961px, motion allowed): pins the stage and turns vertical scroll into the track's sideways travel.
 * Elsewhere the track is a native swipe row (or, with reduced motion on desktop, a grid) and the counter follows
 * its scrollLeft. `setIndex(i)` receives the plate number shown in the counter, `bar` gets scaleX(progress).
 */
export function useLookbook(sectionRef, stageRef, trackRef, barRef, countRef, n, enabled) {
  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!section || !stage || !track) return undefined;
    let pinned = false;
    let dist = 0;
    let lastQ = -1;
    const show = (q) => {
      if (Math.abs(q - lastQ) < 0.0005) return;
      lastQ = q;
      if (barRef.current) barRef.current.style.transform = `scaleX(${(1 / n + q * (1 - 1 / n)).toFixed(4)})`;
      if (countRef.current) countRef.current.textContent = String(Math.round(q * (n - 1)) + 1).padStart(2, '0');
    };
    const measure = () => {
      const wide = section.offsetWidth >= 961;
      const pin = enabled && wide;
      if (pin !== pinned) {
        pinned = pin;
        section.classList.toggle('is-pinned', pin);
        if (!pin) {
          section.style.height = '';
          track.style.transform = '';
        }
      }
      if (pinned) {
        dist = Math.max(0, track.scrollWidth - stage.clientWidth);
        section.style.height = `calc(100svh + ${dist}px)`;
      }
      lastQ = -1;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(track);
    track.querySelectorAll('img').forEach((img) => !img.complete && img.addEventListener('load', measure, { once: true }));

    const off = onFrame(() => {
      if (!pinned) return;
      const r = section.getBoundingClientRect();
      if (r.bottom < -100 || r.top > innerHeight + 100) return;
      const q = dist ? clamp01(-r.top / dist) : 0;
      track.style.transform = `translate3d(${(-q * dist).toFixed(1)}px, 0, 0)`;
      show(q);
    });

    let rowRaf = 0;
    const onRow = () => {
      if (pinned || rowRaf) return;
      rowRaf = requestAnimationFrame(() => {
        rowRaf = 0;
        const max = track.scrollWidth - track.clientWidth;
        show(max > 0 ? clamp01(track.scrollLeft / max) : 0);
      });
    };
    track.addEventListener('scroll', onRow, { passive: true });
    show(0);
    return () => {
      off();
      ro.disconnect();
      cancelAnimationFrame(rowRaf);
      track.removeEventListener('scroll', onRow);
      section.classList.remove('is-pinned');
      section.style.height = '';
      track.style.transform = '';
    };
  }, [sectionRef, stageRef, trackRef, barRef, countRef, n, enabled]);
}
