import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { cn } from '../../utils/helpers';

export const ScrollToTop: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [bottomOffset, setBottomOffset] = useState('1rem');
  const ticking = useRef(false);

  // OPTIMIZED: Better throttle with reduced frequency
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        // Show when scrolled past half of the page
        const scrollY = window.scrollY || window.pageYOffset || 0;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;
        const scrollableHeight = documentHeight - windowHeight;
        const halfScroll = scrollableHeight / 2;
        setIsVisible(scrollY > halfScroll);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  // Bottom offset from viewport - always at bottom-right, above other buttons
  const updateBottomOffset = useCallback(() => {
    // Always at bottom, no offset needed since WhatsApp adjusts to us
    setBottomOffset('1rem');
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      updateBottomOffset();
    }, 0);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [handleScroll, updateBottomOffset]);

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
        'fixed',
        'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-white',
        'rounded-full shadow-[0_8px_24px_rgba(255,194,51,0.5),0_0_0_1px_rgba(255,194,51,0.2),0_0_20px_rgba(255,194,51,0.2)]',
        'hover:shadow-[0_12px_32px_rgba(255,194,51,0.7),0_0_0_2px_rgba(255,194,51,0.4),0_0_30px_rgba(255,194,51,0.3)]',
        'transition-all duration-300 hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900',
        'w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center',
        'backdrop-blur-sm border-2 border-gold-400/40 hover:border-gold-400/70',
        'relative overflow-hidden group min-w-[56px] min-h-[56px] sm:min-w-[64px] sm:min-h-[64px]',
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      )}
      style={{
        position: 'fixed',
        bottom: bottomOffset,
        right: '1rem',
        zIndex: 9999,
      }}
      aria-label="Scroll to top"
      tabIndex={isVisible ? 0 : -1}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-gold-400 via-gold-400 to-gold-400 rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
      <div className="absolute -inset-2 bg-gradient-to-r from-gold-500 via-musical-500 to-gold-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg pointer-events-none" aria-hidden />
      <svg
        className="w-6 h-6 sm:w-7 sm:h-7 relative z-10 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)] group-hover:drop-shadow-[0_0_12px_rgba(255,194,51,0.45)]"
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
