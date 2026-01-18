import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { MusicalBackground } from '../ui/MusicalBackground';
import { ScrollToTop } from '../ui/ScrollToTop';

interface LayoutProps {
  children: React.ReactNode;
  isAdmin?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, isAdmin = false }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Skip to main content for accessibility */}
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      {/* Animated musical background particles */}
      {!isAdmin && <MusicalBackground intensity="medium" />}
      
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-900/10 to-jazz-900/20 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-gradient-to-r from-musical-900/10 via-transparent to-gold-900/10 pointer-events-none z-0" />
      
      {/* Musical decorative elements */}
      <div className="absolute top-20 left-10 text-6xl text-gold-900/10 pointer-events-none z-0 animate-float font-musical select-none">♪</div>
      <div className="absolute top-40 right-20 text-5xl text-musical-900/10 pointer-events-none z-0 animate-float font-musical select-none" style={{ animationDelay: '1s' }}>♫</div>
      <div className="absolute bottom-40 left-1/4 text-7xl text-gold-900/10 pointer-events-none z-0 animate-float font-musical select-none" style={{ animationDelay: '2s' }}>♬</div>
      <div className="absolute bottom-60 right-1/3 text-4xl text-musical-900/10 pointer-events-none z-0 animate-float font-musical select-none" style={{ animationDelay: '3s' }}>♩</div>
      
      <Header isAdmin={isAdmin} />
      <main id="main-content" className="flex-grow pt-16 lg:pt-18 relative z-10" tabIndex={-1}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
    </div>
  );
};