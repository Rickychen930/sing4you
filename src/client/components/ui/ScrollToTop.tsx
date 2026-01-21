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
        'fixed bottom-6 sm:bottom-8 right-6 sm:right-8 z-50',
        'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white',
        'rounded-full shadow-[0_4px_14px_rgba(255,194,51,0.4)]',
        'hover:shadow-[0_8px_24px_rgba(255,194,51,0.5),0_0_0_1px_rgba(255,194,51,0.2)]',
        'transition-all duration-300 hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900',
        'w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center',
        'backdrop-blur-sm border-2 border-gold-400/30 hover:border-gold-400/60',
        'relative overflow-hidden group',
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      )}
      aria-label="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gold-400/0 via-gold-400/0 to-gold-400/0 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md pointer-events-none"></div>
      
      <svg
        className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-transform duration-300 group-hover:-translate-y-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
});

ScrollToTop.displayName = 'ScrollToTop';
