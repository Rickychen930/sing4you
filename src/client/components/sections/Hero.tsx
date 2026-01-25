import { useEffect, useState, memo, useMemo, useCallback, useRef } from 'react';
import type { FC, CSSProperties, KeyboardEvent } from 'react';
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

  useEffect(() => {
    let isMounted = true;
    const abortController = new AbortController();

    const loadHeroSettings = async () => {
      try {
        const settings = await heroService.getSettings();
        // Only update state if component is still mounted
        if (isMounted && !abortController.signal.aborted) {
          setHeroSettings(settings);
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

  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleScrollDown();
    }
  }, [handleScrollDown]);

  if (loading || !heroSettings) {
    return (
      <section id="hero" className="relative w-full flex items-center justify-center -mt-16 sm:-mt-18 lg:-mt-20 pt-16 sm:pt-18 lg:pt-20 bg-black" style={{ minHeight: '100vh', height: '100vh', background: 'linear-gradient(135deg, var(--color-black) 0%, var(--color-dark-navy) 25%, var(--color-dark-blue) 50%, var(--color-dark-slate) 75%, var(--color-black) 100%)' }}>
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
      className="relative w-full flex items-center justify-center overflow-hidden particle-bg -mt-16 lg:-mt-20 pt-16 lg:pt-20" 
      style={{ 
        minHeight: '100vh', 
        height: '100vh',
        backgroundColor: 'var(--color-black)',
        background: 'linear-gradient(135deg, var(--color-black) 0%, var(--color-dark-navy) 25%, var(--color-dark-blue) 50%, var(--color-dark-slate) 75%, var(--color-black) 100%)'
      }}
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
        {heroSettings.backgroundVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={heroSettings.backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0" style={backgroundStyle}>
            <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/80 via-jazz-800/70 via-musical-900/60 to-jazz-900/80" />
            <div className="absolute inset-0 bg-black/30" />
          </div>
        )}
      </div>

      {/* Enhanced Musical decorative elements with advanced animations */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        <div className="absolute top-1/4 left-8 sm:left-10 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-gold-900/25 sm:text-gold-900/20 animate-float-advanced font-musical select-none glow-pulse-advanced drop-shadow-[0_0_20px_rgba(255,194,51,0.3)]">♪</div>
        <div className="absolute top-1/3 right-16 sm:right-20 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-musical-900/25 sm:text-musical-900/20 animate-float-advanced font-musical select-none glow-pulse-advanced drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]" style={{ animationDelay: '1s' }}>♫</div>
        <div className="absolute bottom-1/3 left-1/4 text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-gold-900/20 sm:text-gold-900/15 animate-float-advanced font-musical select-none glow-pulse-advanced drop-shadow-[0_0_25px_rgba(255,194,51,0.25)]" style={{ animationDelay: '2s' }}>♬</div>
        <div className="absolute bottom-1/4 right-1/3 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-musical-900/25 sm:text-musical-900/20 animate-float-advanced font-musical select-none glow-pulse-advanced drop-shadow-[0_0_15px_rgba(168,85,247,0.25)]" style={{ animationDelay: '3s' }}>♩</div>
        {/* Additional floating notes */}
        <div className="absolute top-1/2 left-1/3 text-2xl sm:text-3xl lg:text-4xl text-gold-400/20 sm:text-gold-400/15 animate-float-advanced font-musical select-none drop-shadow-[0_0_10px_rgba(255,194,51,0.2)]" style={{ animationDelay: '1.5s' }}>♪</div>
        <div className="absolute bottom-1/2 right-1/4 text-xl sm:text-2xl lg:text-3xl text-musical-400/20 sm:text-musical-400/15 animate-float-advanced font-musical select-none drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]" style={{ animationDelay: '2.5s' }}>♫</div>
      </div>

      {/* Enhanced Content with Advanced Effects - Optimized */}
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-scale-in">
        <div className="relative inline-block mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-elegant font-bold mb-2 sm:mb-2.5 lg:mb-3 leading-[1.1] gradient-text-animated text-reveal px-2 sm:px-3 lg:px-4" style={{ textShadow: '0 4px 20px rgba(255, 194, 51, 0.3), 0 2px 10px rgba(168, 85, 247, 0.2)' }}>
            {heroSettings.title}
            <span className="absolute -top-1 sm:-top-2 lg:-top-3 -right-4 sm:-right-6 lg:-right-8 xl:-right-12 text-xl sm:text-2xl lg:text-3xl xl:text-4xl opacity-60 animate-float-advanced font-musical pointer-events-none neon-glow">♪</span>
            <span className="absolute -bottom-0.5 sm:-bottom-1 lg:-bottom-2 -left-4 sm:-left-6 lg:-left-8 xl:-left-12 text-lg sm:text-xl lg:text-2xl xl:text-3xl opacity-50 animate-float-advanced font-musical pointer-events-none neon-glow-purple" style={{ animationDelay: '2s' }}>♫</span>
          </h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl mb-6 sm:mb-7 md:mb-9 lg:mb-11 xl:mb-14 text-gray-50 leading-relaxed font-normal font-sans max-w-3xl mx-auto relative inline-block animate-fade-in-up text-reveal px-3 sm:px-4" style={{ animationDelay: '0.3s' }}>
          {heroSettings.subtitle}
          <span className="absolute -bottom-1.5 sm:-bottom-2 lg:-bottom-3 left-1/2 -translate-x-1/2 w-24 sm:w-32 md:w-40 lg:w-48 xl:w-56 h-0.5 bg-gradient-to-r from-transparent via-gold-400/70 to-musical-500/70 to-transparent opacity-70 rounded-full"></span>
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 lg:gap-4 xl:gap-5 justify-center items-center max-w-md sm:max-w-lg mx-auto animate-fade-in-up px-3 sm:px-4" style={{ animationDelay: '0.6s' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleWhatsApp}
            className="glass-effect-strong hover-lift-advanced neon-glow group relative overflow-hidden"
          >
            <span className="relative z-10">{heroSettings.ctaWhatsApp.text}</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="glass-effect border-2 border-white/90 text-white hover:bg-white/20 hover:border-white hover-lift-advanced backdrop-blur-md shadow-lg hover:shadow-xl group relative overflow-hidden"
            onClick={handleEmail}
          >
            <span className="relative z-10">{heroSettings.ctaEmail.text}</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
          </Button>
        </div>
      </div>
      
      {/* Enhanced Scroll indicator with advanced effects - Fixed position */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 xl:bottom-10 2xl:bottom-14 left-1/2 -translate-x-1/2 z-20">
        <div 
          className="flex flex-col items-center gap-1 sm:gap-1.5 lg:gap-2 xl:gap-3 text-white/95 hover:text-white transition-all duration-300 cursor-pointer group glass-effect-strong rounded-full px-3 sm:px-4 lg:px-5 xl:px-6 py-2 sm:py-2.5 lg:py-3 xl:py-4 hover-lift-advanced backdrop-blur-md min-h-[44px] sm:min-h-[48px] lg:min-h-[52px] xl:min-h-[56px] min-w-[90px] sm:min-w-[100px] lg:min-w-[120px] flex items-center justify-center touch-manipulation active:scale-95 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-black"
          onClick={handleScrollDown}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Scroll to explore more content"
        >
          <span className="text-[10px] sm:text-xs lg:text-sm font-semibold tracking-wider uppercase text-gold-200 group-hover:text-gold-100 transition-colors">Scroll to explore</span>
          <svg 
            className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-gold-300 group-hover:text-gold-200 group-hover:translate-y-1 transition-all duration-500 animate-bounce glow-pulse-advanced" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';