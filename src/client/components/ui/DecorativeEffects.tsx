import React, { memo } from 'react';

interface DecorativeEffectsProps {
  /** Show firework particles (CSS-only, perf-safe) */
  fireworks?: boolean;
  /** Use fewer firework particles for secondary sections (better perf when multiple sections use fireworks) */
  fireworksLight?: boolean;
  /** Show musical notes */
  musicalNotes?: boolean;
  /** Show mic icons */
  mics?: boolean;
  /** Show stage lights */
  stageLights?: boolean;
  /** Show sparkles */
  sparkles?: boolean;
  /** Custom className */
  className?: string;
}

/** Lightweight decorative effects — CSS-only, performance-optimized */
export const DecorativeEffects: React.FC<DecorativeEffectsProps> = memo(({
  fireworks = false,
  fireworksLight = false,
  musicalNotes = false,
  mics = false,
  stageLights = false,
  sparkles = false,
  className = '',
}) => {
  const fireworkCount = fireworksLight ? 3 : 6;
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} aria-hidden="true">
      {/* Firework Particles — CSS-only, GPU-accelerated */}
      {fireworks && (
        <>
          {[...Array(fireworkCount)].map((_, i) => (
            <div
              key={`fw-${i}`}
              className="decorative-firework"
              style={{
                left: `${18 + (i * (82 / Math.max(fireworkCount - 1, 1)))}%`,
                top: `${55 + (i % 3) * 15}%`,
                '--fw-tx': `${25 + i * 8}px`,
                '--fw-ty': `${-70 - i * 12}px`,
                animationDelay: `${i * 1.2}s`,
              } as React.CSSProperties}
            />
          ))}
        </>
      )}

      {/* Musical Notes */}
      {musicalNotes && (
        <>
          {[...Array(4)].map((_, i) => (
            <div
              key={`note-${i}`}
              className="decorative-musical-note"
              style={{
                width: '24px',
                height: '24px',
                left: `${20 + i * 20}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 1.5}s`,
              } as React.CSSProperties}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* Mic Icons */}
      {mics && (
        <>
          {[...Array(3)].map((_, i) => (
            <div
              key={`mic-${i}`}
              className="decorative-mic"
              style={{
                width: '32px',
                height: '32px',
                left: `${25 + i * 25}%`,
                top: `${20 + i * 30}%`,
                animationDelay: `${i * 2}s`,
              } as React.CSSProperties}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>
          ))}
        </>
      )}

      {/* Stage Lights — 1 per container to reduce cost */}
      {stageLights && (
        <>
          {[...Array(1)].map((_, i) => (
            <div
              key={`light-${i}`}
              className="decorative-stage-light"
              style={{
                left: '20%',
                top: '45%',
                animationDelay: '0s',
              } as React.CSSProperties}
            />
          ))}
        </>
      )}

      {/* Sparkles — 4 for better performance when many sections use them */}
      {sparkles && (
        <>
          {[...Array(4)].map((_, i) => (
            <div
              key={`sparkle-${i}`}
              className="decorative-sparkle"
              style={{
                left: `${10 + (i % 4) * 25}%`,
                top: `${15 + Math.floor(i / 4) * 35}%`,
                animationDelay: `${i * 0.7}s`,
              } as React.CSSProperties}
            />
          ))}
        </>
      )}
    </div>
  );
});

DecorativeEffects.displayName = 'DecorativeEffects';
