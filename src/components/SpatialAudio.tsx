'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import styles from './SpatialAudio.module.css';

interface Wave {
  radius: number;
  alpha: number;
  width: number;
  speed: number;
}

export default function SpatialAudio() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationRef = useRef<number | null>(null);
  const wavesRef = useRef<Wave[]>([]);

  // Web Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const osc1Ref = useRef<OscillatorNode | null>(null);
  const osc2Ref = useRef<OscillatorNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  const initAudio = () => {
    if (audioCtxRef.current) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioCtxRef.current = ctx;

      // 1. Create a gain node for master volume
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, ctx.currentTime); // Start silent
      gainNodeRef.current = gainNode;

      // 2. Create a low base hum (sub-frequency for depth)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1 hum
      osc1Ref.current = osc1;

      // 3. Create a harmonic ambient oscillator
      const osc2 = ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(220, ctx.currentTime); // A3 ambient pad
      osc2Ref.current = osc2;

      // 4. Create a stereo panner node to swing sound left <-> right
      let panner: StereoPannerNode;
      if (ctx.createStereoPanner) {
        panner = ctx.createStereoPanner();
        pannerRef.current = panner;
      } else {
        // Fallback for older browsers
        panner = ctx.createGain() as any;
      }

      // Connect nodes: Osc -> Gain -> Panner -> Destination
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      
      if (pannerRef.current) {
        gainNode.connect(panner);
        panner.connect(ctx.destination);
      } else {
        gainNode.connect(ctx.destination);
      }

      // Start oscillators
      osc1.start();
      osc2.start();

      // Slow LFO for spatial panning
      let lastTime = ctx.currentTime;
      const panLfo = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
        const now = audioCtxRef.current.currentTime;
        const panValue = Math.sin(now * 0.7); // Swing back & forth
        if (pannerRef.current && pannerRef.current.pan) {
          pannerRef.current.pan.setValueAtTime(panValue, now);
        }
        
        // Dynamic filter sweep (slight pitch modulation on osc2)
        if (osc2Ref.current) {
          const pitchSweep = 220 + Math.sin(now * 0.5) * 5;
          osc2Ref.current.frequency.setValueAtTime(pitchSweep, now);
        }

        requestAnimationFrame(panLfo);
      };
      
      panLfo();
    } catch (e) {
      console.warn("Web Audio API is not supported in this browser.", e);
    }
  };

  const togglePlayback = () => {
    // Lazy init audio context on first interaction
    initAudio();

    const ctx = audioCtxRef.current;
    if (!ctx) {
      setIsPlaying(!isPlaying);
      return;
    }

    if (isPlaying) {
      // Fade out volume before pausing to avoid clicks
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
      }
      setTimeout(() => {
        if (ctx.state !== 'suspended') {
          ctx.suspend();
        }
        setIsPlaying(false);
      }, 300);
    } else {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      setIsPlaying(true);
      // Fade in volume smoothly
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0, ctx.currentTime);
        gainNodeRef.current.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.5); // Master volume at 8%
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    // Initialize waves
    wavesRef.current = [
      { radius: 100, alpha: 0.8, width: 2, speed: 1 },
      { radius: 180, alpha: 0.5, width: 1.5, speed: 0.8 },
      { radius: 260, alpha: 0.3, width: 1, speed: 0.6 },
    ];

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      const maxRadius = Math.min(width, height) / 1.1;

      // Draw concentric radiating acoustic circles
      wavesRef.current.forEach((wave) => {
        // Expand wave
        const expansionSpeed = isPlaying ? wave.speed * 1.8 : wave.speed * 0.4;
        wave.radius += expansionSpeed;

        // Fade out as it expands
        wave.alpha = Math.max(0, 1 - wave.radius / maxRadius);

        if (wave.radius >= maxRadius) {
          // Reset wave
          wave.radius = 80;
          wave.alpha = 0.8;
        }

        // Draw outer ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, wave.radius, 0, Math.PI * 2);

        ctx.strokeStyle = `rgba(226, 122, 63, ${wave.alpha})`;
        ctx.lineWidth = wave.width * (isPlaying ? 1.5 : 1);
        ctx.stroke();

        // Draw subtle filled glow
        ctx.beginPath();
        ctx.arc(centerX, centerY, wave.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 122, 63, ${wave.alpha * 0.025})`;
        ctx.fill();
      });

      // Draw secondary vertical audio frequency lines (equalizer styled) on the left/right edges
      if (isPlaying) {
        ctx.save();
        ctx.translate(centerX, centerY);
        const barCount = 36;
        for (let i = 0; i < barCount; i++) {
          const angle = (i * Math.PI * 2) / barCount;
          // Connect equalizer heights to active stereo panning value to visually represent spatiality!
          const panOffset = pannerRef.current ? pannerRef.current.pan.value : 0;
          const leftRightFactor = Math.cos(angle) * panOffset; // higher bars on panned side
          
          const noise = Math.sin(Date.now() * 0.005 + i) * 12 + leftRightFactor * 8;
          const barHeight = Math.max(2, 8 + noise);
          const startRadius = 115;

          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(0, startRadius);
          ctx.lineTo(0, startRadius + barHeight);
          ctx.strokeStyle = `rgba(226, 122, 63, ${0.4 + (noise + 12) / 48})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  return (
    <section className={styles.section}>
      <div className={styles.grid}>
        {/* Left Column: Visual waves */}
        <div className={styles.visualWrapper}>
          <canvas ref={canvasRef} className={styles.canvas} />
          <div className={styles.imageContainer}>
            <Image
              src="/images/spatial_audio_visual.png"
              alt="Audira Spatial Audio Earcup Driver"
              fill
              sizes="(max-width: 968px) 100vw, 320px"
              className={styles.earcupImage}
            />
          </div>
        </div>

        {/* Right Column: Descriptions */}
        <div className={styles.content}>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgeAccent}`}>3D Spatial Audio</span>
            <span className={styles.badge}>40h Battery</span>
          </div>

          <h2 className={styles.title}>Immersive Sound, All Around You.</h2>
          
          <p className={styles.desc}>
            Experience sound in three dimensions. Audira's built-in spatial gyroscope dynamic tracking anchors sound in space, creating an immersive, theatre-like acoustic arena right between your ears.
          </p>

          <div className={styles.controlRow}>
            <button
              className={`${styles.playBtn} ${isPlaying ? styles.playBtnActive : ''}`}
              onClick={togglePlayback}
              aria-label={isPlaying ? 'Pause acoustic waves' : 'Play acoustic waves'}
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
            <div className={styles.controlText}>
              {isPlaying ? 'Demo Active' : 'Demo Paused'}
              <span className={styles.controlSub}>Click to toggle the spatial soundscape simulation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
