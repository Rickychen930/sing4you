import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { cn } from '../../utils/helpers';

export const ScrollToTop: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const ticking = useRef(false);

  // Throttle scroll event for better performance
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        setIsVisible(window.pageYOffset > 400);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      scrollToTop();
    }
  }, [scrollToTop]);

  return (
    <button
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      className={cn(
        'fixed bottom-8 right-8 z-50 p-3 sm:p-4 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white rounded-full shadow-lg hover:shadow-2xl hover:shadow-gold-500/50 transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 min-w-[44px] min-h-[44px] flex items-center justify-center',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
      )}
      aria-label="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
    >
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
});

ScrollToTop.displayName = 'ScrollToTop';
