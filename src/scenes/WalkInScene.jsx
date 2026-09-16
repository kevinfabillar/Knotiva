import { useCallback, useRef } from 'react';
import ThreeDStage from '../components/ThreeDStage.jsx';
import { startWalkIn } from './walkIn.js';

const bubbleStyle = {
  position: 'absolute',
  left: 0,
  top: 0,
  width: 'min(330px, 42vw)',
  padding: '20px 22px 22px',
  background: '#fbf7ef',
  border: '2px solid #2b3a4f',
  borderRadius: 18,
  boxShadow: '6px 7px 0 rgba(43,58,79,0.16)',
  fontFamily: "'Libre Baskerville', Georgia, serif",
  color: '#2b3a4f',
  opacity: 0,
  transformOrigin: '12% 100%',
  pointerEvents: 'none',
};

const askStyle = { display: 'block', fontWeight: 700, fontSize: 19, lineHeight: 1.35 };

const pitchStyle = { display: 'block', marginTop: 10, fontSize: 15, lineHeight: 1.55, color: '#47566b' };

const tailStyle = {
  position: 'absolute',
  left: 26,
  bottom: -13,
  width: 22,
  height: 22,
  background: '#fbf7ef',
  borderRight: '2px solid #2b3a4f',
  borderBottom: '2px solid #2b3a4f',
  transform: 'rotate(52deg) skewX(-8deg)',
  borderBottomRightRadius: 5,
};

const hudStyle = {
  position: 'absolute',
  left: 28,
  top: 26,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  fontFamily: "'IBM Plex Mono', ui-monospace, monospace",
  color: '#7b7266',
};

export default function WalkInScene({ embed = false, showHud = false, onController }) {
  const bubbleRef = useRef(null);
  const askRef = useRef(null);
  const pitchRef = useRef(null);

  const handleReady = useCallback(
    (stage, THREE) => {
      const controller = startWalkIn(THREE, stage, {
        embed,
        bubble: bubbleRef.current,
        askEl: askRef.current,
        pitchEl: pitchRef.current,
      });
      onController?.(controller);
      return () => controller.stop();
    },
    [embed, onController]
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <ThreeDStage
        name="knotiva-mascot"
        background="#f4f0e9"
        onReady={handleReady}
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      {showHud && (
        <div style={hudStyle}>
          <div style={{ fontFamily: "'Libre Baskerville', Georgia, serif", fontSize: 20, color: '#2b3a4f' }}>
            Knotiva
          </div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            walk-in · wave · pitch
          </div>
        </div>
      )}
      <div ref={bubbleRef} style={bubbleStyle}>
        <span ref={askRef} style={askStyle} />
        <span ref={pitchRef} style={pitchStyle} />
        <span style={tailStyle} />
      </div>
    </div>
  );
}
