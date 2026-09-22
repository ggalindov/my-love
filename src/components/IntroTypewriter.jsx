import React, { useState, useEffect, useRef } from 'react';

const MESSAGE = 'Te amo mucho mi vida hermosa, aunque ahorita quizás sea difícil darte florecitas, te prometo que cuando sí te llenaré de las que más pueda, eres mi vida 💕';

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,400;1,500;1,600&display=swap');

  .intro-container {
    position: absolute;
    inset: 0;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    z-index: 50;
  }

  .intro-content {
    max-width: 540px;
    width: 90%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .intro-text {
    font-family: 'Lora', Georgia, serif;
    font-style: italic;
    font-size: clamp(1.22rem, 4.4vw, 1.7rem);
    line-height: 1.85;
    color: #262626;
    margin: 0;
    min-height: 120px;
    letter-spacing: 0.01em;
    text-wrap: balance;
  }

  .intro-cursor {
    display: inline-block;
    width: 2px;
    height: 1.15em;
    background-color: #e11d48;
    margin-left: 4px;
    vertical-align: -0.15em;
    animation: introBlink 0.9s infinite;
  }

  .intro-cursor.idle {
    opacity: 0;
    animation: none;
  }

  @keyframes introBlink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  .intro-btn-wrap {
    margin-top: 36px;
    min-height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.8s ease, transform 0.8s ease;
  }

  .intro-btn {
    background: transparent;
    border: 1px solid rgba(225, 29, 72, 0.35);
    color: #c8405d;
    padding: 9px 24px;
    border-radius: 9999px;
    font-family: 'Lora', Georgia, serif;
    font-style: italic;
    font-size: clamp(0.88rem, 3.2vw, 0.98rem);
    letter-spacing: 0.03em;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 14px rgba(225, 29, 72, 0.08);
    transition: all 0.3s ease;
  }

  .intro-btn:hover {
    background: rgba(225, 29, 72, 0.06);
    border-color: rgba(225, 29, 72, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(225, 29, 72, 0.14);
  }

  .intro-btn:active {
    transform: scale(0.96);
  }

  .intro-hint {
    margin-top: 14px;
    font-family: sans-serif;
    font-size: 11px;
    color: #a3a3a3;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
`;

export default function IntroTypewriter({ onComplete }) {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const indexRef = useRef(0);
  const completedRef = useRef(false);

  const handleFinish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    let timeoutId;

    const typeNextChar = () => {
      if (indexRef.current < MESSAGE.length) {
        const nextChar = MESSAGE[indexRef.current];
        indexRef.current += 1;
        setDisplayedText(MESSAGE.slice(0, indexRef.current));

        // Pausas naturales en puntuaciones
        let delay = 42;
        if (nextChar === ',') delay = 260;
        else if (nextChar === '.' || nextChar === '…') delay = 420;

        timeoutId = setTimeout(typeNextChar, delay);
      } else {
        setIsFinished(true);
        // Avance automático tras 3.6 segundos de terminar de leer
        timeoutId = setTimeout(handleFinish, 3600);
      }
    };

    timeoutId = setTimeout(typeNextChar, 500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleClickScreen = () => {
    if (!isFinished) {
      // Si el usuario toca mientras se escribe, completar todo el texto inmediatamente
      indexRef.current = MESSAGE.length;
      setDisplayedText(MESSAGE);
      setIsFinished(true);
    } else {
      // Si ya terminó de escribir, avanzar
      handleFinish();
    }
  };

  return (
    <div className="intro-container" onClick={handleClickScreen}>
      <style>{CSS}</style>

      <div className="intro-content">
        <p className="intro-text">
          {displayedText}
          <span className={`intro-cursor ${isFinished ? 'idle' : ''}`} />
        </p>

        <div
          className="intro-btn-wrap"
          style={{
            opacity: isFinished ? 1 : 0,
            transform: isFinished ? 'translateY(0)' : 'translateY(8px)',
            pointerEvents: isFinished ? 'auto' : 'none',
          }}
        >
          <button
            className="intro-btn"
            onClick={(e) => {
              e.stopPropagation();
              handleFinish();
            }}
          >
            Continuar con amor ✨
          </button>
        </div>

        {isFinished && (
          <span className="intro-hint">Toca en cualquier parte para continuar</span>
        )}
      </div>
    </div>
  );
}
