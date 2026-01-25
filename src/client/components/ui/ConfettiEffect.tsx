import React, { useEffect, useRef, memo, useCallback, useMemo } from 'react';

/**
 * ConfettiEffect Component
 * 
 * A celebration effect component that displays animated confetti.
 * Alternative to FireworkEffect, provides a different visual style.
 * Follows the same patterns as MusicalBackground component for consistency.
 * 
 * @example
 * // Basic usage with trigger
 * const [trigger, setTrigger] = useState(0);
 * <ConfettiEffect trigger={trigger} />
 * 
 * @example
 * // With custom intensity
 * <ConfettiEffect
 *   trigger={trigger}
 *   intensity="high"
 *   count={150}
 *   duration={3000}
 * />
 */
interface ConfettiEffectProps {
  /** Trigger confetti effect */
  trigger?: boolean | number;
  /** Intensity of confetti: 'low' | 'medium' | 'high' */
  intensity?: 'low' | 'medium' | 'high';
  /** Number of confetti pieces */
  count?: number;
  /** Duration of the effect in milliseconds */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Custom colors for confetti */
  colors?: string[];
}

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  color: string;
  shape: 'square' | 'circle' | 'triangle';
  life: number;
  decay: number;
}

export const ConfettiEffect: React.FC<ConfettiEffectProps> = memo(({
  trigger = false,
  intensity = 'medium',
  count,
  duration = 3000,
  onComplete,
  colors,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const confettiRef = useRef<ConfettiPiece[]>([]);
  const startTimeRef = useRef<number | null>(null);
  const triggerRef = useRef<boolean | number>(trigger);
  const timeoutIdsRef = useRef<number[]>([]);

  // Calculate particle count based on intensity
  const particleCount = count || (intensity === 'high' ? 150 : intensity === 'medium' ? 100 : 50);

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

  const createConfetti = useCallback((): ConfettiPiece => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return {
        x: 0, y: 0, vx: 0, vy: 0, rotation: 0, rotationSpeed: 0,
        size: 0, color: '', shape: 'square', life: 0, decay: 0
      };
    }

    const shapes: Array<'square' | 'circle' | 'triangle'> = ['square', 'circle', 'triangle'];
    const colorIndex = Math.floor(Math.random() * defaultColors.length);
    const color = defaultColors[colorIndex];

    return {
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      size: Math.random() * 8 + 4,
      color,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      life: 1,
      decay: Math.random() * 0.02 + 0.01,
    };
  }, [defaultColors]);

  const launchConfetti = useCallback(() => {
    if (prefersReducedMotion()) {
      if (onComplete) {
        setTimeout(onComplete, duration);
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Clear any pending timeouts
    timeoutIdsRef.current.forEach(id => clearTimeout(id));
    timeoutIdsRef.current = [];

    confettiRef.current = [];
    startTimeRef.current = Date.now();

    // Create confetti pieces
    for (let i = 0; i < particleCount; i++) {
      const timeoutId = window.setTimeout(() => {
        confettiRef.current.push(createConfetti());
      }, i * 10); // Stagger creation for more natural effect
      timeoutIdsRef.current.push(timeoutId);
    }
  }, [particleCount, createConfetti, prefersReducedMotion, duration, onComplete]);

  useEffect(() => {
    // Update trigger ref when trigger changes
    if (trigger !== triggerRef.current) {
      triggerRef.current = trigger;
      if (trigger) {
        launchConfetti();
      }
    }
  }, [trigger, launchConfetti]);

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
    window.addEventListener('resize', resizeCanvas, { passive: true });

    let isAnimating = false;

    const drawShape = (ctx: CanvasRenderingContext2D, piece: ConfettiPiece) => {
      ctx.save();
      ctx.translate(piece.x, piece.y);
      ctx.rotate(piece.rotation);
      ctx.fillStyle = piece.color + piece.life + ')';

      switch (piece.shape) {
        case 'square':
          ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
          break;
        case 'circle':
          ctx.beginPath();
          ctx.arc(0, 0, piece.size / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'triangle':
          ctx.beginPath();
          ctx.moveTo(0, -piece.size / 2);
          ctx.lineTo(-piece.size / 2, piece.size / 2);
          ctx.lineTo(piece.size / 2, piece.size / 2);
          ctx.closePath();
          ctx.fill();
          break;
      }

      ctx.restore();
    };

    const animate = () => {
      if (!isAnimating) return;

      // Clear canvas - optimized for performance
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(10, 14, 26, 0.03)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw confetti
      confettiRef.current = confettiRef.current.filter((piece) => {
        // Update position
        piece.x += piece.vx;
        piece.y += piece.vy;
        piece.vy += 0.15; // Gravity
        piece.vx *= 0.99; // Air resistance
        piece.rotation += piece.rotationSpeed;

        // Update life
        piece.life -= piece.decay;

        // Draw confetti piece
        if (piece.life > 0 && piece.y < canvas.height + 50) {
          drawShape(ctx, piece);
          return true;
        }

        return false;
      });

      // Check if animation should complete
      const elapsed = startTimeRef.current 
        ? Date.now() - startTimeRef.current 
        : 0;
      
      if (
        confettiRef.current.length === 0 &&
        elapsed > duration
      ) {
        isAnimating = false;
        if (onComplete) {
          onComplete();
        }
        return;
      }

      // Continue animation if there are active pieces
      if (confettiRef.current.length > 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        isAnimating = false;
      }
    };

    // Start animation when confetti is launched - no need for interval
    const checkAndStartAnimation = () => {
      if (confettiRef.current.length > 0 && !isAnimating) {
        isAnimating = true;
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    // Check immediately and use RAF instead of setInterval
    checkAndStartAnimation();
    let rafCheckId: number | null = null;
    const rafCheck = () => {
      checkAndStartAnimation();
      if (isAnimating || confettiRef.current.length > 0) {
        rafCheckId = requestAnimationFrame(rafCheck);
      } else {
        rafCheckId = null;
      }
    };
    rafCheckId = requestAnimationFrame(rafCheck);

    return () => {
      isAnimating = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rafCheckId !== null) {
        cancelAnimationFrame(rafCheckId);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [duration, onComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Clear all pending timeouts
      timeoutIdsRef.current.forEach(id => clearTimeout(id));
      timeoutIdsRef.current = [];
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
    prevProps.duration === nextProps.duration
  );
});

ConfettiEffect.displayName = 'ConfettiEffect';
