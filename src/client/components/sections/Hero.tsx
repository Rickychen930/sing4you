import React, { useEffect, useState, memo, useMemo, useCallback } from 'react';
import type { IHeroSettings } from '../../../shared/interfaces';
import { heroService } from '../../services/heroService';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { FireworkEffect } from '../ui/FireworkEffect';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';

export const Hero: React.FC = memo(() => {
  const [heroSettings, setHeroSettings] = useState<IHeroSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [fireworkTrigger, setFireworkTrigger] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const loadHeroSettings = async () => {
      try {
        const settings = await heroService.getSettings();
        setHeroSettings(settings);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading hero settings:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    loadHeroSettings();
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero');
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          setScrollY(window.scrollY);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const backgroundStyle: React.CSSProperties = useMemo(() => heroSettings?.backgroundImage
    ? {
        backgroundImage: `url(${heroSettings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {}, [heroSettings?.backgroundImage]);

  const handleWhatsApp = useCallback(() => {
    // Trigger firework effect on button click
    setFireworkTrigger(prev => prev + 1);
    window.open(generateWhatsAppLink(undefined, undefined), '_blank');
  }, []);

  const handleEmail = useCallback(() => {
    // Trigger firework effect on button click
    setFireworkTrigger(prev => prev + 1);
    window.location.href = generateMailtoLink();
  }, []);

  const handleScrollDown = useCallback(() => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleScrollDown();
    }
  }, [handleScrollDown]);

  if (loading || !heroSettings) {
    return (
      <section id="hero" className="relative h-screen flex items-center justify-center bg-jazz-gradient">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-elegant font-bold mb-4 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">Christina Sings4U</h1>
          <div className="flex justify-center mt-4">
            <LoadingSpinner size="lg" className="text-gold-300" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden particle-bg">
      {/* Firework Effect - Triggered on CTA button clicks */}
      <FireworkEffect
        trigger={fireworkTrigger}
        intensity="medium"
        count={2}
        position={{ x: 50, y: 50 }}
        duration={2500}
      />
      
      {/* Enhanced Parallax Background Layers */}
      <div 
        className="absolute inset-0 parallax-element" 
        style={{ 
          transform: `translateY(${scrollY * 0.5}px) translateZ(0)`,
          willChange: 'transform'
        }}
      >
        {heroSettings.backgroundVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            style={{ transform: `scale(1.1) translateY(${scrollY * 0.3}px)` }}
          >
            <source src={heroSettings.backgroundVideo} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0" style={backgroundStyle}>
            <div 
              className="absolute inset-0 bg-gradient-to-b from-jazz-900/80 via-jazz-800/70 via-musical-900/60 to-jazz-900/80"
              style={{ transform: `translateY(${scrollY * 0.2}px)` }}
            />
            <div className="absolute inset-0 bg-black/30" />
            {/* Enhanced animated musical overlay with more depth and parallax */}
            <div className="absolute inset-0 opacity-25">
              <div 
                className="absolute top-1/4 left-1/4 w-48 h-48 bg-gold-600/40 rounded-full blur-3xl animate-musical-pulse"
                style={{ transform: `translateY(${scrollY * 0.4}px)` }}
              ></div>
              <div 
                className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-musical-600/40 rounded-full blur-3xl animate-musical-pulse" 
                style={{ animationDelay: '1s', transform: `translateY(${scrollY * 0.3}px)` }}
              ></div>
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-500/30 rounded-full blur-3xl animate-musical-pulse" 
                style={{ animationDelay: '0.5s', transform: `translate(-50%, calc(-50% + ${scrollY * 0.35}px))` }}
              ></div>
            </div>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-900/10 to-transparent animate-gradient" style={{ backgroundSize: '200% 200%' }}></div>
          </div>
        )}
      </div>

      {/* Enhanced Musical decorative elements with advanced animations */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        <div className="absolute top-1/4 left-10 text-6xl sm:text-8xl text-gold-900/20 animate-float-advanced font-musical select-none glow-pulse-advanced">♪</div>
        <div className="absolute top-1/3 right-20 text-5xl sm:text-7xl text-musical-900/20 animate-float-advanced font-musical select-none glow-pulse-advanced" style={{ animationDelay: '1s' }}>♫</div>
        <div className="absolute bottom-1/3 left-1/4 text-7xl sm:text-9xl text-gold-900/15 animate-float-advanced font-musical select-none glow-pulse-advanced" style={{ animationDelay: '2s' }}>♬</div>
        <div className="absolute bottom-1/4 right-1/3 text-4xl sm:text-6xl text-musical-900/20 animate-float-advanced font-musical select-none glow-pulse-advanced" style={{ animationDelay: '3s' }}>♩</div>
        {/* Additional floating notes */}
        <div className="absolute top-1/2 left-1/3 text-3xl sm:text-4xl text-gold-400/15 animate-float-advanced font-musical select-none" style={{ animationDelay: '1.5s' }}>♪</div>
        <div className="absolute bottom-1/2 right-1/4 text-2xl sm:text-3xl text-musical-400/15 animate-float-advanced font-musical select-none" style={{ animationDelay: '2.5s' }}>♫</div>
      </div>

      {/* Enhanced Content with Advanced Effects and Parallax */}
      <div 
        className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto animate-scale-in depth-layer-2"
        style={{ transform: `translateY(${scrollY * 0.1}px) translateZ(0)` }}
      >
        <div className="relative inline-block mb-6 sm:mb-8">
          {/* Enhanced multi-layer glow effect */}
          <div className="absolute -inset-6 bg-gold-500/25 rounded-full blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute -inset-10 bg-gold-500/15 rounded-full blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -inset-14 bg-musical-500/15 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -inset-18 bg-gold-400/10 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          
          <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-elegant font-bold mb-2 leading-[1.1] gradient-text-animated drop-shadow-2xl text-reveal">
            {heroSettings.title}
            <span className="absolute -top-3 -right-8 sm:-right-12 text-3xl sm:text-4xl opacity-60 animate-float-advanced font-musical pointer-events-none neon-glow">♪</span>
            <span className="absolute -bottom-2 -left-8 sm:-left-12 text-2xl sm:text-3xl opacity-50 animate-float-advanced font-musical pointer-events-none neon-glow-purple" style={{ animationDelay: '2s' }}>♫</span>
          </h1>
        </div>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 md:mb-12 text-gray-100 leading-relaxed font-light drop-shadow-xl max-w-3xl mx-auto relative inline-block animate-fade-in-up text-reveal" style={{ animationDelay: '0.3s' }}>
          {heroSettings.subtitle}
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 sm:w-56 h-0.5 bg-gradient-to-r from-transparent via-gold-400/70 via-musical-500/70 to-transparent opacity-70 rounded-full shimmer-advanced"></span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center max-w-md sm:max-w-lg mx-auto animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
          <Button
            variant="primary"
            size="lg"
            onClick={handleWhatsApp}
            className="glass-effect-strong hover-lift-advanced neon-glow group relative overflow-hidden"
          >
            <span className="relative z-10">{heroSettings.ctaWhatsApp.text}</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-advanced"></span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="glass-effect border-2 border-white/90 text-white hover:bg-white/20 hover:border-white hover-lift-advanced backdrop-blur-md shadow-lg hover:shadow-xl group relative overflow-hidden"
            onClick={handleEmail}
          >
            <span className="relative z-10">{heroSettings.ctaEmail.text}</span>
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shimmer-advanced"></span>
          </Button>
        </div>
      </div>
      
      {/* Enhanced Scroll indicator with advanced effects */}
      <div className="absolute bottom-6 sm:bottom-8 lg:bottom-12 left-1/2 transform -translate-x-1/2 z-20 depth-layer-1">
        <div 
          className="flex flex-col items-center gap-2 text-white/90 hover:text-white transition-all duration-300 cursor-pointer group glass-effect rounded-full px-4 py-2 hover-lift-advanced"
          onClick={handleScrollDown}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Scroll to explore more content"
        >
          <span className="text-xs sm:text-sm font-medium tracking-wide uppercase">Scroll to explore</span>
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-y-2 transition-transform duration-500 animate-bounce glow-pulse-advanced" 
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