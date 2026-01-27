import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from '../ui/ScrollToTop';
import { FloatingWhatsApp } from '../ui/FloatingWhatsApp';
import { CursorEffect } from '../ui/CursorEffect';
import { BackgroundMusic } from '../ui/BackgroundMusic';

interface LayoutProps {
  children?: React.ReactNode;
  isAdmin?: boolean;
}

/** Layout: route element (Outlet) for public, or with children for admin/404. Stays mounted on public nav. */
export const Layout: React.FC<LayoutProps> = memo(({ children, isAdmin = false }) => {
  const mainContent = children ?? <Outlet />;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      <a href="#main-content" className="skip-to-main">
        Skip to main content
      </a>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gold-900/5 to-jazz-900/6 pointer-events-none z-0" aria-hidden />
      <div className="absolute inset-0 bg-gradient-to-r from-musical-900/5 via-transparent to-gold-900/5 pointer-events-none z-0" aria-hidden />
      <span className="absolute top-20 left-6 lg:left-12 text-2xl sm:text-3xl text-gold-400/20 font-musical animate-float select-none pointer-events-none z-0 layout-musical-note-1" aria-hidden>♪</span>
      <span className="absolute top-36 right-8 lg:right-16 text-xl sm:text-2xl text-musical-400/20 font-musical animate-float select-none pointer-events-none z-0 layout-musical-note-2" aria-hidden>♫</span>
      
      <Header isAdmin={isAdmin} />
      <main id="main-content" className="flex-grow pt-14 sm:pt-16 lg:pt-18 xl:pt-20 relative z-10" tabIndex={-1}>
        {mainContent}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
      {!isAdmin && <FloatingWhatsApp />}
      {!isAdmin && <CursorEffect intensity="medium" disableOnMobile={true} />}
      {!isAdmin && (
        <BackgroundMusic
          volume={0.3}
          autoPlay={true}
          loop={true}
          showControls={true}
          controlsPosition="bottom-right"
          disableOnMobile={true}
        />
      )}
    </div>
  );
}, (prev, next) => prev.isAdmin === next.isAdmin && prev.children === next.children);

Layout.displayName = 'Layout';
