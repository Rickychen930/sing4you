import React, { useState, useEffect, memo, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { Dropdown, DropdownItem } from '../ui/Dropdown';
import { NAV_ITEMS } from '../../config/nav';
import { cn } from '../../utils/helpers';

interface HeaderProps {
  isAdmin?: boolean;
}

export const Header: React.FC<HeaderProps> = memo(({ isAdmin = false }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = useCallback((path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  const closeMobileMenu = useCallback(() => setIsMenuOpen(false), []);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('header')) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside, { capture: true, passive: true });
    return () => document.removeEventListener('mousedown', handleClickOutside, { capture: true });
  }, [isMenuOpen]);

  const handleLogout = useCallback(async () => {
    await logout();
    setIsAdminMenuOpen(false);
    navigate('/');
  }, [logout, navigate]);

  if (isAdmin) return null;

  const navLinkBase =
    'px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 text-sm sm:text-base lg:text-lg font-medium rounded-lg transition-all duration-300 min-h-[48px] flex items-center relative';
  const navLinkActive = 'text-gold-200 bg-gold-900/40';
  const navLinkInactive = 'text-gray-200 hover:text-gold-200 hover:bg-gold-900/30';
  const underlineClass =
    'absolute bottom-0 left-0 h-0.5 sm:h-1 bg-gradient-to-r from-gold-400 via-gold-300 to-musical-400 rounded-full transition-all duration-300';

  return (
    <>
      <header className="glass-effect-strong fixed w-full top-0 left-0 right-0 z-50 border-b border-gold-900/40 transition-all duration-300 overflow-visible">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-visible" aria-label="Main navigation">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-18 xl:h-20 relative">
            <Link
              to="/"
              className="text-base sm:text-lg md:text-xl lg:text-2xl font-elegant font-bold bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent hover:opacity-90 transition-opacity duration-300"
              aria-label="Home — Christina Sings4U"
            >
              Christina Sings4U
            </Link>

            <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
              {NAV_ITEMS.map(({ to, label, ariaLabel }) => (
                <Link
                  key={to}
                  to={to}
                  className={cn(navLinkBase, 'group', isActiveRoute(to) ? navLinkActive : navLinkInactive)}
                  aria-label={ariaLabel ?? `Navigate to ${label.toLowerCase()} page`}
                  aria-current={isActiveRoute(to) ? 'page' : undefined}
                >
                  <span className="relative z-10">{label}</span>
                  <span
                    className={cn(underlineClass, isActiveRoute(to) ? 'w-full' : 'w-0 group-hover:w-full')}
                    aria-hidden
                  />
                </Link>
              ))}
              {isAuthenticated ? (
                <Dropdown
                  align="right"
                  onOpenChange={setIsAdminMenuOpen}
                  trigger={
                    <button
                      type="button"
                      className={cn(navLinkBase, navLinkInactive, 'focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900')}
                      aria-label="Admin menu"
                      aria-haspopup="true"
                      aria-expanded={isAdminMenuOpen}
                    >
                      Admin
                      <svg
                        className={cn('w-3 h-3 sm:w-4 sm:h-4 ml-0.5 transition-transform duration-300', isAdminMenuOpen && 'rotate-180')}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  }
                  menuClassName="w-40 sm:w-48"
                >
                  <DropdownItem as="link" to="/admin/dashboard" onClick={() => setIsAdminMenuOpen(false)}>
                    Dashboard
                  </DropdownItem>
                  <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
                </Dropdown>
              ) : (
                <Link
                  to="/admin/login"
                  className={cn(navLinkBase, navLinkInactive)}
                  aria-label="Navigate to admin login"
                >
                  Admin
                </Link>
              )}
            </div>

            <button
              type="button"
              className="md:hidden p-2.5 -mr-2 min-w-[48px] min-h-[48px] flex items-center justify-center text-gray-200 hover:text-gold-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded-lg relative z-[100]"
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu"
              style={{ zIndex: 100, position: 'relative', display: 'flex' }}
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
        </nav>
      </header>

      {/* Mobile Menu Overlay and Menu - Outside header to avoid overflow issues */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[80] md:hidden animate-fade-in"
          onClick={closeMobileMenu}
          aria-hidden
          style={{ zIndex: 80 }}
        />
      )}
      <div
        id="mobile-menu"
        className={cn(
          'md:hidden fixed top-14 sm:top-16 lg:top-18 xl:top-20 left-0 right-0 bottom-0 z-[90] overflow-y-auto overscroll-contain transition-all duration-300 ease-out',
          isMenuOpen ? 'translate-x-0 pointer-events-auto opacity-100 visible' : 'translate-x-full pointer-events-none opacity-0 invisible'
        )}
        role="menu"
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
        style={{ 
          zIndex: 90,
          transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
          willChange: 'transform'
        }}
      >
        <div className="mt-2 mx-4 sm:mx-6 py-4 px-4 rounded-xl bg-jazz-900/98 backdrop-blur-lg border border-gold-900/50 shadow-xl space-y-1">
          {NAV_ITEMS.map(({ to, label, ariaLabel }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'block px-4 py-3.5 rounded-lg text-base sm:text-lg font-medium transition-all duration-300 min-h-[48px] flex items-center touch-manipulation',
                isActiveRoute(to)
                  ? 'text-gold-200 bg-gold-900/50 shadow-[0_4px_12px_rgba(255,194,51,0.2)]'
                  : 'text-gray-200 hover:text-gold-200 hover:bg-gold-900/30 active:bg-gold-900/40'
              )}
              onClick={closeMobileMenu}
              role="menuitem"
              aria-label={ariaLabel ?? `Navigate to ${label.toLowerCase()} page`}
              aria-current={isActiveRoute(to) ? 'page' : undefined}
            >
              {label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/admin/dashboard"
                className="block px-4 py-3 text-sm sm:text-base text-gray-200 hover:text-gold-300 hover:bg-gold-900/30 rounded-lg transition-colors min-h-[44px] flex items-center"
                onClick={closeMobileMenu}
                role="menuitem"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => { handleLogout(); closeMobileMenu(); }}
                className="block w-full text-left px-4 py-3 text-sm sm:text-base text-gray-200 hover:text-gold-300 hover:bg-gold-900/30 rounded-lg transition-colors min-h-[44px]"
                role="menuitem"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/admin/login"
              className="block px-4 py-3 text-sm sm:text-base text-gray-200 hover:text-gold-300 hover:bg-gold-900/30 rounded-lg transition-colors min-h-[44px] flex items-center"
              onClick={closeMobileMenu}
              role="menuitem"
            >
              Admin
            </Link>
          )}
        </div>
      </div>
    </>
  );
}, (prev, next) => prev.isAdmin === next.isAdmin);

Header.displayName = 'Header';
