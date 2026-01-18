import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';

interface HeaderProps {
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const navigate = useNavigate();
  const location = useLocation();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

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

  const handleLogout = async () => {
    await logout();
    setIsAdminMenuOpen(false);
    navigate('/');
  };

  if (isAdmin) {
    return null; // Admin header can be separate
  }

  return (
    <header className="bg-jazz-900/98 backdrop-blur-xl shadow-elegant fixed w-full top-0 z-50 border-b border-gold-900/40 relative overflow-hidden transition-all duration-300">
      {/* Musical decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-8">
        <div className="absolute top-1/2 left-10 text-3xl text-gold-400 animate-float font-musical">♪</div>
        <div className="absolute top-1/2 right-10 text-2xl text-musical-400 animate-float font-musical" style={{ animationDelay: '1.5s' }}>♫</div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold-900/5 to-transparent pointer-events-none" />
      
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex justify-between items-center h-16 lg:h-18">
          <Link 
            to="/" 
            className="text-xl sm:text-2xl lg:text-3xl font-elegant font-bold bg-gradient-to-r from-gold-400 via-gold-300 to-gold-200 bg-clip-text text-transparent hover:from-gold-300 hover:via-gold-200 hover:to-gold-100 transition-all duration-500 transform hover:scale-105 relative group"
            aria-label="Home - Christina Sings4U"
          >
            <span className="relative z-10">Christina Sings4U</span>
            <span className="absolute -top-1 -right-2 text-xs opacity-0 group-hover:opacity-60 transition-opacity duration-300 font-musical">♪</span>
          </Link>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20"
            >
              <span className="relative z-10">Home</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-300 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20"
            >
              <span className="relative z-10">About</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-300 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link
              to="/categories"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20"
            >
              <span className="relative z-10">Categories</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-300 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link
              to="/performances"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20"
            >
              <span className="relative z-10">Performances</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-300 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link
              to="/blog"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20"
            >
              <span className="relative z-10">Blog</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-300 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium rounded-lg relative group hover:bg-gold-900/20"
            >
              <span className="relative z-10">Contact</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-gold-400 to-gold-300 group-hover:w-full transition-all duration-300 rounded-full" />
            </Link>
            
            {/* Admin Menu */}
            {isAuthenticated ? (
              <div className="relative admin-menu-container">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="flex items-center space-x-1 text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium"
                >
                  <span>Admin</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isAdminMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-jazz-900/95 backdrop-blur-md rounded-xl shadow-jazz py-1 z-50 border border-gold-900/30">
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 hover:text-gold-300 transition-all duration-300"
                      onClick={() => setIsAdminMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 hover:text-gold-300 transition-all duration-300"
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
              >
                Admin
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-gray-200 hover:text-gold-400 transition-colors p-2 -mr-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
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
          <div className="md:hidden py-4 space-y-2 bg-jazz-900/98 backdrop-blur-xl rounded-xl mt-3 border border-gold-900/40 shadow-2xl animate-fade-in">
            <Link
              to="/"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="flex items-center">
                <span className="mr-2 text-gold-600 opacity-0 group-hover:opacity-100 transition-opacity">♪</span>
                Home
              </span>
            </Link>
            <Link
              to="/about"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/categories"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Categories
            </Link>
            <Link
              to="/performances"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Performances
            </Link>
            <Link
              to="/blog"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/40 hover:to-musical-900/40 px-4 py-2.5 rounded-lg transition-all duration-300 font-medium transform hover:translate-x-1 hover:shadow-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/admin/dashboard"
                  className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/admin/login"
                className="block text-gray-200 hover:text-gold-400 hover:bg-gradient-to-r hover:from-gold-900/30 hover:to-musical-900/30 px-4 py-2 rounded-lg transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};