import { useRef } from 'react';
import WalkInScene from '../scenes/WalkInScene.jsx';

export default function AnimationPage() {
  const controllerRef = useRef(null);

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', background: '#f4f0e9' }}>
      <WalkInScene
        showHud
        onController={(controller) => {
          controllerRef.current = controller;
        }}
      />
      <button
        type="button"
        className="btn-outline-dark"
        onClick={() => controllerRef.current?.replay()}
        style={{
          position: 'absolute',
          left: 28,
          bottom: 28,
          padding: '10px 18px',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#2b3a4f',
          background: '#fbf7ef',
          border: '1.5px solid #2b3a4f',
          borderRadius: 999,
          cursor: 'pointer',
        }}
      >
        Replay
      </button>
    </div>
  );
}
