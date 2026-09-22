/**
 * LoveLetter — Carta final de amor
 * Fiel al pen de Una (MwxmKW)
 * - Flores laterales situadas detrás de la tarjeta (z-index: -1) para que nunca tapen el texto
 * - Ambas flores (izquierda y derecha) visibles y animadas armónicamente
 * - Totalmente adaptable en móviles y pantallas grandes
 * - Cierre de la carta con animación y mensaje final de regalo de Dios
 */
import React, { useState, useEffect, useRef } from 'react';

const FINAL_MESSAGE = 'Nunca olvides que eres mi regalo de Dios y tenerte en mi vida es de las más grandes bendiciones, chaolín plín plín 💕';

const CSS = `
  @import url(https://fonts.googleapis.com/css?family=Lora:400italic);

  .ll-body {
    position: absolute;
    inset: 0;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  .ll-card {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 1.48em;
    color: #222;
    width: min(740px, 90%);
    padding: 3em 2.8em;
    text-align: center;
    position: relative;
    overflow: visible;
    background: white;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow:
      0 0 0 10px rgb(254, 199, 189),
      0 0 0 25px white,
      0 0 0 30px rgb(254, 199, 189);
    animation: cardIn 1s ease forwards;
    opacity: 0;
    z-index: 2;
  }

  .ll-card.closing {
    animation: cardOut 0.85s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;
    pointer-events: none;
  }

  .ll-card.closing::before,
  .ll-card.closing::after {
    animation: flOut 0.85s ease forwards !important;
  }

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes cardOut {
    0%   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
    100% { opacity: 0; transform: translateY(-24px) scale(0.9); filter: blur(4px); }
  }

  @keyframes flOut {
    0%   { opacity: 0.85; }
    100% { opacity: 0; transform: scale(0.92); }
  }

  /* Flores laterales ::before (izquierda) y ::after (derecha) */
  .ll-card::before,
  .ll-card::after {
    content: '';
    display: block;
    background-image: url('https://www.clipartbest.com/cliparts/MTL/e8k/MTLe8kkRc.png');
    background-size: contain;
    background-repeat: no-repeat;
    width: 800px;
    height: 650px;
    position: absolute;
    mix-blend-mode: luminosity;
    opacity: 0;
    pointer-events: none;
    z-index: -1;
  }

  .ll-card::before {
    top: 150px;
    left: -230px;
    animation: flIn 1.4s 0.3s ease forwards;
  }

  .ll-card::after {
    transform: rotateY(180deg);
    top: 150px;
    right: -230px;
    animation: flInR 1.4s 0.3s ease forwards;
  }

  @keyframes flIn {
    from { opacity: 0; }
    to   { opacity: 0.85; }
  }

  @keyframes flInR {
    from { opacity: 0; transform: rotateY(180deg); }
    to   { opacity: 0.85; transform: rotateY(180deg); }
  }

  /* Textos garantizados en capa superior */
  .ll-main, .ll-verse, .ll-closing, .ll-action {
    position: relative;
    z-index: 5;
  }

  .ll-main {
    font-size: .88em;
    line-height: 1.9;
    margin: 0;
    color: #333;
  }

  .ll-verse {
    font-size: .63em;
    display: block;
    padding-top: 1.2em;
    border-top: 1px solid lightpink;
    width: 84%;
    margin: 1.2em auto 0;
    color: #a05060;
    line-height: 1.75;
    font-style: italic;
  }

  .ll-closing {
    font-size: .63em;
    display: block;
    padding-top: 1.1em;
    border-top: 1px solid lightpink;
    width: 52%;
    margin: 1.1em auto 0;
    color: #c8637a;
  }

  /* Botón de cierre de carta */
  .ll-action {
    margin-top: 1.3em;
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 50;
    pointer-events: auto;
  }

  .ll-close-btn {
    position: relative;
    z-index: 51;
    pointer-events: auto;
    background: #ffffff;
    border: 1.5px solid #fb7185;
    color: #be123c;
    font-weight: 600;
    padding: 8px 24px;
    border-radius: 9999px;
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 0.62em;
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(225, 29, 72, 0.16);
    transition: all 0.2s ease;
    user-select: none;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  .ll-close-btn:hover {
    background: #fff1f2;
    border-color: #f43f5e;
    color: #9f1239;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(225, 29, 72, 0.24);
  }

  .ll-close-btn:active {
    transform: scale(0.94);
    background: #ffe4e6;
  }

  /* Pantalla final con mensaje */
  .ll-final-wrap {
    position: absolute;
    inset: 0;
    background: #ffffff;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
    animation: finalFadeIn 0.8s ease forwards;
    z-index: 10;
  }

  @keyframes finalFadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to   { opacity: 1; transform: scale(1); }
  }

  .ll-final-box {
    max-width: 520px;
    width: 90%;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .ll-final-icon {
    font-size: 2.2rem;
    margin-bottom: 22px;
    animation: iconFloat 3s ease-in-out infinite alternate;
  }

  @keyframes iconFloat {
    0%   { transform: translateY(0) scale(1); }
    100% { transform: translateY(-6px) scale(1.06); }
  }

  .ll-final-text {
    font-family: 'Lora', Georgia, serif;
    font-style: italic;
    font-size: clamp(1.22rem, 4.4vw, 1.65rem);
    line-height: 1.85;
    color: #262626;
    margin: 0;
    min-height: 110px;
    letter-spacing: 0.01em;
    text-wrap: balance;
  }

  .ll-final-cursor {
    display: inline-block;
    width: 2px;
    height: 1.15em;
    background-color: #e11d48;
    margin-left: 4px;
    vertical-align: -0.15em;
    animation: finalBlink 0.9s infinite;
  }

  .ll-final-cursor.hidden {
    opacity: 0;
    animation: none;
  }

  @keyframes finalBlink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }

  .ll-reopen-wrap {
    margin-top: 34px;
    transition: opacity 0.6s ease, transform 0.6s ease;
  }

  .ll-reopen-btn {
    background: transparent;
    border: 1px solid rgba(225, 29, 72, 0.35);
    color: #c8405d;
    padding: 8px 22px;
    border-radius: 9999px;
    font-family: 'Lora', Georgia, serif;
    font-style: italic;
    font-size: clamp(0.85rem, 3.2vw, 0.95rem);
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(225, 29, 72, 0.08);
    transition: all 0.3s ease;
    touch-action: manipulation;
  }

  .ll-reopen-btn:hover {
    background: rgba(225, 29, 72, 0.06);
    border-color: rgba(225, 29, 72, 0.6);
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(225, 29, 72, 0.14);
  }

  .ll-reopen-btn:active {
    transform: scale(0.96);
  }

  /* Adaptación responsive para móviles y tablets */
  @media (max-width: 680px) {
    .ll-card {
      width: 90%;
      padding: 2.1em 1.3em 2.2em;
      font-size: clamp(1.05em, 3.8vw, 1.25em);
      margin-top: -32px;
      box-shadow:
        0 0 0 6px rgb(254, 199, 189),
        0 0 0 14px white,
        0 0 0 18px rgb(254, 199, 189);
    }
    .ll-card::before,
    .ll-card::after {
      width: 520px;
      height: 430px;
    }
    .ll-card::before {
      top: 255px;
      left: -165px;
    }
    .ll-card::after {
      top: 255px;
      right: -165px;
    }
    .ll-main {
      line-height: 1.78;
    }
    .ll-verse {
      width: 88%;
      margin: 1.25em auto 0;
      padding-top: 1.1em;
    }
    .ll-closing {
      width: 60%;
      margin: 1.05em auto 0;
      padding-top: 1em;
    }
    .ll-action {
      margin-top: 1.15em;
      position: relative;
      z-index: 50;
    }
    .ll-close-btn {
      font-size: 0.68em;
      padding: 9px 24px;
      touch-action: manipulation;
    }
    .ll-final-text {
      font-size: clamp(1.15rem, 4.2vw, 1.45rem);
      line-height: 1.8;
    }
  }
`;

export default function LoveLetter() {
  const [stage, setStage] = useState('open'); // 'open' | 'closing' | 'final'
  const [finalText, setFinalText] = useState('');
  const [finalDone, setFinalDone] = useState(false);
  const finalIndexRef = useRef(0);
  const closingRef = useRef(false);

  const handleClose = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (closingRef.current) return;
    closingRef.current = true;
    setStage('closing');
    setTimeout(() => {
      setStage('final');
      setFinalText('');
      setFinalDone(false);
      finalIndexRef.current = 0;
    }, 800);
  };

  const handleReopen = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    closingRef.current = false;
    setStage('open');
  };

  useEffect(() => {
    if (stage !== 'final') return;

    let timeoutId;
    const typeNext = () => {
      if (finalIndexRef.current < FINAL_MESSAGE.length) {
        const char = FINAL_MESSAGE[finalIndexRef.current];
        finalIndexRef.current += 1;
        setFinalText(FINAL_MESSAGE.slice(0, finalIndexRef.current));

        let delay = 40;
        if (char === ',') delay = 260;
        else if (char === '.') delay = 400;

        timeoutId = setTimeout(typeNext, delay);
      } else {
        setFinalDone(true);
      }
    };

    timeoutId = setTimeout(typeNext, 400);
    return () => clearTimeout(timeoutId);
  }, [stage]);

  const handleFinalClick = () => {
    if (stage === 'final' && !finalDone) {
      finalIndexRef.current = FINAL_MESSAGE.length;
      setFinalText(FINAL_MESSAGE);
      setFinalDone(true);
    }
  };

  return (
    <div className="ll-body">
      <style>{CSS}</style>

      {/* Tarjeta central elegante (cuando está abierta o cerrándose) */}
      {stage !== 'final' && (
        <div className={`ll-card ${stage === 'closing' ? 'closing' : ''}`}>
          <p className="ll-main">
            Le pido a Dios día a día que me dé más sabiduría
            para aprender a amarte de la manera correcta.<br /><br />
            No quiero únicamente amarte, sino que cada día
            pueda entenderte más, cuidarte, conocerte
            y jamás hacerte dudar de cuánto te amo.
          </p>

          <span className="ll-verse">
            «Las muchas aguas no podrán apagar el amor que siento por ti,
            ni lo ahogarán los ríos»<br />
            <strong>— Cantares 8:7</strong>
          </span>

          <span className="ll-closing">
            Te amo.<br />
            Eternamente, Juan David 💕
          </span>

          {/* Botón funcional para cerrar la carta */}
          <div className="ll-action">
            <button
              type="button"
              className="ll-close-btn"
              onClick={handleClose}
              onTouchEnd={handleClose}
              aria-label="Cerrar carta"
            >
              Cerrar carta 💌
            </button>
          </div>
        </div>
      )}

      {/* Pantalla final con mensaje especial tras cerrar la carta */}
      {stage === 'final' && (
        <div className="ll-final-wrap" onClick={handleFinalClick}>
          <div className="ll-final-box">
            <div className="ll-final-icon">✨ 🧸 💕</div>
            <p className="ll-final-text">
              {finalText}
              <span className={`ll-final-cursor ${finalDone ? 'hidden' : ''}`} />
            </p>

            {finalDone && (
              <div className="ll-reopen-wrap">
                <button
                  type="button"
                  className="ll-reopen-btn"
                  onClick={handleReopen}
                >
                  Reabrir carta 💌
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
