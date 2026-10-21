import { useEffect, useState } from 'react';
import { Layer } from './context.jsx';

/** Floating play/pause button for the invitation's background music. */
export default function MusicButton({ player }) {
  const [playing, setPlaying] = useState(player.playing);
  useEffect(() => player.subscribe(setPlaying), [player]);

  return (
    <Layer>
      <button
        type="button"
        className={`k-music${playing ? ' is-playing' : ''}`}
        onClick={() => player.toggle()}
        aria-pressed={playing}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause music' : 'Play music'}
      >
        {playing ? (
          <span className="k-music-eq" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        ) : (
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 18V6.5l10-2.5v11.5" />
            <ellipse cx="6.6" cy="18" rx="2.4" ry="2" fill="currentColor" />
            <ellipse cx="16.6" cy="15.5" rx="2.4" ry="2" fill="currentColor" />
          </svg>
        )}
      </button>
    </Layer>
  );
}
