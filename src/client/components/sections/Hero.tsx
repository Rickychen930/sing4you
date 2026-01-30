import { useEffect, useState, memo, useMemo, useCallback } from 'react';
import type { FC, CSSProperties } from 'react';
import type { IHeroSettings } from '../../../shared/interfaces';
import { heroService } from '../../services/heroService';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { TrustBadges } from './TrustBadges';
import { DecorativeEffects } from '../ui/DecorativeEffects';
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

    const loadHeroSettings = async (forceRefresh: boolean = false) => {
      try {
        const settings = await heroService.getSettings(!forceRefresh);
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

    // Listen for hero settings updates from other components (e.g., admin page)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'heroSettingsUpdated') {
        loadHeroSettings(true);
        localStorage.removeItem('heroSettingsUpdated');
      }
    };

    // Listen for custom event from same window (for admin updates)
    const handleCustomEvent = () => {
      if (isMounted && !abortController.signal.aborted) {
        loadHeroSettings(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('heroSettingsUpdated', handleCustomEvent);

    return () => {
      isMounted = false;
      abortController.abort();
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('heroSettingsUpdated', handleCustomEvent);
    };
  }, []);

  // Disabled parallax for better performance

  const backgroundStyle: CSSProperties = useMemo(() => {
    if (!heroSettings?.backgroundImage) return {};

    // Allow admin to control vertical framing of the hero background image
    const position = heroSettings.backgroundPosition || 'center';

    return {
      backgroundImage: `url(${heroSettings.backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: position,
    };
  }, [heroSettings?.backgroundImage, heroSettings?.backgroundPosition]);

  const handleWhatsApp = useCallback(() => {
    window.open(generateWhatsAppLink(undefined, undefined), '_blank');
  }, []);

  const handleEmail = useCallback(() => {
    window.location.href = generateMailtoLink();
  }, []);


  if (loading || !heroSettings) {
    return (
      <section id="hero" className="relative w-full flex items-center justify-center -mt-16 sm:-mt-18 lg:-mt-20 pt-16 sm:pt-18 lg:pt-20 bg-[var(--color-black)] hero-section-bg">
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
      className="relative w-full flex items-center justify-center overflow-visible -mt-16 lg:-mt-20 pt-16 lg:pt-20 hero-section-bg min-h-[85vh] sm:min-h-[90vh] theme-section-music-glow"
    >
      {/* CSS-only fireworks via DecorativeEffects (perf-safe) */}
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
            {/* Enhanced multi-layer gradient overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/85 via-jazz-800/75 via-musical-900/65 to-jazz-900/85" />
            {/* Subtle radial gradient for depth */}
            <div className="absolute inset-0 bg-radial-gradient from-gold-500/5 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,194,51,0.08) 0%, transparent 70%)' }} />
            <div className="absolute inset-0" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/80 via-jazz-800/70 via-musical-900/60 to-jazz-900/80">
            <div className="absolute inset-0" />
          </div>
        )}
      </div>

      {/* Subtle decorative elements - performance optimized */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-[1]" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-40 sm:h-40 rounded-full blur-2xl bg-gold-500/15 hero-glow-1" />
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-48 sm:h-48 rounded-full blur-2xl bg-musical-500/12 hero-glow-2" />
      </div>

      {/* Concert stage foreground: floor & strong spotlights */}
      <div className="absolute inset-x-0 bottom-0 h-40 sm:h-48 md:h-56 bg-gradient-to-t from-black/95 via-black/80 to-transparent pointer-events-none z-[2]" aria-hidden />
      {/* Left stage spotlight */}
      <div
        className="absolute -bottom-10 sm:-bottom-12 left-[-10%] sm:left-[-6%] w-40 sm:w-56 md:w-64 h-64 sm:h-80 md:h-[22rem] bg-gradient-to-t from-gold-500/55 via-gold-400/20 to-transparent opacity-80 sm:opacity-90 blur-3xl sm:blur-4xl rotate-[-10deg] pointer-events-none z-[2]"
        aria-hidden
      />
      {/* Right stage spotlight */}
      <div
        className="absolute -bottom-10 sm:-bottom-12 right-[-10%] sm:right-[-6%] w-40 sm:w-56 md:w-64 h-64 sm:h-80 md:h-[22rem] bg-gradient-to-t from-musical-500/55 via-musical-400/20 to-transparent opacity-80 sm:opacity-90 blur-3xl sm:blur-4xl rotate-[10deg] pointer-events-none z-[2]"
        aria-hidden
      />

      {/* Performance-optimized decorative effects — music, firework, sparkles (CSS-only) */}
      <DecorativeEffects
        fireworks
        musicalNotes
        mics
        stageLights
        sparkles
        className="z-[1] opacity-30"
      />
      
      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-scale-in">
        {/* Decorative line above title */}
        <div
          className="relative w-32 sm:w-40 md:w-48 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent rounded-full mx-auto mb-6 sm:mb-8 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute inset-0 animate-shimmer-musical opacity-60" />
        </div>
        <div className="relative inline-block mb-4 sm:mb-5 md:mb-6 animate-fade-in-up hero-glow-delay">
          {/* Subtle decorative accent behind title */}
          <div className="absolute -inset-4 sm:-inset-6 bg-gold-500/5 rounded-full blur-xl opacity-50" aria-hidden />
          <h1 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-elegant font-bold leading-tight px-2 sm:px-4 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
            {heroSettings.title}
          </h1>
        </div>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4 sm:mb-6 text-gray-200 leading-relaxed font-sans max-w-3xl mx-auto hero-subtitle animate-fade-in-up design-delay-fast">
          {heroSettings.subtitle}
        </p>
        <TrustBadges variant="hero" className="animate-fade-in-up design-delay-normal" />
        <p className="text-sm sm:text-base text-gold-300/90 font-medium mt-4 sm:mt-5 mb-2 sm:mb-3 font-sans animate-fade-in-up design-delay-medium">
          Trusted for 500+ events across Sydney — weddings, corporate & private occasions
        </p>
        <div
          className="relative w-24 sm:w-32 md:w-40 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent rounded-full mx-auto my-6 sm:my-8 overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 animate-shimmer-musical opacity-60" />
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-lg mx-auto animate-fade-in-up design-delay-slow">
          <Button
            variant="primary"
            size="lg"
            onClick={handleWhatsApp}
            className="w-full sm:w-auto group hover-lift-advanced shadow-[0_6px_20px_rgba(255,194,51,0.4)] hover:shadow-[0_8px_28px_rgba(255,194,51,0.5)] animate-musical-shine"
            aria-label="Contact via WhatsApp"
          >
            <span className="flex items-center justify-center gap-2">
              {heroSettings.ctaWhatsApp.text}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
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
      
    </section>
  );
});

Hero.displayName = 'Hero';