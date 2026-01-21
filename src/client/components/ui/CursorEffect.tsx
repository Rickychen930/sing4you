import React, { useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * CursorEffect Component
 * 
 * Menambahkan efek visual yang menarik pada kursor dengan trail partikel
 * yang mengikuti pergerakan mouse.
 * 
 * @example
 * <CursorEffect />
 */
interface CursorEffectProps {
  /** Intensitas efek: 'low' | 'medium' | 'high' */
  intensity?: 'low' | 'medium' | 'high';
  /** Warna partikel (default: gold dan purple theme) */
  colors?: string[];
  /** Nonaktifkan efek pada mobile */
  disableOnMobile?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  color: string;
  opacity: number;
}

export const CursorEffect: React.FC<CursorEffectProps> = ({
  intensity = 'medium',
  colors,
  disableOnMobile = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const lastParticleTimeRef = useRef<number>(0);

  // Default colors matching the theme (gold and purple) - memoized to prevent re-creation
  const defaultColors = useMemo(() => colors || [
    'rgba(255, 194, 51,', // gold-400
    'rgba(232, 168, 34,', // gold-500
    'rgba(126, 34, 206,', // musical-600
    'rgba(158, 34, 206,', // musical-500
    'rgba(255, 215, 0,',  // gold-300
  ], [colors]);

  // Particle settings based on intensity
  const particleSettings = {
    low: { count: 3, size: 3, speed: 0.3, decay: 0.02 },
    medium: { count: 5, size: 4, speed: 0.4, decay: 0.015 },
    high: { count: 8, size: 5, speed: 0.5, decay: 0.01 },
  };

  const settings = particleSettings[intensity];

  // Check if mobile device
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Create a new particle
  const createParticle = useCallback((x: number, y: number): Particle => {
    const angle = Math.random() * Math.PI * 2;
    const speed = (Math.random() * 0.5 + 0.5) * settings.speed;
    const colorIndex = Math.floor(Math.random() * defaultColors.length);
    const color = defaultColors[colorIndex];

    return {
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      size: Math.random() * settings.size + settings.size * 0.5,
      color,
      opacity: Math.random() * 0.5 + 0.5,
    };
  }, [settings, defaultColors]);

  // Handle mouse move
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (prefersReducedMotion() || (disableOnMobile && isMobile())) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    // Create particles at regular intervals
    const now = Date.now();
    if (now - lastParticleTimeRef.current > 50) {
      for (let i = 0; i < settings.count; i++) {
        particlesRef.current.push(
          createParticle(mouseRef.current.x, mouseRef.current.y)
        );
      }
      lastParticleTimeRef.current = now;
    }
  }, [prefersReducedMotion, disableOnMobile, isMobile, settings.count, createParticle]);

  // Animation loop - use ref to store function for recursive calls
  const animateRef = useRef<() => void>();
  
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with fade effect
    ctx.fillStyle = 'rgba(10, 14, 26, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particlesRef.current = particlesRef.current.filter((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Apply friction
      particle.vx *= 0.95;
      particle.vy *= 0.95;

      // Update life
      particle.life -= settings.decay;
      particle.opacity = particle.life;

      // Draw particle with glow effect
      if (particle.life > 0) {
        ctx.save();
        ctx.globalAlpha = particle.opacity;

        // Outer glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2
        );
        gradient.addColorStop(0, particle.color + particle.opacity + ')');
        gradient.addColorStop(0.5, particle.color + particle.opacity * 0.5 + ')');
        gradient.addColorStop(1, particle.color + '0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = particle.color + particle.opacity + ')';
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        return true;
      }

      return false;
    });

    if (animateRef.current) {
      animationFrameRef.current = requestAnimationFrame(animateRef.current);
    }
  }, [settings.decay]);
  
  // Update ref in effect to avoid updating during render
  useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  // Setup canvas and event listeners
  useEffect(() => {
    if (prefersReducedMotion() || (disableOnMobile && isMobile())) return;

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
    window.addEventListener('mousemove', handleMouseMove);

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [prefersReducedMotion, disableOnMobile, isMobile, handleMouseMove, animate]);

  // Don't render on mobile if disabled
  if (disableOnMobile && isMobile()) {
    return null;
  }

  // Don't render if reduced motion is preferred
  if (prefersReducedMotion()) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  );
};
