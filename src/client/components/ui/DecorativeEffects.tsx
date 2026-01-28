import React, { memo } from 'react';

interface DecorativeEffectsProps {
  /** Show firework particles */
  fireworks?: boolean;
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
  musicalNotes = false,
  mics = false,
  stageLights = false,
  sparkles = false,
  className = '',
}) => {
  return (
    <div className={`absolute inset-0 pointer-events-none z-0 ${className}`} aria-hidden="true">
      {/* Firework Particles */}
      {fireworks && (
        <>
          {[...Array(6)].map((_, i) => (
            <div
              key={`fw-${i}`}
              className="decorative-firework"
              style={{
                left: `${15 + i * 12}%`,
                top: `${60 + (i % 3) * 10}%`,
                '--fw-tx': `${30 + i * 10}px`,
                '--fw-ty': `${-80 - i * 15}px`,
                animationDelay: `${i * 0.8}s`,
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

      {/* Stage Lights */}
      {stageLights && (
        <>
          {[...Array(2)].map((_, i) => (
            <div
              key={`light-${i}`}
              className="decorative-stage-light"
              style={{
                left: i === 0 ? '10%' : '80%',
                top: `${40 + i * 20}%`,
                animationDelay: `${i * 4}s`,
              } as React.CSSProperties}
            />
          ))}
        </>
      )}

      {/* Sparkles */}
      {sparkles && (
        <>
          {[...Array(8)].map((_, i) => (
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
