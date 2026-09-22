import React, { useState, useRef, useCallback } from 'react';
import FlowerLoader from './components/FlowerLoader';
import Garden from './components/Garden';
import LoveLetter from './components/LoveLetter';

export default function App() {
  const [phase, setPhase] = useState(0);
  const [fading, setFading] = useState(false);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = useCallback(() => {
    setPlaying(prev => {
      const next = !prev;
      const a = audioRef.current;
      if (a) {
        if (next) {
          a.play().catch(() => {});
        } else {
          a.pause();
        }
      }
      return next;
    });
  }, []);

  const next = () => {
    setFading(true);
    setTimeout(() => {
      setPhase(p => p + 1);
      setFading(false);
    }, 600);
  };

  return (
    <div style={{
      width: '100%', height: '100%', position: 'relative',
      opacity: fading ? 0 : 1,
      transition: 'opacity 0.6s ease',
    }}>
      {/* Reproductor de audio global para que la canción no se corte entre pantallas */}
      <audio ref={audioRef} src="/music/song.mp3" loop preload="auto" />

      {phase === 0 && (
        <FlowerLoader
          onComplete={next}
          audioRef={audioRef}
        />
      )}
      {phase === 1 && (
        <Garden
          onComplete={next}
          playing={playing}
          togglePlay={togglePlay}
        />
      )}
      {phase === 2 && (
        <LoveLetter
          playing={playing}
          togglePlay={togglePlay}
        />
      )}
    </div>
  );
}
