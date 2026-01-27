import { useEffect, useState, memo, useMemo, useCallback } from 'react';
import type { FC, CSSProperties } from 'react';
import type { IHeroSettings } from '../../../shared/interfaces';
import { heroService } from '../../services/heroService';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
// import { FireworkEffect } from '../ui/FireworkEffect'; // Disabled for performance
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';

export const Hero: FC = memo(() => {
  const [heroSettings, setHeroSettings] = useState<IHeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadHeroSettings = async () => {
      try {
        const settings = await heroService.getSettings();
        // Only update state if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setHeroSettings(settings);
          // Reset error states when settings change
          setImageError(false);
          setVideoError(false);
        }
      } catch (error) {
        // Don't update state if component unmounted or aborted
        if (!isMounted || abortController.signal.aborted) return;
        
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading hero settings:', error);
        }
      } finally {
        if (isMounted && !abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadHeroSettings();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, []);

  // Disabled parallax for better performance

  const backgroundStyle: CSSProperties = useMemo(() => heroSettings?.backgroundImage
    ? {
        backgroundImage: `url(${heroSettings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}, [heroSettings?.backgroundImage]);

  const handleWhatsApp = useCallback(() => {
    window.open(generateWhatsAppLink(undefined, undefined), '_blank');
  }, []);

  const handleEmail = useCallback(() => {
    window.location.href = generateMailtoLink();
  }, []);

  const handleScrollDown = useCallback(() => {
    // Scroll to services section smoothly
    requestAnimationFrame(() => {
      const servicesSection = document.getElementById('services') || document.querySelector('[id*="service"]');
      if (servicesSection) {
        const headerOffset = 80;
        const elementPosition = servicesSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll to next section
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
      }
    });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleScrollDown();
    }
  }, [handleScrollDown]);

  if (loading || !heroSettings) {
    return (
      <section id="hero" className="relative w-full flex items-center justify-center -mt-16 sm:-mt-18 lg:-mt-20 pt-16 sm:pt-18 lg:pt-20 bg-black hero-section-bg">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-white text-center px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-elegant font-bold mb-3 sm:mb-4 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Christina Sings4U</h1>
          <div className="flex justify-center mt-3 sm:mt-4">
            <LoadingSpinner size="lg" className="text-gold-300" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="hero" 
      className="relative w-full flex items-center justify-center overflow-hidden particle-bg -mt-16 lg:-mt-20 pt-16 lg:pt-20 hero-section-bg"
    >
      {/* Disabled FireworkEffect for better performance */}
      {/* <FireworkEffect
        trigger={fireworkTrigger}
        intensity="medium"
        count={2}
        position={{ x: 50, y: 50 }}
        duration={2500}
      /> */}
      
      {/* Enhanced Parallax Background Layers - Optimized */}
      <div className="absolute inset-0">
        {heroSettings.backgroundVideo && !videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            aria-label="Background video"
            aria-hidden="true"
            onError={() => {
              setVideoError(true);
            }}
          >
            <source src={heroSettings.backgroundVideo} type="video/mp4" />
          </video>
        ) : heroSettings.backgroundImage && !imageError ? (
          <div className="absolute inset-0" style={backgroundStyle}>
            <img
              src={heroSettings.backgroundImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => {
                setImageError(true);
              }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/80 via-jazz-800/70 via-musical-900/60 to-jazz-900/80" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/80 via-jazz-800/70 via-musical-900/60 to-jazz-900/80">
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}
      </div>

      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden>
        <span className="absolute top-1/4 left-8 sm:left-12 text-4xl sm:text-5xl lg:text-6xl text-gold-400/20 font-musical animate-float select-none hero-musical-note-1">♪</span>
        <span className="absolute top-1/3 right-12 sm:right-16 text-3xl sm:text-4xl lg:text-5xl text-musical-400/20 font-musical animate-float select-none hero-musical-note-2">♫</span>
        <span className="absolute bottom-1/3 left-1/4 text-4xl sm:text-5xl lg:text-6xl text-gold-400/15 font-musical animate-float select-none hero-musical-note-3">♬</span>
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-scale-in">
        <div className="relative inline-block mb-4 sm:mb-5 md:mb-6">
          <div className="absolute -inset-6 sm:-inset-8 lg:-inset-10 bg-gold-500/15 rounded-full blur-2xl opacity-70" aria-hidden />
          <div className="absolute -inset-8 sm:-inset-12 bg-musical-500/10 rounded-full blur-2xl opacity-50 hero-glow-delay" aria-hidden />
          <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-elegant font-bold leading-tight px-2 sm:px-4 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
            {heroSettings.title}
          </h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 md:mb-10 text-gray-200 leading-relaxed font-sans max-w-3xl mx-auto relative pb-6 hero-subtitle">
          {heroSettings.subtitle}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 md:w-40 h-px bg-gradient-to-r from-transparent via-gold-400/70 to-transparent rounded-full" aria-hidden />
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={handleWhatsApp}
            className="w-full sm:w-auto hover-lift-advanced"
            aria-label="Contact via WhatsApp"
          >
            <span className="flex items-center justify-center gap-2">
              {heroSettings.ctaWhatsApp.text}
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={handleEmail}
            className="w-full sm:w-auto border-2 border-white/80 text-white hover:bg-white/15 hover:border-white backdrop-blur-sm"
            aria-label="Send email"
          >
            <span className="flex items-center justify-center gap-2">
              {heroSettings.ctaEmail.text}
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-5 sm:bottom-6 lg:bottom-8 left-1/2 -translate-x-1/2 z-20">
        <button
          type="button"
          onClick={handleScrollDown}
          onKeyDown={handleKeyDown}
          className="flex flex-col items-center gap-1 text-white/80 hover:text-gold-200 transition-colors cursor-pointer py-2 px-4 rounded-full min-h-[44px] justify-center touch-manipulation focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-transparent"
          aria-label="Scroll to explore more content"
        >
          <span className="text-[10px] sm:text-xs font-medium tracking-wider uppercase">Scroll</span>
          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400/80 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </button>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';