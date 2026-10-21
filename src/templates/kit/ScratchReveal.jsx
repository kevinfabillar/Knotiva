import { useEffect, useRef, useState } from 'react';

const BRUSH = 30;

/** One scratch-off circle. Calls onDone when about half the foil is cleared. */
function ScratchSpot({ value, label, revealed, onDone }) {
  const canvas = useRef(null);
  const down = useRef(false);
  const last = useRef(null);
  const moves = useRef(0);
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const size = el.clientWidth;
    el.width = size * dpr;
    el.height = size * dpr;
    const ctx = el.getContext('2d');
    ctx.scale(dpr, dpr);
    const css = getComputedStyle(el);
    const c1 = css.getPropertyValue('--g-foil-1').trim() || '#d8b46a';
    const c2 = css.getPropertyValue('--g-foil-2').trim() || '#f6e3b0';
    const g = ctx.createLinearGradient(0, 0, size, size);
    g.addColorStop(0, c1);
    g.addColorStop(0.45, c2);
    g.addColorStop(0.55, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
    // foil sparkle
    for (let i = 0; i < 160; i += 1) {
      ctx.fillStyle = `rgba(255,255,255,${(Math.random() * 0.35).toFixed(2)})`;
      ctx.fillRect(Math.random() * size, Math.random() * size, 1.4, 1.4);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.28)';
    ctx.font = `600 ${Math.round(size * 0.11)}px system-ui, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH', size / 2, size / 2);
  }, []);

  useEffect(() => {
    if (revealed && !cleared) setCleared(true);
  }, [revealed, cleared]);

  const check = () => {
    const el = canvas.current;
    const ctx = el.getContext('2d');
    const { width, height } = el;
    const data = ctx.getImageData(0, 0, width, height).data;
    let clear = 0;
    let total = 0;
    const cx = width / 2;
    const r2 = (width / 2) ** 2;
    for (let y = 0; y < height; y += 6) {
      for (let x = 0; x < width; x += 6) {
        if ((x - cx) ** 2 + (y - cx) ** 2 > r2) continue;
        total += 1;
        if (data[(y * width + x) * 4 + 3] < 40) clear += 1;
      }
    }
    if (total && clear / total > 0.48) {
      setCleared(true);
      onDone?.();
    }
  };

  const point = (e) => {
    const r = canvas.current.getBoundingClientRect();
    return [e.clientX - r.left, e.clientY - r.top];
  };

  const scratch = (e) => {
    const ctx = canvas.current.getContext('2d');
    const [x, y] = point(e);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH;
    ctx.beginPath();
    const [lx, ly] = last.current || [x - 0.1, y];
    ctx.moveTo(lx, ly);
    ctx.lineTo(x, y);
    ctx.stroke();
    last.current = [x, y];
    moves.current += 1;
    if (moves.current % 8 === 0) check();
  };

  return (
    <div className={`k-spot${cleared ? ' is-clear' : ''}`}>
      <div className="k-spot-face">
        <b>{value}</b>
        <span>{label}</span>
      </div>
      <canvas
        ref={canvas}
        className="k-spot-foil"
        aria-hidden="true"
        onPointerDown={(e) => {
          down.current = true;
          last.current = null;
          e.currentTarget.setPointerCapture(e.pointerId);
          scratch(e);
        }}
        onPointerMove={(e) => down.current && scratch(e)}
        onPointerUp={() => {
          down.current = false;
          check();
        }}
        onPointerCancel={() => {
          down.current = false;
        }}
      />
    </div>
  );
}

/**
 * Scratch-off date reveal for the opening gate.
 * items = [{ value: '14', label: 'Feb' }, ...]
 * A button reveals everything at once (keyboard and screen-reader friendly).
 */
export default function ScratchReveal({ items, button, onOpen }) {
  const [done, setDone] = useState(() => items.map(() => false));
  const all = done.every(Boolean);

  return (
    <div className={`k-scratch${all ? ' is-done' : ''}`}>
      <p className="k-scratch-hint">{all ? 'Save the date!' : 'Scratch to reveal the date'}</p>
      <div className="k-scratch-row">
        {items.map((it, i) => (
          <ScratchSpot
            key={it.label}
            value={it.value}
            label={it.label}
            revealed={done[i]}
            onDone={() => setDone((d) => d.map((v, j) => (j === i ? true : v)))}
          />
        ))}
      </div>
      {all && (
        <div className="k-confetti" aria-hidden="true">
          {Array.from({ length: 28 }, (_, i) => (
            <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--d': `${(i % 7) * 0.06}s`, '--r': `${(i * 53) % 360}deg` }} />
          ))}
        </div>
      )}
      <button
        type="button"
        className="k-gate-btn"
        onClick={() => (all ? onOpen() : setDone(items.map(() => true)))}
      >
        {all ? button : 'Reveal the date'}
      </button>
    </div>
  );
}
