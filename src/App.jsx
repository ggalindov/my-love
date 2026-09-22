import React, { useState } from 'react';
import IntroTypewriter from './components/IntroTypewriter';
import FlowerLoader from './components/FlowerLoader';
import Garden from './components/Garden';
import LoveLetter from './components/LoveLetter';

export default function App() {
  const [phase, setPhase] = useState(0);
  const [fading, setFading] = useState(false);

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
      {phase === 0 && (
        <IntroTypewriter
          onComplete={next}
        />
      )}
      {phase === 1 && (
        <FlowerLoader
          onComplete={next}
        />
      )}
      {phase === 2 && (
        <Garden
          onComplete={next}
        />
      )}
      {phase === 3 && (
        <LoveLetter />
      )}
    </div>
  );
}
