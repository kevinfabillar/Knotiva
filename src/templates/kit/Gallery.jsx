import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../shared/Icon.jsx';
import { Layer } from './context.jsx';

/** Full-screen photo viewer: arrows, swipe, keyboard, and a counter. */
export function Lightbox({ images, index, onIndex, onClose }) {
  const start = useRef(null);
  const swiped = useRef(false);
  const n = images.length;
  const go = useCallback((d) => onIndex((index + d + n) % n), [index, n, onIndex]);

  useEffect(() => {
    const key = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', key);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', key);
      document.documentElement.style.overflow = prev;
    };
  }, [go, onClose]);

  const img = images[index];
  return (
    <Layer>
      <div
        className="k-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label="Photo viewer"
        onPointerDown={(e) => {
          start.current = e.clientX;
          swiped.current = false;
        }}
        onPointerUp={(e) => {
          if (start.current == null) return;
          const dx = e.clientX - start.current;
          start.current = null;
          if (Math.abs(dx) > 50) {
            swiped.current = true;
            go(dx < 0 ? 1 : -1);
          }
        }}
        onClick={(e) => e.target === e.currentTarget && !swiped.current && onClose()}
      >
        <img key={img.src} src={img.src} alt={img.alt || ''} draggable="false" />
        <p className="k-lb-count">
          {index + 1} / {n}
        </p>
        <button type="button" className="k-lb-x" onClick={onClose} aria-label="Close">
          <Icon name="close" size={22} stroke={1.5} />
        </button>
        {n > 1 && (
          <>
            <button type="button" className="k-lb-prev" onClick={() => go(-1)} aria-label="Previous photo">
              <Icon name="left" size={26} stroke={1.4} />
            </button>
            <button type="button" className="k-lb-next" onClick={() => go(1)} aria-label="Next photo">
              <Icon name="right" size={26} stroke={1.4} />
            </button>
          </>
        )}
        {images
          .filter((_, i) => i === (index + 1) % n || i === (index - 1 + n) % n)
          .map((p) => (
            <link key={p.src} rel="prefetch" href={p.src} as="image" />
          ))}
      </div>
    </Layer>
  );
}

/** Lets any custom gallery open the shared lightbox. */
export function useLightbox(images) {
  const [index, setIndex] = useState(-1);
  const node = index >= 0 ? <Lightbox images={images} index={index} onIndex={setIndex} onClose={() => setIndex(-1)} /> : null;
  return { open: setIndex, node };
}

/**
 * Photo gallery that opens a lightbox.
 * variant 'grid' (equal tiles), 'masonry' (natural heights), 'carousel' (swipeable row)
 * images = [{ src, alt }]
 */
export function Gallery({ images, variant = 'grid', className = '' }) {
  const lb = useLightbox(images);
  const track = useRef(null);

  const nudge = (d) => {
    const el = track.current;
    if (!el) return;
    const item = el.querySelector('button');
    el.scrollBy({ left: d * (item ? item.offsetWidth + 12 : el.clientWidth * 0.8), behavior: 'smooth' });
  };

  return (
    <div className={`k-gallery k-gallery--${variant} ${className}`}>
      <div className="k-gallery-track" ref={track}>
        {images.map((img, i) => (
          <button key={img.src} type="button" className={`k-gallery-item rv d${(i % 4) + 1}`} onClick={() => lb.open(i)} aria-label={`Open photo ${i + 1}`}>
            <img src={img.src} alt={img.alt || ''} loading="lazy" />
          </button>
        ))}
      </div>
      {variant === 'carousel' && images.length > 2 && (
        <div className="k-gallery-arrows">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous photos">
            <Icon name="left" size={20} stroke={1.5} />
          </button>
          <button type="button" onClick={() => nudge(1)} aria-label="Next photos">
            <Icon name="right" size={20} stroke={1.5} />
          </button>
        </div>
      )}
      {lb.node}
    </div>
  );
}
