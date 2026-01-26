import React, { useEffect, useRef, memo } from 'react';

interface MusicalBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const MusicalBackground: React.FC<MusicalBackgroundProps> = memo(({ intensity = 'medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);
  const lastFrameTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Disable alpha for better performance
    if (!ctx) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Throttled resize handler with requestAnimationFrame for smoother performance
    let resizeTimeout: number;
    let resizeRafId: number | null = null;
    const resizeCanvas = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      
      resizeTimeout = window.setTimeout(() => {
        resizeRafId = requestAnimationFrame(() => {
          if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
          resizeRafId = null;
        });
      }, 200); // Slightly longer delay for better performance
    };

    window.addEventListener('resize', resizeCanvas, { passive: true });

    // Intersection Observer to pause when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisibleRef.current = entries[0].isIntersecting;
      },
      { threshold: 0 }
    );
    observer.observe(canvas);

    // Musical particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      color: string;
      type: 'note' | 'wave';
      noteIndex: number;
    }> = [];

    // OPTIMIZED: Further reduced particle count for better performance
    const particleCount = intensity === 'high' ? 12 : intensity === 'medium' ? 8 : 4;
    const notes = ['♪', '♫', '♬', '♩'];
    const colors = ['rgba(255, 194, 51,', 'rgba(168, 85, 247,', 'rgba(232, 168, 34,', 'rgba(147, 51, 234,'];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.2, // OPTIMIZED: Even slower for better performance
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 12 + 10, // OPTIMIZED: Smaller particles
        opacity: Math.random() * 0.2 + 0.08, // OPTIMIZED: Lower opacity
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.8 ? 'wave' : 'note', // More notes, fewer waves
        noteIndex: Math.floor(Math.random() * notes.length),
      });
    }

    let timeOffset = 0;

    const animate = (currentTime: number) => {
      // OPTIMIZED: Throttle to ~30fps for better performance
      const optimizedThrottle = 33; // ~30fps instead of 60fps
      if (currentTime - lastFrameTimeRef.current < optimizedThrottle) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }
      lastFrameTimeRef.current = currentTime;

      // Pause when not visible
      if (!isVisibleRef.current) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      timeOffset = currentTime * 0.001;

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Bounce off edges
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // Keep in bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // Draw particle
        ctx.save();
        const alpha = particle.opacity * (0.8 + Math.sin(timeOffset + index) * 0.2);
        ctx.globalAlpha = alpha;
        
        if (particle.type === 'note') {
          // Use cached note index, update less frequently
          const note = notes[particle.noteIndex];
          ctx.fillStyle = particle.color + '0.3)';
          ctx.font = `bold ${particle.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(note, particle.x, particle.y);
        } else {
          // OPTIMIZED: Further simplified wave drawing - even fewer points
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          for (let i = 0; i < 12; i++) { // OPTIMIZED: Reduced from 20 to 12
            const x = particle.x + i * 4;
            const y = particle.y + Math.sin(i * 0.5 + timeOffset + index) * 8;
            ctx.lineTo(x, y);
          }
          ctx.strokeStyle = particle.color + '0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimeout) clearTimeout(resizeTimeout);
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      observer.disconnect();
      window.removeEventListener('resize', resizeCanvas);
    };

  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        opacity: 0.3,
        /* OPTIMIZED: Removed will-change - only set when animating */
        transform: 'translateZ(0)', // Force GPU acceleration
        /* OPTIMIZED: Use content-visibility for better performance */
        contentVisibility: 'auto',
      }}
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.intensity === nextProps.intensity;
});

MusicalBackground.displayName = 'MusicalBackground';
