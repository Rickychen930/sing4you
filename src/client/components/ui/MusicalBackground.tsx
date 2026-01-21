import React, { useEffect, useRef, memo } from 'react';

interface MusicalBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
}

export const MusicalBackground: React.FC<MusicalBackgroundProps> = memo(({ intensity = 'medium' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);

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
    }> = [];

    const particleCount = intensity === 'high' ? 30 : intensity === 'medium' ? 20 : 10;
    const notes = ['♪', '♫', '♬', '♩'];
    const colors = ['rgba(255, 194, 51,', 'rgba(126, 34, 206,', 'rgba(232, 168, 34,', 'rgba(158, 34, 206,'];

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 20 + 15,
        opacity: Math.random() * 0.3 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: Math.random() > 0.7 ? 'wave' : 'note',
      });
    }

    let animationFrame: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

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
        ctx.globalAlpha = particle.opacity * (0.8 + Math.sin(Date.now() * 0.001 + index) * 0.2);
        
        if (particle.type === 'note') {
          const noteIndex = Math.floor((Date.now() * 0.0001 + index) % notes.length);
          const note = notes[noteIndex];
          ctx.fillStyle = particle.color + '0.3)';
          ctx.font = `bold ${particle.size}px serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(note, particle.x, particle.y);
        } else {
          // Draw wave
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          for (let i = 0; i < 30; i++) {
            const x = particle.x + i * 2;
            const y = particle.y + Math.sin(i * 0.3 + Date.now() * 0.002 + index) * 12;
            ctx.lineTo(x, y);
          }
          ctx.strokeStyle = particle.color + '0.4)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.restore();
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      window.removeEventListener('resize', resizeCanvas);
    };

  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.4 }}
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.intensity === nextProps.intensity;
});

MusicalBackground.displayName = 'MusicalBackground';
