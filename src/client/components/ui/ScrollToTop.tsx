import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { cn } from '../../utils/helpers';

export const ScrollToTop: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState('5rem');
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
    
    // Set bottom offset based on screen size to avoid overlap with BackgroundMusic
    const updateBottomOffset = () => {
      if (window.innerWidth >= 1024) {
        setBottomOffset('6rem');
      } else if (window.innerWidth >= 640) {
        setBottomOffset('5.5rem');
      } else {
        setBottomOffset('4.5rem');
      }
    };
    
    updateBottomOffset();
    window.addEventListener('resize', updateBottomOffset, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateBottomOffset);
    };
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
        'fixed z-[9999]',
        'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white',
        'rounded-full shadow-[0_6px_20px_rgba(255,194,51,0.5),0_0_0_1px_rgba(255,194,51,0.2)]',
        'hover:shadow-[0_12px_32px_rgba(255,194,51,0.7),0_0_0_2px_rgba(255,194,51,0.4),0_0_40px_rgba(255,194,51,0.4)]',
        'transition-all duration-500 hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900',
        'w-11 h-11 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center',
        'backdrop-blur-sm border-2 border-gold-400/40 hover:border-gold-400/70',
        'relative overflow-hidden group min-w-[44px] min-h-[44px]',
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      )}
      style={{
        position: 'fixed',
        bottom: bottomOffset,
        right: '1rem',
        zIndex: 9999
      }}
      aria-label="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
    >
      {/* Enhanced multi-layer glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 via-gold-400 to-gold-400 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500 blur-md pointer-events-none"></div>
      <div className="absolute -inset-2 bg-gradient-to-r from-gold-500 via-musical-500 to-gold-500 rounded-full opacity-0 group-hover:opacity-25 transition-opacity duration-700 blur-lg pointer-events-none"></div>
      
      <svg
        className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 relative z-10 transition-transform duration-300 group-hover:-translate-y-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.5)]"
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
