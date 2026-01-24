import React, { memo } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MusicalBackground } from '../ui/MusicalBackground';
import { ScrollToTop } from '../ui/ScrollToTop';
import { CursorEffect } from '../ui/CursorEffect';
import { BackgroundMusic } from '../ui/BackgroundMusic';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export const Layout: React.FC<LayoutProps> = memo(({ children, isAdmin = false }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      {/* Animated musical background particles */}
      {!isAdmin && <MusicalBackground intensity="medium" />}
      
      {/* Gradient overlays - Reduced opacity for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-900/5 to-jazz-900/10 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-musical-900/5 via-transparent to-gold-900/5 pointer-events-none z-0" />
      
      {/* Musical decorative elements - Enhanced with subtle glow */}
      <div className="absolute top-16 sm:top-20 left-4 sm:left-5 lg:left-10 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-gold-900/10 sm:text-gold-900/8 pointer-events-none z-0 animate-float font-musical select-none drop-shadow-[0_0_20px_rgba(255,194,51,0.15)]">♪</div>
      <div className="absolute top-32 sm:top-40 right-6 sm:right-10 lg:right-20 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-musical-900/10 sm:text-musical-900/8 pointer-events-none z-0 animate-float font-musical select-none drop-shadow-[0_0_20px_rgba(168,85,247,0.15)]" style={{ animationDelay: '1s' }}>♫</div>
      <div className="absolute bottom-32 sm:bottom-40 left-1/4 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-gold-900/10 sm:text-gold-900/8 pointer-events-none z-0 animate-float font-musical select-none drop-shadow-[0_0_25px_rgba(255,194,51,0.15)]" style={{ animationDelay: '2s' }}>♬</div>
      <div className="absolute bottom-48 sm:bottom-60 right-1/3 text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-musical-900/10 sm:text-musical-900/8 pointer-events-none z-0 animate-float font-musical select-none drop-shadow-[0_0_15px_rgba(168,85,247,0.15)]" style={{ animationDelay: '3s' }}>♩</div>
      
      <Header isAdmin={isAdmin} />
      <main id="main-content" className="flex-grow pt-14 sm:pt-16 lg:pt-18 xl:pt-20 relative z-10" tabIndex={-1}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
      {/* Cursor Effect - desktop only */}
      {!isAdmin && <CursorEffect intensity="medium" disableOnMobile={true} />}
      {/* Background Music - 90s music */}
      {/* 
        To use background music:
        1. Add file at /public/music/90s-background.mp3, OR
        2. Provide URL via src prop as shown below:
      */}
      {!isAdmin && (
        <BackgroundMusic 
          // src="https://example.com/music/90s-jazz.mp3" // Uncomment and fill URL if you want to use external music
          volume={0.3} 
          autoPlay={true} 
          loop={true} 
          showControls={true} 
          controlsPosition="bottom-right" 
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.children === nextProps.children &&
    prevProps.isAdmin === nextProps.isAdmin
  );
});

Layout.displayName = 'Layout';