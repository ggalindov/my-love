/**
 * Garden — Jardín nocturno con flores continuas y estrella mágica
 * - Flores continuas que NUNCA paran de brotar
 * - Paleta predominante: exclusivamente Palo de Rosa y Amarillas
 * - Botón: Gran Estrella brillante central en la parte de arriba del cielo
 * - Al pulsar la estrella, se abre el sobre y pasa a la carta de amor
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';

const CSS = `
  .garden-root { position:absolute; inset:0; overflow:hidden; font-family:"Poppins",sans-serif; }

  .garden-container {
    position:relative; width:100%; height:100vh; overflow:hidden;
    background:linear-gradient(to bottom,#030614 0%,#0a1128 25%,#172449 50%,#1f2e58 75%,#28334f 100%);
  }
  .night-sky {
    position:absolute; top:0; left:0; width:100%; height:100%; opacity:.75;
    background:radial-gradient(circle at 50% 12%,rgba(70,90,145,.55),transparent 65%); z-index:0;
  }
  .stars  { position:absolute; top:0; left:0; width:100%; height:70%; z-index:0; }
  .star   {
    position:absolute; background:white; border-radius:50%; opacity:0;
    animation:twinkle var(--twinkle-duration,3s) ease-in-out infinite;
    animation-delay:var(--twinkle-delay,0s);
  }
  .clouds { position:absolute; top:0; left:0; width:100%; height:60%; z-index:0; }
  .cloud  { position:absolute; background:rgba(30,40,60,.6); border-radius:50%; filter:blur(20px); z-index:0; }
  .garden { position:relative; width:100%; height:100%; z-index:2; }
  .ground {
    position:absolute; bottom:0; left:0; width:100%; height:50%;
    background:linear-gradient(to bottom,#2d1d15,#211510); z-index:1; overflow:hidden;
    border-radius:50% 70% 0 0 / 40px; box-shadow:0 -10px 30px rgba(0,0,0,.3); transform-origin:bottom;
  }
  .ground::before {
    content:""; position:absolute; top:0; left:0; width:100%; height:100%;
    background:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E");
    opacity:.5;
  }
  .flower   { position:absolute; transform-origin:bottom center; z-index:2; --scale:1; }
  .stem     {
    position:absolute; bottom:0; left:0; width:3px;
    background:linear-gradient(to right,#2e5d20,#5cad4a,#2e5d20); border-radius:2px;
    transform-origin:bottom center; height:0;
    transition:height 1s cubic-bezier(.2,.8,.2,1); box-shadow:0 0 4px rgba(0,0,0,.5);
  }
  .stem::after {
    content:""; position:absolute; bottom:-5px; left:50%; transform:translateX(-50%);
    width:10px; height:6px;
    background:radial-gradient(ellipse at center,rgba(40,25,15,.8) 0%,rgba(40,25,15,0) 70%);
    border-radius:50%; opacity:.8;
  }
  .stem.curved { border-radius:50%; }
  @keyframes stemBend {
    0%  {transform:perspective(500px) rotateX(0deg) rotateY(var(--bend-rotation-neg,-1deg)) rotateZ(0deg);}
    50% {transform:perspective(500px) rotateX(0deg) rotateY(var(--bend-rotation-pos,1deg)) rotateZ(0deg);}
    100%{transform:perspective(500px) rotateX(0deg) rotateY(var(--bend-rotation-neg,-1deg)) rotateZ(0deg);}
  }
  .petal { position:absolute; transform-origin:center bottom; opacity:0; transform:scale(0);
           transition:transform .5s cubic-bezier(.34,1.56,.64,1),opacity .5s ease; }
  .petal.type1{border-radius:50% 50% 50% 0;}
  .petal.type2{border-radius:80% 0 80% 0;}
  .petal.type3{border-radius:0 50% 50% 50%;}
  .petal.type4{border-radius:50% 20% 50% 20%;}
  .petal.type5{border-radius:0 100% 50% 50%;}
  .center { position:absolute; border-radius:50%; opacity:0; transform:scale(0);
            transition:all .5s cubic-bezier(.34,1.56,.64,1); }
  .leaf   { position:absolute; transform-origin:0 50%; opacity:0; transform:scale(0);
            transition:all .5s cubic-bezier(.34,1.56,.64,1); }
  .leaf-shape { position:absolute; width:100%; height:100%; transform-origin:0 50%; overflow:hidden; }
  .leaf-stem  { position:absolute; height:2px; top:50%; left:-4px; transform:translateY(-50%); width:4px; }
  .main-vein  { position:absolute; top:50%; left:0; width:100%; height:1px; transform:translateY(-50%); }
  .side-vein  { position:absolute; width:80%; height:1px; transform-origin:left; }
  .firefly {
    position:absolute; width:4px; height:4px; background:#fff9c4; border-radius:50%;
    filter:blur(2px); box-shadow:0 0 10px #fff9c4,0 0 20px rgba(255,249,196,.7);
    opacity:0; z-index:3; transition:opacity .5s ease;
  }
  @keyframes sway {
    0%  {transform:scale(var(--scale)) rotate(-3deg);}
    50% {transform:scale(var(--scale)) rotate(3deg);}
    100%{transform:scale(var(--scale)) rotate(-3deg);}
  }
  @keyframes fireflyFloat {
    0%  {transform:translate(0,0);}
    10% {transform:translate(var(--x1,3px),var(--y1,-2px));}
    20% {transform:translate(var(--x2,-2px),var(--y2,-4px));}
    30% {transform:translate(var(--x3,4px),var(--y3,-1px));}
    40% {transform:translate(var(--x4,1px),var(--y4,-3px));}
    50% {transform:translate(var(--x5,-3px),var(--y5,0px));}
    60% {transform:translate(var(--x6,2px),var(--y6,-2px));}
    70% {transform:translate(var(--x7,-1px),var(--y7,-4px));}
    80% {transform:translate(var(--x8,3px),var(--y8,-1px));}
    90% {transform:translate(var(--x9,0px),var(--y9,-3px));}
    100%{transform:translate(0,0);}
  }
  @keyframes twinkle {
    0%,100%{opacity:var(--min-opacity,.1);}
    50%    {opacity:var(--max-opacity,.7);}
  }
  @keyframes cloudDrift {
    0%  {transform:translateX(0);}
    100%{transform:translateX(var(--drift-distance,100vw));}
  }
  @keyframes leafSway {
    0%,100%{transform:rotate(var(--leaf-angle));}
    50%    {transform:rotate(calc(var(--leaf-angle) + var(--leaf-sway,5deg)));}
  }
  @keyframes fadeOut { 0%{opacity:1} 100%{opacity:0} }

  /* ══════════════════════════════════════════════
     ESTRELLA GRANDE CENTRAL (PARTE DE ARRIBA)
  ══════════════════════════════════════════════ */
  .star-btn-wrap {
    position: absolute;
    top: 13vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 40;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
  }

  .star-hint {
    font-family: 'Dancing Script', cursive;
    font-size: 21px;
    color: #fff4bd;
    animation: starHintPulse 2.8s ease-in-out infinite;
    pointer-events: none;
    text-shadow: 0 0 16px rgba(255, 235, 140, 0.9), 0 0 32px rgba(255, 180, 200, 0.7);
    letter-spacing: 0.6px;
  }
  @keyframes starHintPulse {
    0%, 100% { opacity: 0.85; transform: translateY(0); }
    50%      { opacity: 1;    transform: translateY(-4px); }
  }

  .star-btn {
    position: relative;
    width: 84px;
    height: 84px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    outline: none;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .star-btn:hover {
    transform: scale(1.22);
  }
  .star-btn:active {
    transform: scale(0.94);
  }

  .star-svg {
    width: 100%;
    height: 100%;
    filter: drop-shadow(0 0 12px #ffe680) drop-shadow(0 0 28px rgba(255, 215, 0, 0.75));
    animation: starRotateGlow 4s ease-in-out infinite alternate;
  }
  @keyframes starRotateGlow {
    0% {
      transform: scale(1) rotate(0deg);
      filter: drop-shadow(0 0 10px #ffe680) drop-shadow(0 0 22px rgba(255, 215, 0, 0.65));
    }
    100% {
      transform: scale(1.1) rotate(6deg);
      filter: drop-shadow(0 0 20px #fff7c2) drop-shadow(0 0 40px rgba(255, 235, 140, 0.95));
    }
  }

  /* Responsive para móviles */
  @media (max-width: 540px) {
    .star-btn-wrap {
      top: 9vh;
      gap: 6px;
    }
    .star-hint {
      font-size: 17px;
    }
    .star-btn {
      width: 70px;
      height: 70px;
    }
    .env-scene {
      width: min(270px, 84vw);
      height: min(180px, 56vw);
    }
    .env-bottom {
      border-left: 135px solid transparent;
      border-right: 135px solid transparent;
      border-bottom: 90px solid #b0395a;
    }
    .env-left, .env-right {
      border-top: 90px solid transparent;
      border-bottom: 90px solid transparent;
    }
    .env-left { border-left: 135px solid #a03055; }
    .env-right { border-right: 135px solid #a03055; }
    .env-flap {
      border-left: 135px solid transparent;
      border-right: 135px solid transparent;
      border-top: 90px solid #f0b8d4;
    }
  }

  /* ── Overlay de sobre CSS (encima de todo) ── */
  .envelope-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0);
    pointer-events: none;
    transition: background .6s ease;
  }
  .envelope-overlay.active {
    pointer-events: all;
    background: rgba(0,0,0,0.55);
  }

  /* Sobre */
  .env-scene {
    position: relative;
    width: 300px;
    height: 200px;
    opacity: 0;
    transform: scale(.6) translateY(60px);
    transition: opacity .5s ease, transform .5s cubic-bezier(.34,1.2,.64,1);
  }
  .envelope-overlay.active .env-scene {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  /* Cuerpo del sobre */
  .env-body {
    position: absolute; inset: 0;
    background: linear-gradient(160deg,#e8a0bf,#c2185b);
    border-radius: 0 0 12px 12px;
    box-shadow: 0 16px 48px rgba(0,0,0,.35);
  }
  /* Triángulo inferior */
  .env-bottom {
    position:absolute; bottom:0; left:0;
    border-left:150px solid transparent; border-right:150px solid transparent;
    border-bottom:100px solid #b0395a; z-index:2;
  }
  /* Lados */
  .env-left {
    position:absolute; bottom:0; left:0;
    border-top:100px solid transparent; border-bottom:100px solid transparent;
    border-left:150px solid #a03055; z-index:2;
  }
  .env-right {
    position:absolute; bottom:0; right:0;
    border-top:100px solid transparent; border-bottom:100px solid transparent;
    border-right:150px solid #a03055; z-index:2;
  }
  /* Solapa */
  .env-flap {
    position:absolute; top:0; left:0;
    border-left:150px solid transparent; border-right:150px solid transparent;
    border-top:100px solid #f0b8d4;
    transform-origin: top center;
    z-index: 5;
    transition: transform 1s ease-in-out;
  }
  .env-flap.open { transform: rotateX(-180deg); z-index:1; }

  /* Carta que sube */
  .env-letter {
    position:absolute; left:12px; right:12px; bottom:10px;
    background:#fff8f0;
    border-radius:6px;
    padding:14px;
    text-align:center;
    font-family:'Lora',serif;
    font-style:italic;
    color:#5a2a4a;
    font-size:12px;
    line-height:1.6;
    z-index:3;
    transition: transform 1.2s cubic-bezier(.25,.46,.45,.94) .3s;
    transform: translateY(0);
    border: 1px solid #f0b8d4;
    box-shadow:0 2px 8px rgba(0,0,0,.1);
  }
  .env-letter.risen { transform: translateY(-200px); }

  /* Corazones flotando desde el sobre */
  .env-heart {
    position:absolute;
    font-size:20px;
    animation: envHeart 2.5s ease-out forwards;
    pointer-events:none;
    z-index:10;
  }
  @keyframes envHeart {
    0%   { opacity:1; transform:translateY(0) scale(.8); }
    100% { opacity:0; transform:translateY(-180px) scale(1.4); }
  }
`;

/* ═══════════════════════════════════════════════════════════
   Paleta que predomina ÚNICAMENTE Palo de Rosa y Amarillas
═══════════════════════════════════════════════════════════ */
const primes = [3, 5, 7, 11, 13, 17];
const flowerStyles = {
  // 3: Palo de rosa suave y romántico
  3:  { colors: ['#f4a8b5', '#d97d8f'], size: 24, petals: 5, type: 'type1', center: { color: '#fef08a', size: 8 } },
  // 5: Amarilla brillante cálida
  5:  { colors: ['#fde047', '#facc15'], size: 23, petals: 6, type: 'type2', center: { color: '#e899a8', size: 7 } },
  // 7: Palo de rosa clásico aterciopelado
  7:  { colors: ['#e899a8', '#c56b7c'], size: 28, petals: 8, type: 'type1', center: { color: '#fef9c3', size: 9 } },
  // 11: Amarilla dorada de sol
  11: { colors: ['#fef08a', '#eab308'], size: 26, petals: 5, type: 'type3', center: { color: '#c56b7c', size: 8 } },
  // 13: Palo de rosa vintage empolvado
  13: { colors: ['#dba39a', '#b76e79'], size: 21, petals: 7, type: 'type4', center: { color: '#fef08a', size: 6 } },
  // 17: Amarilla pastel cálida
  17: { colors: ['#fef9c3', '#fde047'], size: 29, petals: 6, type: 'type5', center: { color: '#d97d8f', size: 10 } },
};

const leafTypes = [
  { radius: '0 100% 50% 50%', gradient: 'linear-gradient(135deg,#3a8029,#5cad4a)', veinCount: 3, veinAngle: -5 },
  { radius: '0 70% 0 50%',    gradient: 'linear-gradient(135deg,#4a9e35,#65c143)', veinCount: 5, veinAngle: -15 },
  { radius: '50% 100% 50% 30%', gradient: 'linear-gradient(135deg,#2e5d20,#4a9e35)', veinCount: 4, veinAngle: 0 },
  { radius: '10% 90% 20% 80%',  gradient: 'linear-gradient(135deg,#3a8029,#65c143)', veinCount: 6, veinAngle: -10 },
  { radius: '50% 50% 0 50%',  gradient: 'linear-gradient(135deg,#3d8c29,#5cad4a)', veinCount: 4, veinAngle: -8 },
];

const clamp = (n, a, b) => Math.min(Math.max(n, a), b);

function adjustColor(hex, amount) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${clamp(r + amount * 2, 0, 255)},${clamp(g + amount * 2, 0, 255)},${clamp(b + amount * 2, 0, 255)})`;
}

function initGarden(root) {
  const starsEl     = root.querySelector('.stars');
  const cloudsEl    = root.querySelector('.clouds');
  const gardenEl    = root.querySelector('.garden');
  const firefliesEl = root.querySelector('.fireflies');

  // Estrellas de fondo
  for (let i = 0; i < 200; i++) {
    const s = document.createElement('div');
    s.classList.add('star');
    const sz = Math.random() * 2 + 1;
    s.style.cssText = `width:${sz}px;height:${sz}px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;`;
    const dur = 3 + Math.random() * 7, del = Math.random() * 5, minO = Math.random() * 0.3, maxO = minO + 0.4;
    s.style.setProperty('--twinkle-duration', `${dur}s`);
    s.style.setProperty('--twinkle-delay', `${del}s`);
    s.style.setProperty('--min-opacity', minO);
    s.style.setProperty('--max-opacity', maxO);
    starsEl.appendChild(s);
  }

  // Nubes
  for (let i = 0; i < 8; i++) {
    const c = document.createElement('div');
    c.classList.add('cloud');
    const w = 100 + Math.random() * 200, h = 50 + Math.random() * 40;
    c.style.cssText = `width:${w}px;height:${h}px;left:${Math.random() * 100}%;top:${Math.random() * 50}%;opacity:${0.1 + Math.random() * 0.3};`;
    const drift = 100 + Math.random() * 100, dur = 100 + Math.random() * 100;
    c.style.setProperty('--drift-distance', `${drift}vw`);
    c.style.animation = `cloudDrift ${dur}s linear infinite`;
    cloudsEl.appendChild(c);
  }

  function createFlower(delay, specificPrime, minD, maxD, minH, maxH) {
    const flower = document.createElement('div');
    flower.classList.add('flower');
    const x = 5 + Math.random() * 90;
    const depthFactor = minD + Math.random() * (maxD - minD);
    const yPos = minH + Math.random() * (maxH - minH);
    flower.style.bottom = `${yPos}%`;
    flower.style.left   = `${x}%`;
    const scale = 0.7 + depthFactor * 0.6;
    flower.style.setProperty('--scale', scale);
    flower.style.opacity = 0.9 + depthFactor * 0.1;
    flower.style.zIndex  = Math.round(10 + depthFactor * 90);

    const prime = specificPrime || primes[Math.floor(Math.random() * primes.length)];
    const fs = flowerStyles[prime];
    const stemH = (30 + Math.random() * 50) * (0.8 + depthFactor * 0.4);

    const stem = document.createElement('div');
    stem.classList.add('stem');
    stem.style.height = '0px';
    stem.dataset.fullHeight = `${stemH}px`;
    stem.style.background = `linear-gradient(to top,rgba(30,20,10,.9) 0%,#2e5d20 5%,#5cad4a 50%,#2e5d20 95%)`;

    const swayDur = 8 + Math.random() * 5, swayDel = Math.random() * 4;
    if (Math.random() > 0.3) {
      stem.classList.add('curved');
      const bend = Math.random() * 1.5 + 1.5;
      stem.style.setProperty('--bend-rotation-neg', `-${bend}deg`);
      stem.style.setProperty('--bend-rotation-pos', `${bend}deg`);
      stem.style.transformOrigin = `center ${Math.random() * 20 + 40}%`;
      stem.style.animation = `stemBend ${swayDur * 1.2}s ease-in-out infinite`;
      stem.style.animationDelay = `${swayDel}s`;
    }
    flower.style.animation = `sway ${swayDur}s ease-in-out infinite`;
    flower.style.animationDelay = `${swayDel}s`;

    const petalCount = fs.petals;
    const petalSize  = fs.size / 2;
    const centerSize = fs.center.size;

    const center = document.createElement('div');
    center.classList.add('center');
    center.style.backgroundColor = fs.center.color;
    center.style.boxShadow = `0 0 8px ${fs.center.color}`;
    center.style.width  = `${centerSize}px`;
    center.style.height = `${centerSize}px`;
    center.style.bottom = '0px';
    center.style.left   = `${-centerSize / 2}px`;

    for (let j = 0; j < petalCount; j++) {
      const petal = document.createElement('div');
      petal.classList.add('petal', fs.type);
      const hue = Math.floor(Math.random() * 8) - 4;
      petal.style.background = `linear-gradient(to bottom,${adjustColor(fs.colors[0], hue)},${adjustColor(fs.colors[1], hue)})`;
      const sv = 0.9 + Math.random() * 0.2;
      petal.style.width  = `${petalSize * sv}px`;
      petal.style.height = `${petalSize * 1.2 * sv}px`;
      const angle = (360 / petalCount) * j + (Math.random() * 5 - 2.5);
      petal.style.bottom = '0px';
      petal.style.left   = `${(-petalSize / 2) * sv}px`;
      petal.style.transformOrigin = 'center bottom';
      petal.dataset.angle = angle;
      flower.appendChild(petal);
    }

    const leafCount = 2 + Math.floor(Math.random() * 2);
    for (let j = 0; j < leafCount; j++) {
      const leaf = document.createElement('div');
      leaf.classList.add('leaf');
      const pos  = 0.1 + j * (0.8 / leafCount) + Math.random() * 0.05;
      const side = j % 2 === 0 ? -1 : 1;
      const lt   = leafTypes[Math.floor(Math.random() * leafTypes.length)];
      const lsz  = 12 + Math.random() * 8, lw = lsz * (0.8 + Math.random() * 0.4);
      leaf.style.width  = `${lw}px`;
      leaf.style.height = `${lsz / 2}px`;
      leaf.style.bottom = `${stemH * pos}px`;
      leaf.style.left   = '0px';
      const leafAngle = side * (25 + Math.random() * 20);
      leaf.style.setProperty('--leaf-angle', `${leafAngle}deg`);
      leaf.style.setProperty('--leaf-sway', `${Math.random() * 5 + 3}deg`);

      const ls = document.createElement('div');
      ls.classList.add('leaf-shape');
      ls.style.borderRadius = lt.radius;
      ls.style.background   = lt.gradient;
      if (side > 0) ls.style.transform = 'scaleX(-1)';

      const lsm = document.createElement('div');
      lsm.classList.add('leaf-stem');
      lsm.style.background = lt.gradient.split(',')[0].replace('linear-gradient(135deg', '').trim();
      lsm.style.left = '-4px';

      const mv = document.createElement('div');
      mv.classList.add('main-vein');
      mv.style.background = 'rgba(25,50,15,.3)';
      mv.style.transform  = `translateY(-50%) rotate(${lt.veinAngle}deg)`;
      ls.appendChild(mv);

      for (let v = 1; v <= lt.veinCount; v++) {
        const sv2 = document.createElement('div');
        sv2.classList.add('side-vein');
        sv2.style.background = 'rgba(25,50,15,.2)';
        sv2.style.top        = `${v * 100 / (lt.veinCount + 1)}%`;
        sv2.style.transform  = `translateY(-50%) rotate(${-20 + v * 5 + (Math.random() * 5 - 2.5)}deg)`;
        sv2.style.width      = `${60 + Math.random() * 20}%`;
        ls.appendChild(sv2);
      }

      leaf.appendChild(lsm);
      leaf.appendChild(ls);
      stem.appendChild(leaf);
    }

    flower.appendChild(stem);
    flower.appendChild(center);
    gardenEl.appendChild(flower);

    const isInit = delay < 500, actual = isInit ? 10 : delay;
    setTimeout(() => {
      stem.style.height = stem.dataset.fullHeight;
      setTimeout(() => {
        center.style.bottom = stem.dataset.fullHeight;
        const petals = flower.querySelectorAll('.petal');
        petals.forEach(p => {
          p.style.bottom = stem.dataset.fullHeight;
          const a = parseFloat(p.dataset.angle), rad = (a * Math.PI) / 180;
          const ox = Math.sin(rad) * (centerSize * 0.5), oy = Math.cos(rad) * (centerSize * 0.5);
          p.style.transform = `rotate(${a}deg) translate(${ox}px,${-oy}px) scale(0)`;
        });
        center.style.opacity = '1';
        center.style.transform = 'scale(1)';
        const pd = isInit ? 10 : 80;
        petals.forEach((p, idx) => setTimeout(() => {
          p.style.opacity = '1';
          const a = parseFloat(p.dataset.angle), rad = (a * Math.PI) / 180;
          const ox = Math.sin(rad) * (centerSize * 0.5), oy = Math.cos(rad) * (centerSize * 0.5);
          p.style.transform = `rotate(${a}deg) translate(${ox}px,${-oy}px) scale(1)`;
        }, idx * pd + (isInit ? 0 : Math.random() * 40)));

        const leaves = stem.querySelectorAll('.leaf'), ld = isInit ? 10 : 100;
        leaves.forEach((l, idx) => setTimeout(() => {
          l.style.opacity   = '1';
          l.style.transform = `rotate(${l.style.getPropertyValue('--leaf-angle')})`;
          l.style.animation = `leafSway ${3 + Math.random() * 2}s ease-in-out infinite`;
        }, idx * ld + (isInit ? 0 : Math.random() * 50)));
      }, isInit ? 50 : 800);
    }, actual);

    // Mantenemos hasta 220 flores para que el jardín sea frondoso y nunca pare
    const all = gardenEl.querySelectorAll('.flower');
    if (all.length > 220) {
      const old = all[0];
      old.style.animation = 'fadeOut 2s forwards';
      setTimeout(() => old.remove(), 2000);
    }
  }

  // 1. Población inicial (70 flores)
  for (let i = 0; i < 70; i++) {
    const d = Math.random();
    if (d < 0.3)       createFlower(i * 35, null, 0.8, 1.0, 10, 40);
    else if (d < 0.6)  createFlower(i * 35, null, 0.5, 0.7, 25, 45);
    else if (d < 0.85) createFlower(i * 35, null, 0.3, 0.5, 35, 45);
    else               createFlower(i * 35, null, 0.1, 0.3, 42, 46);
  }

  // 2. Reproducción continua que NUNCA PARA: nacen flores constantemente
  const continuousSpawnInterval = setInterval(() => {
    const dr = Math.random();
    const prime = primes[Math.floor(Math.random() * primes.length)];
    if (dr < 0.3)      createFlower(0, prime, 0.8, 1.0, 10, 40);
    else if (dr < 0.6) createFlower(0, prime, 0.5, 0.7, 25, 45);
    else if (dr < 0.85)createFlower(0, prime, 0.3, 0.5, 35, 45);
    else               createFlower(0, prime, 0.1, 0.3, 42, 46);
  }, 450);

  // Luciérnagas
  setTimeout(() => {
    const groundEl = root.querySelector('.ground');
    if (!groundEl) return;
    const groundTop = window.innerHeight - groundEl.offsetHeight;
    for (let i = 0; i < 10; i++) {
      const ff = document.createElement('div');
      ff.classList.add('firefly');
      const x = Math.random() * 100, maxY = (groundTop / window.innerHeight) * 100, minY = 10;
      const y = minY + Math.random() * (maxY - minY - 15);
      for (let j = 1; j <= 9; j++) {
        ff.style.setProperty(`--x${j}`, `${Math.random() * 6 - 3}px`);
        ff.style.setProperty(`--y${j}`, `${Math.random() * 5 - 4}px`);
      }
      ff.style.left = `${x}%`;
      ff.style.top  = `${y}%`;
      firefliesEl.appendChild(ff);
      setTimeout(() => {
        ff.style.opacity = '1';
        ff.style.animation = `fireflyFloat ${3 + Math.random() * 3}s ease-in-out infinite`;
        const p = primes[Math.floor(Math.random() * primes.length)];
        setInterval(() => {
          if (ff.style.opacity !== '0') {
            ff.style.opacity = '0';
            setTimeout(() => {
              ff.style.opacity = '1';
              if (Math.random() > 0.7) {
                setTimeout(() => { ff.style.opacity = '0'; setTimeout(() => { ff.style.opacity = '1'; }, 100); }, 200);
              }
            }, 100 + Math.random() * 200);
          }
        }, p * 1000 + Math.random() * 3000);
        setInterval(() => {
          if (Math.random() > 0.7) {
            const mr = 15;
            const nx = clamp(parseFloat(ff.style.left) + Math.random() * mr - mr / 2, 0, 100);
            const ny = clamp(parseFloat(ff.style.top) + Math.random() * mr - mr / 2, minY, maxY - 15);
            ff.style.transition = 'left 2.5s ease-in-out,top 2.5s ease-in-out';
            ff.style.left = `${nx}%`;
            ff.style.top  = `${ny}%`;
            setTimeout(() => { ff.style.transition = 'opacity .5s ease'; }, 2500);
          }
        }, p * 1000 + Math.random() * 5000);
      }, i * 200 + Math.random() * 1000);
    }
  }, 500);

  return () => {
    clearInterval(continuousSpawnInterval);
  };
}

/* ════════════ Componente Garden ════════════ */
export default function Garden({ onComplete }) {
  const rootRef   = useRef(null);
  const [envOpen, setEnvOpen]   = useState(false);
  const [flapOpen, setFlapOpen] = useState(false);
  const [risen,    setRisen]    = useState(false);
  const [hearts,   setHearts]   = useState([]);

  useEffect(() => {
    if (rootRef.current) {
      const cleanup = initGarden(rootRef.current);
      return cleanup;
    }
  }, []);

  const handleStarClick = useCallback(() => {
    if (envOpen) return;
    setEnvOpen(true);

    // 1) La solapa del sobre se abre tras 600ms
    setTimeout(() => { setFlapOpen(true); }, 600);

    // 2) La carta sube tras 1.8s
    setTimeout(() => { setRisen(true); }, 1800);

    // 3) Salen pequeños destellos / corazones románticos del sobre
    setTimeout(() => {
      setHearts([
        { id: 0, icon: '✨', left: '46%', top: '36%', delay: '0s' },
        { id: 1, icon: '💕', left: '52%', top: '34%', delay: '.3s' },
        { id: 2, icon: '⭐', left: '42%', top: '32%', delay: '.6s' },
        { id: 3, icon: '🌸', left: '54%', top: '35%', delay: '.9s' },
      ]);
    }, 1400);

    // 4) Transición a la carta tras 3.2s
    setTimeout(() => { onComplete(); }, 3200);
  }, [envOpen, onComplete]);

  return (
    <div className="garden-root">
      <style>{CSS}</style>

      {/* ── Jardín nocturno ── */}
      <div className="garden-container" ref={rootRef}>
        <div className="night-sky" />
        <div className="stars" />
        <div className="clouds" />
        <div className="ground" />
        <div className="garden" />
        <div className="fireflies" />
      </div>

      {/* ── Estrella Grande Central en la parte de arriba del cielo ── */}
      <div className="star-btn-wrap" onClick={handleStarClick}>
        <span className="star-hint">Toca nuestra estrella... ✨</span>
        <button className="star-btn" aria-label="Abrir carta de amor">
          <svg className="star-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="30" fill="url(#starGlowGrad)" opacity="0.85" />
            {/* Rayos principales de 8 puntas */}
            <path
              d="M50 0 L55 38 L95 50 L55 62 L50 100 L45 62 L5 50 L45 38 Z"
              fill="#fff9db"
            />
            <path
              d="M50 14 L53 43 L82 50 L53 57 L50 86 L47 57 L18 50 L47 43 Z"
              fill="#ffffff"
            />
            {/* Rayos diagonales */}
            <path
              d="M26 26 L44 44 M74 26 L56 44 M74 74 L56 56 M26 74 L44 56"
              stroke="#ffe066"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Núcleo luminoso */}
            <circle cx="50" cy="50" r="7" fill="#ffffff" />
            <defs>
              <radialGradient id="starGlowGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff2a8" stopOpacity="1" />
                <stop offset="55%" stopColor="#ffd166" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ffd166" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </button>
      </div>

      {/* ── Overlay: animación del sobre ── */}
      <div className={`envelope-overlay ${envOpen ? 'active' : ''}`}>
        <div className="env-scene">
          {/* Carta que asoma del sobre */}
          <div className={`env-letter ${risen ? 'risen' : ''}`}>
            <strong style={{ color: '#c25774', fontFamily: "'Dancing Script', cursive", fontSize: '16px' }}>
              💕 Mi Amor 💕
            </strong><br />
            Para la mujer que ilumina<br />mi vida entera...
          </div>

          {/* Cuerpo del sobre */}
          <div className="env-body" />
          <div className="env-bottom" />
          <div className="env-left" />
          <div className="env-right" />

          {/* Solapa animada */}
          <div className={`env-flap ${flapOpen ? 'open' : ''}`} />
        </div>

        {/* Destellos y corazones saliendo del sobre */}
        {hearts.map(h => (
          <div
            key={h.id}
            className="env-heart"
            style={{
              left: h.left,
              top: h.top,
              animationDelay: h.delay,
            }}
          >
            {h.icon}
          </div>
        ))}
      </div>
    </div>
  );
}
