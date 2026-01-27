import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { cn } from '../../utils/helpers';

/** Fixed WhatsApp button bottom-right. Same position as Back to top when it's hidden; above Back to top when it's visible. */
export const FloatingWhatsApp: React.FC = memo(() => {
  const [mounted, setMounted] = useState(false);
  const [backToTopVisible, setBackToTopVisible] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const ticking = useRef(false);

  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY || window.pageYOffset || 0;
        setBackToTopVisible(scrolled > 400);
        setIsVisible(scrolled > 200);
        ticking.current = false;
      });
      ticking.current = true;
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    // Ensure scroll listener is properly attached
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also listen to scroll events on document for better compatibility
    document.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => {
      clearTimeout(t);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  const baseBottom = '1rem';
  // Slightly larger height to ensure we always sit comfortably above ScrollToTop
  const scrollToTopHeight = '4rem';
  const gap = '0.75rem';
  const bottomWhenScrolled = `calc(${baseBottom} + ${scrollToTopHeight} + ${gap})`;
  const bottom = backToTopVisible ? bottomWhenScrolled : baseBottom;

  return (
    <a
      href={generateWhatsAppLink()}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'fixed z-[9998]',
        'bg-[#25D366] text-white',
        'rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.5),0_0_0_1px_rgba(37,211,102,0.3),0_0_20px_rgba(37,211,102,0.2)]',
        'hover:bg-[#20BD5A] hover:shadow-[0_12px_32px_rgba(37,211,102,0.7),0_0_0_2px_rgba(37,211,102,0.4),0_0_30px_rgba(37,211,102,0.3)]',
        'transition-all duration-300 hover:scale-110 active:scale-95',
        'focus:outline-none focus:ring-2 focus:ring-[#25D366]/60 focus:ring-offset-2 focus:ring-offset-jazz-900',
        'w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center',
        'border-2 border-white/20 hover:border-white/40',
        'min-w-[56px] min-h-[56px]',
        'backdrop-blur-sm relative overflow-hidden group',
        'animate-pulse-soft',
        mounted && isVisible
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-10 scale-90 pointer-events-none'
      )}
      style={{ 
        position: 'fixed',
        bottom, 
        right: '1rem',
        zIndex: 9998
      }}
      aria-label="Contact us on WhatsApp"
    >
      <div className="absolute -inset-1 bg-[#25D366] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-md pointer-events-none" aria-hidden />
      <div className="absolute -inset-2 bg-[#25D366] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-lg pointer-events-none" aria-hidden />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-full overflow-hidden" aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
      </div>
      <svg
        className="w-7 h-7 sm:w-8 sm:h-8 relative z-10 transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
});

FloatingWhatsApp.displayName = 'FloatingWhatsApp';
