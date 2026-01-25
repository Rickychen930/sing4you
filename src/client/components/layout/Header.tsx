import React, { useState, useEffect, memo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = memo(({ isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Close admin dropdown when clicking outside - optimized with passive
  useEffect(() => {
    if (!isAdminMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.admin-menu-container')) {
        setIsAdminMenuOpen(false);
      }
    };

    // Use capture phase for better performance
    document.addEventListener('mousedown', handleClickOutside, { capture: true, passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
    };
  }, [isAdminMenuOpen]);

  // Close mobile menu when clicking outside - optimized with passive
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const headerElement = target.closest('header');
      if (!headerElement) {
        setIsMenuOpen(false);
      }
    };

    // Use capture phase for better performance
    document.addEventListener('mousedown', handleClickOutside, { capture: true, passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside, { capture: true });
    };
  }, [isMenuOpen]);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsAdminMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  if (isAdmin) {
    return null; // Admin header can be separate
  }

  return (
    <header className="glass-effect-strong shadow-elegant fixed w-full top-0 left-0 right-0 z-50 border-b border-gold-900/50 relative overflow-hidden transition-all duration-300">
      {/* Simplified decorative elements - reduced for performance */}
      <div className="absolute inset-0 pointer-events-none opacity-8 sm:opacity-6">
        <div className="absolute top-1/2 left-8 sm:left-10 text-xl sm:text-2xl text-gold-400/60 sm:text-gold-400/50 font-musical drop-shadow-[0_0_10px_rgba(255,194,51,0.2)]">♪</div>
        <div className="absolute top-1/2 right-8 sm:right-10 text-lg sm:text-xl text-musical-400/60 sm:text-musical-400/50 font-musical drop-shadow-[0_0_10px_rgba(168,85,247,0.2)]">♫</div>
      </div>
      
      {/* Simplified gradient overlay - removed shimmer for performance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-900/8 sm:via-gold-900/6 to-transparent pointer-events-none opacity-30 sm:opacity-20" />
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18 xl:h-20">
          <Link 
            to="/" 
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-elegant font-bold gradient-text-animated hover:scale-110 transition-all duration-300 transform relative group scale-on-hover"
            aria-label="Home - Christina Sings4U"
          >
            <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(255,194,51,0.3)]">Christina Sings4U</span>
            <span className="absolute -top-0.5 sm:-top-1 -right-1.5 sm:-right-2 lg:-right-3 text-[10px] sm:text-xs lg:text-sm opacity-0 group-hover:opacity-90 sm:group-hover:opacity-80 transition-opacity duration-300 font-musical drop-shadow-[0_0_12px_rgba(255,194,51,0.5)]">♪</span>
            <span className="absolute -bottom-0.5 sm:-bottom-1 -left-1.5 sm:-left-2 lg:-left-3 text-[10px] sm:text-xs lg:text-sm opacity-0 group-hover:opacity-70 sm:group-hover:opacity-60 transition-opacity duration-300 font-musical drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">♫</span>
          </Link>

          <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2 2xl:space-x-3">
            <Link
              to="/"
              className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-gray-50 hover:text-gold-200 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/40 hover:shadow-[0_4px_12px_rgba(255,194,51,0.2)] link-underline magnetic-hover-advanced hover-lift-advanced min-h-[48px] flex items-center leading-relaxed"
              aria-label="Navigate to home page"
            >
              <span className="relative z-10 group-hover:drop-shadow-[0_0_8px_rgba(255,194,51,0.4)] transition-all duration-300">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-500 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_8px_rgba(255,194,51,0.5)]" />
            </Link>
            <Link
              to="/about"
              className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-gray-50 hover:text-gold-200 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] link-underline magnetic-hover min-h-[48px] flex items-center leading-relaxed"
              aria-label="Navigate to about page"
            >
              <span className="relative z-10 group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.3)] transition-all duration-300">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(255,194,51,0.4)]" />
            </Link>
            <Link
              to="/categories"
              className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-gray-50 hover:text-gold-200 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] link-underline magnetic-hover min-h-[48px] flex items-center leading-relaxed"
              aria-label="Navigate to categories page"
            >
              <span className="relative z-10 group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.3)] transition-all duration-300">Services</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(255,194,51,0.4)]" />
            </Link>
            <Link
              to="/performances"
              className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-gray-50 hover:text-gold-200 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] link-underline magnetic-hover min-h-[48px] flex items-center leading-relaxed"
              aria-label="Navigate to performances page"
            >
              <span className="relative z-10 group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.3)] transition-all duration-300">Performances</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(255,194,51,0.4)]" />
            </Link>
            <Link
              to="/contact"
              className="px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg text-gray-50 hover:text-gold-200 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] link-underline magnetic-hover min-h-[48px] flex items-center leading-relaxed"
              aria-label="Navigate to contact page"
            >
              <span className="relative z-10 group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.3)] transition-all duration-300">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 group-hover:w-full transition-all duration-300 rounded-full shadow-[0_0_6px_rgba(255,194,51,0.4)]" />
            </Link>
            
            {/* Admin Menu */}
            {isAuthenticated ? (
              <div className="relative admin-menu-container">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center space-x-1 text-gray-50 hover:text-gold-300 transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm sm:text-base min-h-[48px] leading-relaxed"
                  aria-label="Admin menu"
                  aria-expanded={isAdminMenuOpen}
                  aria-haspopup="true"
                >
                  <span>Admin</span>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300" style={{ transform: isAdminMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isAdminMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-40 sm:w-48 bg-jazz-900/98 rounded-lg sm:rounded-xl shadow-lg py-1 z-50 border-2 border-gold-900/40 hover:border-gold-800/50 transition-colors duration-200"
                    role="menu"
                    aria-label="Admin menu"
                  >
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-50 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 hover:text-gold-200 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-inset rounded-lg mx-1 min-h-[44px] sm:min-h-[48px] flex items-center group leading-relaxed"
                      onClick={() => setIsAdminMenuOpen(false)}
                      role="menuitem"
                    >
                      <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Dashboard</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base text-gray-50 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 hover:text-gold-200 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-inset rounded-lg mx-1 min-h-[44px] sm:min-h-[48px] flex items-center group leading-relaxed"
                      role="menuitem"
                      aria-label="Logout from admin account"
                    >
                      <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-50 hover:text-gold-300 transition-all duration-300 font-medium relative after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-gold-400 after:to-gold-300 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg min-h-[48px] flex items-center leading-relaxed"
                aria-label="Navigate to admin login page"
              >
                Admin
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-50 hover:text-gold-300 transition-all duration-300 p-2.5 -mr-2 min-w-[48px] sm:min-w-[52px] min-h-[48px] sm:min-h-[52px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg active:scale-95 touch-manipulation"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div 
            id="mobile-menu"
            className="md:hidden py-3 sm:py-4 lg:py-5 space-y-1.5 sm:space-y-2 lg:space-y-3 bg-jazz-900/98 rounded-lg sm:rounded-xl mt-2 sm:mt-3 lg:mt-4 border-2 border-gold-900/50 hover:border-gold-800/60 shadow-lg animate-fade-in transition-colors duration-200"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <Link
              to="/"
              className="block text-base sm:text-lg text-gray-50 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/50 hover:to-musical-900/50 px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              <span className="flex items-center">
                <span className="mr-1.5 sm:mr-2 text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]">♪</span>
                <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Home</span>
              </span>
            </Link>
            <Link
              to="/about"
              className="block text-base sm:text-lg text-gray-50 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/50 hover:to-musical-900/50 px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">About</span>
            </Link>
            <Link
              to="/categories"
              className="block text-base sm:text-lg text-gray-50 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/50 hover:to-musical-900/50 px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Services</span>
            </Link>
            <Link
              to="/performances"
              className="block text-base sm:text-lg text-gray-50 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/50 hover:to-musical-900/50 px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Performances</span>
            </Link>
            <Link
              to="/contact"
              className="block text-base sm:text-lg text-gray-50 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/50 hover:to-musical-900/50 px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Contact</span>
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block text-sm sm:text-base text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[44px] sm:min-h-[48px] flex items-center touch-manipulation"
                  onClick={closeMobileMenu}
                  role="menuitem"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeMobileMenu();
                  }}
                  className="block w-full text-left text-sm sm:text-base text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[44px] sm:min-h-[48px] touch-manipulation"
                  role="menuitem"
                  aria-label="Logout from admin account"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="block text-sm sm:text-base text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-3 sm:px-4 py-2 sm:py-2.5 lg:py-3 rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[44px] sm:min-h-[48px] flex items-center touch-manipulation"
                onClick={closeMobileMenu}
                role="menuitem"
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}, (prevProps, nextProps) => {
  return prevProps.isAdmin === nextProps.isAdmin;
});

Header.displayName = 'Header';