import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { smoothScrollTo } from '../utils/smoothScroll';

export const useSmoothScroll = (): void => {
  const location = useLocation();

  useEffect(() => {
    // Handle hash scroll after navigation
    if (location.hash) {
      const id = location.hash.substring(1);
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        smoothScrollTo(id);
      }, 100);
    }
  }, [location]);
};