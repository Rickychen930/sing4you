import { useState, useCallback } from 'react';

interface UseFireworkOptions {
  /** Intensity of fireworks */
  intensity?: 'low' | 'medium' | 'high';
  /** Number of fireworks to launch */
  count?: number;
  /** Position where fireworks should appear (x, y in percentage) */
  position?: { x: number; y: number };
  /** Duration of the effect in milliseconds */
  duration?: number;
}

/**
 * Hook to trigger firework effects
 * Returns trigger function and trigger value for FireworkEffect component
 */
export const useFirework = (options: UseFireworkOptions = {}) => {
  const [trigger, setTrigger] = useState(0);

  const launch = useCallback(() => {
    setTrigger(prev => prev + 1);
  }, []);

  return {
    trigger,
    launch,
    fireworkProps: {
      trigger,
      intensity: options.intensity || 'medium',
      count: options.count || 1,
      position: options.position,
      duration: options.duration || 2000,
    },
  };
};
