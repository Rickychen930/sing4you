import React, { useState, useEffect, memo } from 'react';
import { cn } from '../../utils/helpers';

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted';

export const CookieConsent: React.FC = memo(() => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Show after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Use setTimeout to avoid synchronous setState in effect
      const timer = setTimeout(() => {
        setIsAccepted(true);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
    setIsAccepted(true);
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setIsVisible(false);
  };

  if (!isVisible || isAccepted) return null;

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 right-0 z-[10000] p-4 sm:p-6',
        'bg-gradient-to-br from-jazz-900/98 via-jazz-800/98 to-jazz-900/98',
        'backdrop-blur-lg border-t border-gold-900/50',
        'shadow-[0_-8px_32px_rgba(0,0,0,0.6)]',
        'animate-fade-in-up',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-elegant font-bold text-gold-200 mb-2">
            Cookie Consent
          </h3>
          <p className="text-sm sm:text-base text-gray-200 leading-relaxed">
            We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
            By clicking "Accept", you consent to our use of cookies.{' '}
            <a
              href="/privacy"
              className="text-gold-400 hover:text-gold-300 underline transition-colors"
              aria-label="Learn more about our privacy policy"
            >
              Learn more
            </a>
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleAccept}
            className={cn(
              'px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg',
              'bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600',
              'hover:from-gold-500 hover:via-gold-400 hover:to-gold-500',
              'text-white font-semibold text-sm sm:text-base',
              'shadow-[0_4px_14px_rgba(255,194,51,0.4)] hover:shadow-[0_6px_20px_rgba(255,194,51,0.5)]',
              'transition-all duration-300 hover:scale-105 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-jazz-900',
              'min-h-[44px] min-w-[120px]'
            )}
            aria-label="Accept cookies"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className={cn(
              'px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg',
              'bg-jazz-800/60 hover:bg-jazz-800/80',
              'border border-gold-900/40 hover:border-gold-700/50',
              'text-gray-200 hover:text-gold-200 font-medium text-sm sm:text-base',
              'transition-all duration-300 hover:scale-105 active:scale-95',
              'focus:outline-none focus:ring-2 focus:ring-gold-400 focus:ring-offset-2 focus:ring-offset-jazz-900',
              'min-h-[44px] min-w-[120px]'
            )}
            aria-label="Decline cookies"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
});

CookieConsent.displayName = 'CookieConsent';
