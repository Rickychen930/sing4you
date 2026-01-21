import React, { useEffect, useRef, memo, useCallback, useMemo } from 'react';

/**
 * FireworkEffect Component
 * 
 * A celebration effect component that displays animated fireworks.
 * Follows the same patterns as MusicalBackground component for consistency.
 * 
 * @example
 * // Basic usage with trigger
 * const [trigger, setTrigger] = useState(0);
 * <FireworkEffect trigger={trigger} />
 * 
 * @example
 * // With custom position and intensity
 * <FireworkEffect
 *   trigger={trigger}
 *   intensity="high"
 *   count={3}
 *   position={{ x: 50, y: 50 }}
 *   duration={3000}
 * />
 * 
 * @example
 * // Using the useFirework hook
 * const { trigger, launch, fireworkProps } = useFirework({
 *   intensity: 'medium',
 *   count: 2
 * });
 * <FireworkEffect {...fireworkProps} />
 * <button onClick={launch}>Celebrate!</button>
 */
interface FireworkEffectProps {
  /** Trigger firework effect */
  trigger?: boolean | number;
  /** Intensity of fireworks: 'low' | 'medium' | 'high' */
  intensity?: 'low' | 'medium' | 'high';
  /** Number of fireworks to launch */
  count?: number;
  /** Position where fireworks should appear (x, y in percentage) */
  position?: { x: number; y: number };
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Custom colors for fireworks */
  colors?: string[];
  /** Duration of the effect in milliseconds */
  duration?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  decay: number;
  size: number;
  color: string;
  trail: Array<{ x: number; y: number; opacity: number }>;
}

interface Firework {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  particles: Particle[];
  exploded: boolean;
  color: string;
  hue: number;
}

export const FireworkEffect: React.FC<FireworkEffectProps> = memo(({
  trigger = false,
  intensity = 'medium',
  count = 1,
  position,
  onComplete,
  colors,
  duration = 2000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const fireworksRef = useRef<Firework[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const triggerRef = useRef<boolean | number>(trigger);

  // Default colors matching the theme (gold and purple) - memoized to prevent re-creation
  const defaultColors = useMemo(() => colors || [
    'rgba(255, 194, 51,', // gold-400
    'rgba(232, 168, 34,', // gold-500
    'rgba(168, 85, 247,', // musical-500
    'rgba(147, 51, 234,', // musical-600
    'rgba(255, 215, 0,',  // gold-300
  ], [colors]);

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const createParticle = useCallback((
    x: number,
    y: number,
    color: string
  ): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 3 + 2) * (intensity === 'high' ? 1.5 : intensity === 'medium' ? 1 : 0.7);
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    return {
      x,
      y,
      vx,
      vy,
      life: 1,
      decay: (Math.random() * 0.02 + 0.015) * (intensity === 'high' ? 1.2 : 1),
      size: Math.random() * 3 + 2,
      color,
      trail: [],
    };
  }, [intensity]);

  const createFirework = useCallback((
    startX: number,
    startY: number,
    targetY: number,
    color: string
  ): Firework => {
    const particleCount = intensity === 'high' ? 80 : intensity === 'medium' ? 60 : 40;
    const particles: Particle[] = [];

    // Create particles for explosion
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle(startX, startY, color));
    }

    return {
      x: startX,
      y: startY,
      targetY,
      vy: -Math.random() * 3 - 4,
      particles,
      exploded: false,
      color,
      hue: 0,
    };
  }, [intensity, createParticle]);

  const launchFireworks = useCallback(() => {
    if (prefersReducedMotion()) {
      if (onComplete) onComplete();
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    fireworksRef.current = [];
    particlesRef.current = [];
    startTimeRef.current = Date.now();

    // Determine launch positions
    const launchX = position?.x !== undefined 
      ? (position.x / 100) * canvas.width 
      : canvas.width / 2;
    const launchY = position?.y !== undefined 
      ? (position.y / 100) * canvas.height 
      : canvas.height;

    // Launch multiple fireworks
    for (let i = 0; i < count; i++) {
      const delay = i * 200; // Stagger launches
      setTimeout(() => {
        const x = position?.x !== undefined 
          ? launchX + (Math.random() - 0.5) * 100
          : Math.random() * canvas.width;
        const y = launchY;
        const targetY = canvas.height * (0.2 + Math.random() * 0.3);
        const colorIndex = Math.floor(Math.random() * defaultColors.length);
        const color = defaultColors[colorIndex];

        const firework = createFirework(x, y, targetY, color);
        fireworksRef.current.push(firework);
      }, delay);
    }
  }, [count, position, createFirework, defaultColors, prefersReducedMotion, onComplete]);

  useEffect(() => {
    // Update trigger ref when trigger changes
    if (trigger !== triggerRef.current) {
      triggerRef.current = trigger;
      if (trigger) {
        launchFireworks();
      }
    }
  }, [trigger, launchFireworks]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let isAnimating = false;

    const animate = () => {
      if (!isAnimating) return;

      // Clear canvas with fade effect
      ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw fireworks
      fireworksRef.current = fireworksRef.current.filter((firework) => {
        if (!firework.exploded) {
          // Move firework up
          firework.y += firework.vy;
          firework.vy += 0.2; // Gravity

          // Draw firework trail
          ctx.beginPath();
          ctx.moveTo(firework.x, firework.y);
          ctx.lineTo(firework.x, firework.y + 10);
          ctx.strokeStyle = firework.color + '0.8)';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Check if reached target
          if (firework.y <= firework.targetY) {
            firework.exploded = true;
            // Add particles to main particles array
            particlesRef.current.push(...firework.particles);
          }

          return true;
        }
        return false;
      });

      // Update and draw particles
      particlesRef.current = particlesRef.current.filter((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.1; // Gravity
        particle.vx *= 0.98; // Air resistance
        particle.vy *= 0.98;

        // Update life
        particle.life -= particle.decay;

        // Add to trail
        particle.trail.push({ x: particle.x, y: particle.y, opacity: particle.life });
        if (particle.trail.length > 5) {
          particle.trail.shift();
        }

        // Draw trail
        particle.trail.forEach((point, index) => {
          const opacity = point.opacity * (index / particle.trail.length);
          ctx.beginPath();
          ctx.arc(point.x, point.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fillStyle = particle.color + opacity + ')';
          ctx.fill();
        });

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + particle.life + ')';
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color.replace('rgba(', '').replace(',', '');
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        return particle.life > 0;
      });

      // Check if animation should complete
      const elapsed = startTimeRef.current 
        ? Date.now() - startTimeRef.current 
        : 0;
      
      if (
        fireworksRef.current.length === 0 &&
        particlesRef.current.length === 0 &&
        elapsed > duration
      ) {
        isAnimating = false;
        if (onComplete) {
          onComplete();
        }
        return;
      }

      // Continue animation if there are active elements
      if (fireworksRef.current.length > 0 || particlesRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    };

    // Start animation when fireworks are launched
    const checkAndStartAnimation = () => {
      if ((fireworksRef.current.length > 0 || particlesRef.current.length > 0) && !isAnimating) {
        isAnimating = true;
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Check periodically if animation should start
    const intervalId = setInterval(checkAndStartAnimation, 100);

    return () => {
      isAnimating = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearInterval(intervalId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [duration, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ 
        opacity: 1,
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
}, (prevProps, nextProps) => {
  // Memo comparison - only re-render if trigger or key props change
  return (
    prevProps.trigger === nextProps.trigger &&
    prevProps.intensity === nextProps.intensity &&
    prevProps.count === nextProps.count &&
    prevProps.duration === nextProps.duration &&
    prevProps.position?.x === nextProps.position?.x &&
    prevProps.position?.y === nextProps.position?.y
  );
});

FireworkEffect.displayName = 'FireworkEffect';
