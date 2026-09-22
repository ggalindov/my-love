/**
 * LoveLetter — Carta final de amor
 * Fiel al pen de Una (MwxmKW)
 * - Flores laterales situadas detrás de la tarjeta (z-index: -1) para que nunca tapen el texto
 * - Ambas flores (izquierda y derecha) visibles y animadas armónicamente
 * - Totalmente adaptable en móviles y pantallas grandes
 */
import React from 'react';

const CSS = `
  @import url(https://fonts.googleapis.com/css?family=Lora:400italic);

  .ll-body {
    position: absolute;
    inset: 0;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  .ll-card {
    font-family: 'Lora', serif;
    font-style: italic;
    font-size: 1.48em;
    color: #222;
    width: min(740px, 90%);
    padding: 3.2em 2.8em;
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

  @keyframes cardIn {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
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
  .ll-main, .ll-verse, .ll-closing {
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

  /* Adaptación responsive para móviles y tablets */
  @media (max-width: 680px) {
    .ll-card {
      width: 90%;
      padding: 2.2em 1.4em;
      font-size: clamp(1.05em, 3.8vw, 1.3em);
      box-shadow:
        0 0 0 6px rgb(254, 199, 189),
        0 0 0 14px white,
        0 0 0 18px rgb(254, 199, 189);
    }
    .ll-card::before,
    .ll-card::after {
      width: 540px;
      height: 440px;
    }
    .ll-card::before {
      top: 100px;
      left: -170px;
    }
    .ll-card::after {
      top: 100px;
      right: -170px;
    }
  }
`;

export default function LoveLetter() {
  return (
    <div className="ll-body">
      <style>{CSS}</style>

      {/* Tarjeta central elegante */}
      <div className="ll-card">
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
      </div>
    </div>
  );
}
