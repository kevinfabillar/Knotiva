import { useEffect, useState } from 'react';
import { Layer } from './context.jsx';

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
};

/**
 * Phone-only top bar: monogram on the left, menu button on the right.
 * Transparent over the hero, solid once the guest scrolls past it. The menu is a full-screen sheet.
 * Templates hide their own desktop header on phones (class `k-topnav`).
 */
export default function MobileBar({ nav, monogram, rsvp, static: isStatic }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isStatic) return undefined;
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isStatic]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [open]);

  const go = (id) => (e) => {
    e.preventDefault();
    setOpen(false);
    setTimeout(() => scrollToId(id), 30);
  };

  return (
    <Layer>
      <div className={`k-mbar${solid ? ' is-solid' : ''}`}>
        <a href="#top" className="k-mbar-mono" onClick={go('top')}>
          {monogram}
        </a>
        <button type="button" className="k-mbar-btn" onClick={() => setOpen(true)} aria-expanded={open} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      </div>
      {open && (
        <div className="k-menu" role="dialog" aria-modal="true" aria-label="Menu">
          <button type="button" className="k-menu-x" onClick={() => setOpen(false)} aria-label="Close menu">
            <span />
            <span />
          </button>
          <p className="k-menu-mono">{monogram}</p>
          <nav className="k-menu-links">
            {nav.map(({ id, label }, i) => (
              <a key={id} href={`#${id}`} onClick={go(id)} style={{ animationDelay: `${60 + i * 45}ms` }}>
                {label}
              </a>
            ))}
          </nav>
          {rsvp && (
            <a href={`#${rsvp}`} className="k-menu-rsvp" onClick={go(rsvp)}>
              RSVP
            </a>
          )}
        </div>
      )}
    </Layer>
  );
}
