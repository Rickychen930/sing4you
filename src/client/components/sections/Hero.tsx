import React, { useEffect, useState } from 'react';
import type { IHeroSettings } from '../../../shared/interfaces';
import { heroService } from '../../services/heroService';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';

export const Hero: React.FC = () => {
  const [heroSettings, setHeroSettings] = useState<IHeroSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeroSettings = async () => {
      try {
        const settings = await heroService.getSettings();
        setHeroSettings(settings);
      } catch (error) {
        console.error('Error loading hero settings:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHeroSettings();
  }, []);

  if (loading || !heroSettings) {
    return (
      <section id="hero" className="relative h-screen flex items-center justify-center bg-jazz-gradient">
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-white text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-elegant font-bold mb-4 bg-gradient-to-r from-gold-300 to-gold-100 bg-clip-text text-transparent">Christina Sings4U</h1>
          <div className="flex justify-center mt-4">
            <LoadingSpinner size="lg" className="text-gold-300" />
          </div>
        </div>
      </section>
    );
  }

  const backgroundStyle: React.CSSProperties = heroSettings.backgroundImage
    ? {
        backgroundImage: `url(${heroSettings.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {};

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {heroSettings.backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={heroSettings.backgroundVideo} type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0" style={backgroundStyle}>
          <div className="absolute inset-0 bg-gradient-to-b from-jazz-900/80 via-jazz-800/70 via-musical-900/60 to-jazz-900/80" />
          <div className="absolute inset-0 bg-black/30" />
          {/* Animated musical overlay */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold-600/30 rounded-full blur-3xl animate-musical-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-musical-600/30 rounded-full blur-3xl animate-musical-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
      )}

      {/* Musical decorative elements */}
      <div className="absolute inset-0 pointer-events-none z-5 overflow-hidden">
        <div className="absolute top-1/4 left-10 text-8xl text-gold-900/20 animate-float font-musical select-none">♪</div>
        <div className="absolute top-1/3 right-20 text-7xl text-musical-900/20 animate-float font-musical select-none" style={{ animationDelay: '1s' }}>♫</div>
        <div className="absolute bottom-1/3 left-1/4 text-9xl text-gold-900/15 animate-float font-musical select-none" style={{ animationDelay: '2s' }}>♬</div>
        <div className="absolute bottom-1/4 right-1/3 text-6xl text-musical-900/20 animate-float font-musical select-none" style={{ animationDelay: '3s' }}>♩</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-gold-900/10 animate-musical-pulse font-musical select-none">♪</div>
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="relative inline-block mb-6 sm:mb-8">
          <div className="absolute -inset-4 bg-gold-500/20 rounded-full blur-2xl opacity-60 animate-pulse"></div>
          <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-elegant font-bold mb-2 leading-[1.1] bg-gradient-to-r from-gold-300 via-gold-200 via-gold-100 to-gold-300 bg-clip-text text-transparent drop-shadow-2xl">
            {heroSettings.title}
            <span className="absolute -top-3 -right-8 sm:-right-12 text-3xl sm:text-4xl opacity-70 animate-float font-musical pointer-events-none">♪</span>
            <span className="absolute -bottom-2 -left-8 sm:-left-12 text-2xl sm:text-3xl opacity-60 animate-float font-musical pointer-events-none" style={{ animationDelay: '2s' }}>♫</span>
            <span className="absolute top-1/2 -right-10 sm:-right-16 text-2xl sm:text-3xl opacity-50 animate-sparkle font-musical pointer-events-none" style={{ animationDelay: '4s' }}>♬</span>
          </h1>
        </div>
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-8 sm:mb-10 md:mb-12 text-gray-100 leading-relaxed font-light drop-shadow-xl max-w-3xl mx-auto relative inline-block">
          {heroSettings.subtitle}
          <span className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-40 sm:w-56 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-70 rounded-full animate-wave"></span>
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center items-stretch sm:items-center max-w-md sm:max-w-lg mx-auto">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.open(generateWhatsAppLink(undefined, undefined), '_blank')}
          >
            {heroSettings.ctaWhatsApp.text}
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-white/90 text-white hover:bg-white/15 hover:border-white backdrop-blur-md shadow-lg hover:shadow-xl"
            onClick={() => window.location.href = generateMailtoLink()}
          >
            {heroSettings.ctaEmail.text}
          </Button>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors cursor-pointer group" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
            <span className="text-sm font-medium">Scroll to explore</span>
            <svg className="w-6 h-6 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};