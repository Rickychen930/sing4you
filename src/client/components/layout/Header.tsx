import React, { useState, useEffect, memo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Dropdown, DropdownItem } from '../ui/Dropdown';

interface HeaderProps {
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = memo(({ isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false); // Used by Dropdown component
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Helper function to check if a route is active
  const isActiveRoute = useCallback((path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Note: Admin dropdown now uses Dropdown component with built-in click outside handling

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
      <div className="absolute inset-0 pointer-events-none opacity-[0.08] sm:opacity-[0.06]">
        <span className="absolute top-1/2 left-8 sm:left-10 text-xl sm:text-2xl text-gold-400/30 font-musical animate-float" aria-hidden>♪</span>
        <span className="absolute top-1/2 right-8 sm:right-10 text-lg sm:text-xl text-musical-400/30 font-musical animate-float header-musical-note" aria-hidden>♫</span>
      </div>
      
      {/* Simplified gradient overlay - removed shimmer for performance */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-900/8 sm:via-gold-900/6 to-transparent pointer-events-none opacity-30 sm:opacity-20" />
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18 xl:h-20">
          <Link 
            to="/" 
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 relative group"
            aria-label="Home - Christina Sings4U"
          >
            <span className="relative z-10 drop-shadow-[0_2px_8px_rgba(255,194,51,0.3)]">Christina Sings4U</span>
            <span className="absolute -top-0.5 sm:-top-1 -right-1.5 sm:-right-2 lg:-right-3 text-[10px] sm:text-xs lg:text-sm opacity-0 group-hover:opacity-90 sm:group-hover:opacity-80 transition-opacity duration-300 font-musical drop-shadow-[0_0_12px_rgba(255,194,51,0.5)]">♪</span>
            <span className="absolute -bottom-0.5 sm:-bottom-1 -left-1.5 sm:-left-2 lg:-left-3 text-[10px] sm:text-xs lg:text-sm opacity-0 group-hover:opacity-70 sm:group-hover:opacity-60 transition-opacity duration-300 font-musical drop-shadow-[0_0_12px_rgba(168,85,247,0.5)]">♫</span>
          </Link>

          <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2 2xl:space-x-3">
            <Link
              to="/"
              className={`px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/40 hover:shadow-[0_4px_12px_rgba(255,194,51,0.2)] link-underline magnetic-hover-advanced hover-lift-advanced min-h-[48px] flex items-center leading-relaxed ${
                isActiveRoute('/') 
                  ? 'text-gold-200 bg-gold-900/40 shadow-[0_2px_8px_rgba(255,194,51,0.2)]' 
                  : 'text-gray-200 hover:text-gold-200'
              }`}
              aria-label="Navigate to home page"
              aria-current={isActiveRoute('/') ? 'page' : undefined}
            >
              <span className={`relative z-10 transition-all duration-300 ${
                isActiveRoute('/') 
                  ? 'drop-shadow-[0_0_10px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_8px_rgba(255,194,51,0.4)]'
              }`}>Home</span>
              <span className={`absolute bottom-0 left-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-500 rounded-full shadow-[0_0_8px_rgba(255,194,51,0.5)] transition-all duration-300 ${
                isActiveRoute('/') ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
            <Link
              to="/about"
              className={`px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] link-underline magnetic-hover min-h-[48px] flex items-center leading-relaxed ${
                isActiveRoute('/about') 
                  ? 'text-gold-200 bg-gold-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]' 
                  : 'text-gray-200 hover:text-gold-200'
              }`}
              aria-label="Navigate to about page"
              aria-current={isActiveRoute('/about') ? 'page' : undefined}
            >
              <span className={`relative z-10 transition-all duration-300 ${
                isActiveRoute('/about') 
                  ? 'drop-shadow-[0_0_10px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.3)]'
              }`}>About</span>
              <span className={`absolute bottom-0 left-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 rounded-full shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300 ${
                isActiveRoute('/about') ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
            <Link
              to="/categories"
              className={`px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] link-underline magnetic-hover min-h-[48px] flex items-center leading-relaxed ${
                isActiveRoute('/categories') 
                  ? 'text-gold-200 bg-gold-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]' 
                  : 'text-gray-200 hover:text-gold-200'
              }`}
              aria-label="Navigate to categories page"
              aria-current={isActiveRoute('/categories') ? 'page' : undefined}
            >
              <span className={`relative z-10 transition-all duration-300 ${
                isActiveRoute('/categories') 
                  ? 'drop-shadow-[0_0_10px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.3)]'
              }`}>Services</span>
              <span className={`absolute bottom-0 left-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 rounded-full shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300 ${
                isActiveRoute('/categories') ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
            <Link
              to="/performances"
              className={`px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] link-underline magnetic-hover min-h-[48px] flex items-center leading-relaxed ${
                isActiveRoute('/performances') 
                  ? 'text-gold-200 bg-gold-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]' 
                  : 'text-gray-200 hover:text-gold-200'
              }`}
              aria-label="Navigate to performances page"
              aria-current={isActiveRoute('/performances') ? 'page' : undefined}
            >
              <span className={`relative z-10 transition-all duration-300 ${
                isActiveRoute('/performances') 
                  ? 'drop-shadow-[0_0_10px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.3)]'
              }`}>Performances</span>
              <span className={`absolute bottom-0 left-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 rounded-full shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300 ${
                isActiveRoute('/performances') ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
            <Link
              to="/contact"
              className={`px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 hover:shadow-[0_4px_12px_rgba(255,194,51,0.15)] link-underline magnetic-hover min-h-[48px] flex items-center leading-relaxed ${
                isActiveRoute('/contact') 
                  ? 'text-gold-200 bg-gold-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]' 
                  : 'text-gray-200 hover:text-gold-200'
              }`}
              aria-label="Navigate to contact page"
              aria-current={isActiveRoute('/contact') ? 'page' : undefined}
            >
              <span className={`relative z-10 transition-all duration-300 ${
                isActiveRoute('/contact') 
                  ? 'drop-shadow-[0_0_10px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.3)]'
              }`}>Contact</span>
              <span className={`absolute bottom-0 left-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 rounded-full shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300 ${
                isActiveRoute('/contact') ? 'w-full' : 'w-0 group-hover:w-full'
              }`} />
            </Link>
            
            {/* Admin Menu */}
            {isAuthenticated ? (
              <Dropdown
                align="right"
                onOpenChange={(open) => {
                  setIsAdminMenuOpen(open);
                }}
                trigger={
                  <button
                    className="flex items-center space-x-1 text-gray-200 hover:text-gold-300 transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-3 sm:px-3.5 py-2 sm:py-2.5 text-sm sm:text-base min-h-[48px] leading-relaxed"
                    aria-label="Admin menu"
                    aria-haspopup="true"
                    aria-expanded={isAdminMenuOpen}
                  >
                    <span>Admin</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-300" style={{ transform: isAdminMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                }
                menuClassName="w-40 sm:w-48"
              >
                <DropdownItem
                  as="link"
                  to="/admin/dashboard"
                  onClick={() => setIsAdminMenuOpen(false)}
                >
                  Dashboard
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    handleLogout();
                    setIsAdminMenuOpen(false);
                  }}
                >
                  Logout
                </DropdownItem>
              </Dropdown>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-200 hover:text-gold-300 transition-all duration-300 font-medium relative after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-gold-400 after:to-gold-300 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg min-h-[48px] flex items-center leading-relaxed"
                aria-label="Navigate to admin login page"
              >
                Admin
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-200 hover:text-gold-300 transition-all duration-300 p-2.5 -mr-2 min-w-[48px] sm:min-w-[52px] min-h-[48px] sm:min-h-[52px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg active:scale-95 touch-manipulation relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg 
              className={`h-5 w-5 sm:h-6 sm:w-6 transition-transform duration-300 ${isMenuOpen ? 'rotate-90' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12"
                  className="animate-fade-in"
                />
              ) : (
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 6h16M4 12h16M4 18h16"
                  className="animate-fade-in"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu backdrop */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
        {/* Mobile menu */}
        <div 
          id="mobile-menu"
          className={`md:hidden fixed top-14 sm:top-16 lg:top-18 xl:top-20 left-0 right-0 bottom-0 overflow-y-auto z-50 transform transition-transform duration-300 ease-out ${
            isMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          role="menu"
          aria-label="Mobile navigation menu"
          aria-hidden={!isMenuOpen}
        >
          <div className="py-3 sm:py-4 lg:py-5 px-4 sm:px-6 space-y-1.5 sm:space-y-2 lg:space-y-3 bg-jazz-900/98 backdrop-blur-md rounded-lg sm:rounded-xl mt-2 sm:mt-3 lg:mt-4 mx-4 sm:mx-6 border-2 border-gold-900/50 hover:border-gold-800/60 shadow-lg">
            <Link
              to="/"
              className={`block text-base sm:text-lg px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed animate-fade-in-up ${
                isActiveRoute('/')
                  ? 'text-gold-200 bg-gradient-to-r from-gold-900/60 to-musical-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]'
                  : 'text-gray-200 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40'
              }`}
              style={{ animationDelay: isMenuOpen ? '0.1s' : '0s' }}
              onClick={closeMobileMenu}
              role="menuitem"
              aria-current={isActiveRoute('/') ? 'page' : undefined}
            >
              <span className="flex items-center">
                <span className={`mr-1.5 sm:mr-2 text-gold-500 transition-opacity text-xs sm:text-sm drop-shadow-[0_0_8px_rgba(255,194,51,0.5)] ${
                  isActiveRoute('/') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`}>♪</span>
                <span className={`transition-all duration-300 ${
                  isActiveRoute('/') 
                    ? 'drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]' 
                    : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)]'
                }`}>Home</span>
              </span>
            </Link>
            <Link
              to="/about"
              className={`block text-base sm:text-lg px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed animate-fade-in-up ${
                isActiveRoute('/about')
                  ? 'text-gold-200 bg-gradient-to-r from-gold-900/60 to-musical-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]'
                  : 'text-gray-200 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40'
              }`}
              style={{ animationDelay: isMenuOpen ? '0.15s' : '0s' }}
              onClick={closeMobileMenu}
              role="menuitem"
              aria-current={isActiveRoute('/about') ? 'page' : undefined}
            >
              <span className={`transition-all duration-300 ${
                isActiveRoute('/about') 
                  ? 'drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)]'
              }`}>About</span>
            </Link>
            <Link
              to="/categories"
              className={`block text-base sm:text-lg px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed animate-fade-in-up ${
                isActiveRoute('/categories')
                  ? 'text-gold-200 bg-gradient-to-r from-gold-900/60 to-musical-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]'
                  : 'text-gray-200 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40'
              }`}
              style={{ animationDelay: isMenuOpen ? '0.2s' : '0s' }}
              onClick={closeMobileMenu}
              role="menuitem"
              aria-current={isActiveRoute('/categories') ? 'page' : undefined}
            >
              <span className={`transition-all duration-300 ${
                isActiveRoute('/categories') 
                  ? 'drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)]'
              }`}>Services</span>
            </Link>
            <Link
              to="/performances"
              className={`block text-base sm:text-lg px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed animate-fade-in-up ${
                isActiveRoute('/performances')
                  ? 'text-gold-200 bg-gradient-to-r from-gold-900/60 to-musical-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]'
                  : 'text-gray-200 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40'
              }`}
              style={{ animationDelay: isMenuOpen ? '0.25s' : '0s' }}
              onClick={closeMobileMenu}
              role="menuitem"
              aria-current={isActiveRoute('/performances') ? 'page' : undefined}
            >
              <span className={`transition-all duration-300 ${
                isActiveRoute('/performances') 
                  ? 'drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)]'
              }`}>Performances</span>
            </Link>
            <Link
              to="/contact"
              className={`block text-base sm:text-lg px-4 sm:px-5 py-3 sm:py-3.5 lg:py-4 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-[0_6px_16px_rgba(255,194,51,0.2)] focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[48px] sm:min-h-[52px] flex items-center touch-manipulation group leading-relaxed animate-fade-in-up ${
                isActiveRoute('/contact')
                  ? 'text-gold-200 bg-gradient-to-r from-gold-900/60 to-musical-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.3)]'
                  : 'text-gray-200 hover:text-gold-200 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40'
              }`}
              style={{ animationDelay: isMenuOpen ? '0.3s' : '0s' }}
              onClick={closeMobileMenu}
              role="menuitem"
              aria-current={isActiveRoute('/contact') ? 'page' : undefined}
            >
              <span className={`transition-all duration-300 ${
                isActiveRoute('/contact') 
                  ? 'drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]' 
                  : 'group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)]'
              }`}>Contact</span>
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
        </div>
      </nav>
    </header>
  );
}, (prevProps, nextProps) => {
  return prevProps.isAdmin === nextProps.isAdmin;
});

Header.displayName = 'Header';