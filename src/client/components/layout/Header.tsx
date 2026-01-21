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
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const navigate = useNavigate();

  // Handler to close mobile menu
  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Close admin dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isAdminMenuOpen && !target.closest('.admin-menu-container')) {
        setIsAdminMenuOpen(false);
      }
    };

    if (isAdminMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAdminMenuOpen]);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const headerElement = target.closest('header');
      if (isMenuOpen && !headerElement) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
      {/* Enhanced musical decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-8">
        <div className="absolute top-1/2 left-10 text-2xl sm:text-3xl text-gold-400/70 animate-float-advanced font-musical glow-pulse-advanced">♪</div>
        <div className="absolute top-1/2 right-10 text-xl sm:text-2xl text-musical-400/70 animate-float-advanced font-musical glow-pulse-advanced" style={{ animationDelay: '1.5s' }}>♫</div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg text-gold-500/40 animate-float-advanced font-musical" style={{ animationDelay: '0.75s' }}>♬</div>
      </div>
      
      {/* Enhanced gradient overlay with shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-900/8 to-transparent pointer-events-none shimmer-advanced opacity-30" />
      
      {/* Particle effect background */}
      <div className="absolute inset-0 particle-bg opacity-20 pointer-events-none" />
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16 lg:h-20">
          <Link 
            to="/" 
            className="text-xl sm:text-2xl lg:text-3xl font-elegant font-bold gradient-text-animated hover:scale-110 transition-all duration-300 transform relative group scale-on-hover"
            aria-label="Home - Christina Sings4U"
          >
            <span className="relative z-10 glow-pulse-advanced">Christina Sings4U</span>
            <span className="absolute -top-1 -right-2 text-xs opacity-0 group-hover:opacity-80 transition-opacity duration-300 font-musical animate-float-advanced neon-glow">♪</span>
            <span className="absolute -bottom-1 -left-2 text-xs opacity-0 group-hover:opacity-60 transition-opacity duration-300 font-musical animate-float-advanced neon-glow-purple" style={{ animationDelay: '0.5s' }}>♫</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/30 link-underline magnetic-hover-advanced hover-lift-advanced"
              aria-label="Navigate to home page"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-500 group-hover:w-full transition-all duration-300 rounded-full shimmer-advanced" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="absolute top-1 right-1 text-xs text-gold-500/80 font-musical animate-float-advanced glow-pulse-advanced">♪</span>
              </span>
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20 link-underline magnetic-hover"
              aria-label="Navigate to about page"
            >
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 group-hover:w-full transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="absolute top-1 right-1 text-xs text-gold-500/60 font-musical animate-float" style={{ animationDelay: '0.2s' }}>♫</span>
              </span>
            </Link>
            <Link
              to="/categories"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20 link-underline magnetic-hover"
              aria-label="Navigate to categories page"
            >
              <span className="relative z-10">Services</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 group-hover:w-full transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="absolute top-1 right-1 text-xs text-gold-500/60 font-musical animate-float" style={{ animationDelay: '0.4s' }}>♪</span>
              </span>
            </Link>
            <Link
              to="/performances"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20 link-underline magnetic-hover"
              aria-label="Navigate to performances page"
            >
              <span className="relative z-10">Performances</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 group-hover:w-full transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="absolute top-1 right-1 text-xs text-gold-500/60 font-musical animate-float" style={{ animationDelay: '0.6s' }}>♬</span>
              </span>
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20 link-underline magnetic-hover"
              aria-label="Navigate to contact page"
            >
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 group-hover:w-full transition-all duration-300 rounded-full" />
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <span className="absolute top-1 right-1 text-xs text-gold-500/60 font-musical animate-float" style={{ animationDelay: '1s' }}>♪</span>
              </span>
            </Link>
            
            {/* Admin Menu */}
            {isAuthenticated ? (
              <div className="relative admin-menu-container">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center space-x-1 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg px-2 py-1"
                  aria-label="Admin menu"
                  aria-expanded={isAdminMenuOpen}
                  aria-haspopup="true"
                >
                  <span>Admin</span>
                  <svg className="w-4 h-4 transition-transform duration-300" style={{ transform: isAdminMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isAdminMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-jazz-900/95 backdrop-blur-md rounded-xl shadow-jazz py-1 z-50 border border-gold-900/30"
                    role="menu"
                    aria-label="Admin menu"
                  >
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 hover:text-gold-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-inset rounded-lg mx-1"
                      onClick={() => setIsAdminMenuOpen(false)}
                      role="menuitem"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 hover:text-gold-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-inset rounded-lg mx-1"
                      role="menuitem"
                      aria-label="Logout from admin account"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium relative after:absolute after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-gold-400 after:to-gold-300 after:bottom-0 after:left-0 hover:after:w-full after:transition-all after:duration-300"
                aria-label="Navigate to admin login page"
              >
                Admin
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-200 hover:text-gold-400 transition-colors p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
            className="md:hidden py-4 space-y-2 bg-jazz-900/98 backdrop-blur-xl rounded-xl mt-3 border border-gold-900/40 shadow-2xl animate-fade-in"
            role="menu"
            aria-label="Mobile navigation menu"
          >
            <Link
              to="/"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              <span className="flex items-center">
                <span className="mr-2 text-gold-600 opacity-0 group-hover:opacity-100 transition-opacity">♪</span>
                Home
              </span>
            </Link>
            <Link
              to="/about"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              About
            </Link>
            <Link
              to="/categories"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              Services
            </Link>
            <Link
              to="/performances"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              Performances
            </Link>
            <Link
              to="/contact"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[44px] flex items-center"
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
                  className="block w-full text-left text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[44px]"
                  role="menuitem"
                  aria-label="Logout from admin account"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 min-h-[44px] flex items-center"
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