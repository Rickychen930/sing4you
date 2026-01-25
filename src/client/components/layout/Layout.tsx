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
      
      {/* Simplified musical decorative elements - reduced animations for performance */}
      <div className="absolute top-16 sm:top-20 left-4 sm:left-5 lg:left-10 text-3xl sm:text-4xl lg:text-5xl text-gold-900/8 sm:text-gold-900/6 pointer-events-none z-0 font-musical select-none drop-shadow-[0_0_15px_rgba(255,194,51,0.1)]">♪</div>
      <div className="absolute top-32 sm:top-40 right-6 sm:right-10 lg:right-20 text-2xl sm:text-3xl lg:text-4xl text-musical-900/8 sm:text-musical-900/6 pointer-events-none z-0 font-musical select-none drop-shadow-[0_0_15px_rgba(168,85,247,0.1)]">♫</div>
      
      <Header isAdmin={isAdmin} />
      <main id="main-content" className="flex-grow pt-14 sm:pt-16 lg:pt-18 xl:pt-20 relative z-10" tabIndex={-1}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
      {/* Cursor Effect - desktop only */}
      {!isAdmin && <CursorEffect intensity="medium" disableOnMobile={true} />}
      {/* Background Music */}
      {/* 
        Background music file: /public/background_music.mp3
        To use custom music, provide URL via src prop:
      */}
      {!isAdmin && (
        <BackgroundMusic 
          // src="/background_music.mp3" // Default file from public folder
          // src="https://example.com/music/custom-music.mp3" // Or use external URL
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