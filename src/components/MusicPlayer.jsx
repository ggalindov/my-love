/**
 * MusicPlayer — Reproductor de música minimalista, elegante y 100% funcional
 * - Estética frosted-glass de alta gama (Apple / Spotify luxury style)
 * - Visualizador de ondas de sonido animadas (ecualizador suave)
 * - Barra de progreso interactiva con tiempo actual y duración (permite adelantar/retroceder)
 * - Botón Play/Pausa de alta precisión con audio persistente
 */
import React, { useState, useEffect, useRef } from 'react';

// Instancia única y persistente de Audio para que nunca se reinicie ni se corte
function getAudioInstance() {
  if (typeof window === 'undefined') return null;
  if (!window.__loveAudio) {
    const audioUrl = new URL('music/song.mp3', window.location.href).href;
    const audio = new Audio(audioUrl);
    audio.loop = true;
    audio.preload = 'auto';
    window.__loveAudio = audio;
  }
  return window.__loveAudio;
}

function formatTime(seconds) {
  if (isNaN(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

const CSS = `
  .lux-player-wrap {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.95);
    border-radius: 9999px;
    padding: 8px 16px 8px 12px;
    box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12),
                0 4px 12px rgba(225, 29, 72, 0.12);
    user-select: none;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s ease;
  }
  .lux-player-wrap:hover {
    box-shadow: 0 14px 38px -4px rgba(0, 0, 0, 0.16),
                0 6px 18px rgba(225, 29, 72, 0.2);
    transform: translateY(-2px);
  }

  /* Ecualizador animado / ondas de sonido */
  .lux-visualizer {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fff1f2, #ffe4e6);
    border: 1px solid rgba(251, 113, 133, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2.5px;
    flex-shrink: 0;
    box-shadow: 0 2px 8px rgba(225, 29, 72, 0.15);
  }
  .lux-bar {
    width: 3px;
    background: linear-gradient(to top, #e11d48, #fb7185);
    border-radius: 99px;
    transition: height 0.2s ease;
  }
  .lux-bar-1 { height: 8px; }
  .lux-bar-2 { height: 16px; }
  .lux-bar-3 { height: 12px; }
  .lux-bar-4 { height: 6px; }

  .lux-visualizer.playing .lux-bar-1 { animation: luxWave 1.1s ease-in-out infinite alternate; }
  .lux-visualizer.playing .lux-bar-2 { animation: luxWave 0.8s ease-in-out infinite alternate-reverse; }
  .lux-visualizer.playing .lux-bar-3 { animation: luxWave 1.3s ease-in-out infinite alternate; }
  .lux-visualizer.playing .lux-bar-4 { animation: luxWave 0.9s ease-in-out infinite alternate-reverse; }

  @keyframes luxWave {
    0%   { height: 4px; }
    50%  { height: 18px; }
    100% { height: 8px; }
  }

  /* Info de la canción */
  .lux-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-width: 100px;
    max-width: 130px;
  }
  .lux-title {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: -0.2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.25;
  }
  .lux-artist {
    font-size: 11px;
    font-weight: 500;
    color: #64748b;
    margin-top: 1px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* Barra de progreso interactiva */
  .lux-scrubber-box {
    display: flex;
    align-items: center;
    gap: 8px;
    flex: 1;
    min-width: 0;
  }
  .lux-time {
    font-size: 10px;
    font-weight: 600;
    color: #94a3b8;
    font-variant-numeric: tabular-nums;
    min-width: 24px;
    text-align: center;
  }
  .lux-track {
    flex: 1;
    min-width: 50px;
    max-width: 90px;
    height: 16px;
    display: flex;
    align-items: center;
    cursor: pointer;
    position: relative;
  }
  .lux-line {
    width: 100%;
    height: 3.5px;
    background: #e2e8f0;
    border-radius: 99px;
    position: relative;
    overflow: hidden;
  }
  .lux-fill {
    height: 100%;
    background: linear-gradient(90deg, #e11d48, #fb7185);
    border-radius: 99px;
    transition: width 0.1s linear;
  }
  .lux-track:hover .lux-line {
    height: 5px;
  }

  /* Botón Play / Pause elegante */
  .lux-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #0f172a;
    border: none;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.25);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
                background 0.2s ease,
                box-shadow 0.2s ease;
    outline: none;
  }
  .lux-btn:hover {
    transform: scale(1.08);
    background: #e11d48;
    box-shadow: 0 4px 16px rgba(225, 29, 72, 0.4);
  }
  .lux-btn:active {
    transform: scale(0.93);
  }

  /* Adaptación responsive para móviles */
  @media (max-width: 480px) {
    .lux-player-wrap {
      gap: 8px;
      padding: 6px 10px 6px 8px;
      width: calc(100vw - 28px);
      max-width: 380px;
      justify-content: space-between;
      box-sizing: border-box;
    }
    .lux-visualizer {
      width: 32px;
      height: 32px;
    }
    .lux-info {
      min-width: 75px;
      max-width: 95px;
    }
    .lux-title {
      font-size: 12px;
    }
    .lux-artist {
      font-size: 10px;
    }
    .lux-scrubber-box {
      gap: 5px;
    }
    .lux-time {
      font-size: 9px;
      min-width: 18px;
    }
    .lux-track {
      min-width: 40px;
      max-width: 70px;
    }
    .lux-btn {
      width: 33px;
      height: 33px;
    }
  }
`;

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const trackRef = useRef(null);

  useEffect(() => {
    const audio = getAudioInstance();
    if (!audio) return;

    // Sincronizar estado actual
    setPlaying(!audio.paused);
    setCurrentTime(audio.currentTime || 0);
    setDuration(audio.duration || 0);

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration);
      }
    };
    const onLoadedMetadata = () => {
      if (audio.duration) setDuration(audio.duration);
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, []);

  const togglePlay = () => {
    const audio = getAudioInstance();
    if (!audio) return;

    if (audio.paused) {
      audio.play().then(() => {
        setPlaying(true);
      }).catch(err => {
        console.warn('Error al reproducir audio:', err);
      });
    } else {
      audio.pause();
      setPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const audio = getAudioInstance();
    const track = trackRef.current;
    if (!audio || !track || !audio.duration) return;

    const rect = track.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, clickX / rect.width));
    audio.currentTime = ratio * audio.duration;
    setCurrentTime(audio.currentTime);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="lux-player-wrap">
      <style>{CSS}</style>

      {/* Visualizador de ondas animadas */}
      <div className={`lux-visualizer ${playing ? 'playing' : ''}`}>
        <div className="lux-bar lux-bar-1" />
        <div className="lux-bar lux-bar-2" />
        <div className="lux-bar lux-bar-3" />
        <div className="lux-bar lux-bar-4" />
      </div>

      {/* Título y artista */}
      <div className="lux-info">
        <div className="lux-title" title="Como un sello (Cantares 8:6-7)">Como un sello</div>
        <div className="lux-artist">Darviin 💕</div>
      </div>

      {/* Barra de progreso interactiva con tiempo */}
      <div className="lux-scrubber-box">
        <span className="lux-time">{formatTime(currentTime)}</span>
        <div
          className="lux-track"
          ref={trackRef}
          onClick={handleSeek}
          title="Haz clic para adelantar o retroceder"
        >
          <div className="lux-line">
            <div className="lux-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
        <span className="lux-time">{formatTime(duration || 215)}</span>
      </div>

      {/* Botón de Play / Pausa */}
      <button
        className="lux-btn"
        onClick={togglePlay}
        aria-label={playing ? "Pausar" : "Reproducir"}
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: '2px' }}>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
