import { useEffect, useRef } from 'react';
import '../lib/three-d-stage.js';

export default function ThreeDStage({ name = 'model', background, autorotate, onReady, style }) {
  const elRef = useRef(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;

  useEffect(() => {
    const el = elRef.current;
    let cancelled = false;
    let teardown;

    el.ready.then(({ THREE }) => {
      if (cancelled) return;
      teardown = onReadyRef.current?.(el, THREE);
    });

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return (
    <three-d-stage
      ref={elRef}
      name={name}
      background={background}
      {...(autorotate ? { autorotate: '' } : {})}
      style={style}
    />
  );
}
