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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      {/* Animated musical background particles */}
      {!isAdmin && <MusicalBackground intensity="medium" />}
      
      {/* Gradient overlays - Reduced opacity untuk better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-900/5 to-jazz-900/10 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-musical-900/5 via-transparent to-gold-900/5 pointer-events-none z-0" />
      
      {/* Musical decorative elements - Reduced opacity for better readability */}
      <div className="absolute top-20 left-10 text-5xl sm:text-6xl text-gold-900/8 pointer-events-none z-0 animate-float font-musical select-none">♪</div>
      <div className="absolute top-40 right-20 text-4xl sm:text-5xl text-musical-900/8 pointer-events-none z-0 animate-float font-musical select-none" style={{ animationDelay: '1s' }}>♫</div>
      <div className="absolute bottom-40 left-1/4 text-6xl sm:text-7xl text-gold-900/8 pointer-events-none z-0 animate-float font-musical select-none" style={{ animationDelay: '2s' }}>♬</div>
      <div className="absolute bottom-60 right-1/3 text-3xl sm:text-4xl text-musical-900/8 pointer-events-none z-0 animate-float font-musical select-none" style={{ animationDelay: '3s' }}>♩</div>
      
      <Header isAdmin={isAdmin} />
      <main id="main-content" className="flex-grow pt-16 lg:pt-20 relative z-20" tabIndex={-1}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
      {/* Cursor Effect - hanya untuk desktop */}
      {!isAdmin && <CursorEffect intensity="medium" disableOnMobile={true} />}
      {/* Background Music - musik 90s */}
      {/* 
        Untuk menggunakan musik latar:
        1. Tambahkan file di /public/music/90s-background.mp3, ATAU
        2. Berikan URL melalui prop src seperti contoh di bawah:
      */}
      {!isAdmin && (
        <BackgroundMusic 
          // src="https://example.com/music/90s-jazz.mp3" // Uncomment dan isi URL jika ingin menggunakan musik eksternal
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