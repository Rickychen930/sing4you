import React, { memo } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from '../ui/ScrollToTop';
import { CursorEffect } from '../ui/CursorEffect';
import { BackgroundMusic } from '../ui/BackgroundMusic';
import { CookieConsent } from '../ui/CookieConsent';
import { DecorativeEffects } from '../ui/DecorativeEffects';

interface LayoutProps {
  children?: React.ReactNode;
  isAdmin?: boolean;
}

/** Layout: route element (Outlet) for public, or with children for admin/404. Stays mounted on public nav. */
export const Layout: React.FC<LayoutProps> = memo(({ children, isAdmin = false }) => {
  const mainContent = children ?? <Outlet />;

  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-[#050816] via-[#0b1024] to-[#151b33] overflow-visible">
      <a href="#main-content" className="skip-to-main" aria-label="Skip to main content">
        Skip to main content
      </a>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0b1024]/50 to-black/70 pointer-events-none z-0" aria-hidden />
      {!isAdmin && <div className="theme-dot-grid" aria-hidden />}
      {!isAdmin && <div className="theme-vignette" aria-hidden />}
      {!isAdmin && (
        <DecorativeEffects
          fireworksLight
          musicalNotes
          sparkles
          className="fixed inset-0 z-0 opacity-60"
        />
      )}

      <Header isAdmin={isAdmin} />
      <main id="main-content" className="flex-grow pt-14 sm:pt-16 lg:pt-18 xl:pt-20 relative z-10 overflow-visible" tabIndex={-1}>
        {mainContent}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <ScrollToTop />}
      {!isAdmin && <CookieConsent />}
      {!isAdmin && <CursorEffect intensity="medium" disableOnMobile={true} />}
      {!isAdmin && (
        <BackgroundMusic
          volume={0.3}
          autoPlay={true}
          loop={true}
          showControls={true}
          controlsPosition="bottom-right"
          disableOnMobile={false}
          compact={true}
          bottomOffset="1rem"
        />
      )}
    </div>
  );
}, (prev, next) => prev.isAdmin === next.isAdmin && prev.children === next.children);

Layout.displayName = 'Layout';
