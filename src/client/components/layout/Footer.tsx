import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';
import { SOCIAL_MEDIA } from '../../../shared/constants';
import { NAV_ITEMS } from '../../config/nav';

export const Footer: React.FC = memo(() => {
  return (
    <footer className="relative border-t border-gold-900/40 bg-gradient-to-b from-jazz-900/60 via-jazz-800/80 to-jazz-900 py-12 sm:py-14 lg:py-16 overflow-hidden">
      {/* Subtle decorative texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none footer-texture" aria-hidden />
      {/* Subtle corner accents */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-gold-500/5 via-transparent to-transparent rounded-br-full pointer-events-none" aria-hidden />
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-musical-500/5 via-transparent to-transparent rounded-tl-full pointer-events-none" aria-hidden />
      <div className="absolute inset-0 bg-black/30 pointer-events-none" aria-hidden />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 mb-10 lg:mb-12">
          <div>
            <h3 className="text-xl sm:text-2xl font-elegant font-bold mb-3 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Christina Sings4U
            </h3>
            <p className="text-gray-200 text-sm sm:text-base font-sans leading-relaxed max-w-xs">
              Elegant live vocals for your special moments in Sydney, NSW.
            </p>
          </div>

          <nav aria-labelledby="footer-quick-links">
            <h4 id="footer-quick-links" className="text-base sm:text-lg font-elegant font-bold mb-4 text-gold-200">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {NAV_ITEMS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-200 hover:text-gold-200 text-sm sm:text-base font-medium transition-colors duration-300 inline-flex items-center gap-2 py-1 group"
                  >
                    <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-sections" className="hidden lg:block">
            <h4 id="footer-sections" className="text-base sm:text-lg font-elegant font-bold mb-4 text-gold-200">
              Home Sections
            </h4>
            <ul className="space-y-2.5">
              {[
                { to: '/#hero', label: 'Hero' },
                { to: '/#services', label: 'Services' },
                { to: '/#performances', label: 'Performances' },
                { to: '/#testimonials', label: 'Testimonials' },
                { to: '/#cta', label: 'Contact Us' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-gray-200 hover:text-gold-200 text-sm sm:text-base font-medium transition-colors duration-300 inline-flex items-center gap-2 py-1 group"
                  >
                    <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div aria-labelledby="footer-contact">
            <h4 id="footer-contact" className="text-base sm:text-lg font-elegant font-bold mb-4 text-gold-200">
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-gold-200 text-sm sm:text-base font-medium transition-colors duration-300 inline-flex items-center gap-2 py-1 group"
                  aria-label="Contact via WhatsApp"
                >
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={generateMailtoLink()}
                  className="text-gray-200 hover:text-gold-200 text-sm sm:text-base font-medium transition-colors duration-300 inline-flex items-center gap-2 py-1 group"
                  aria-label="Contact via Email"
                >
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                  Email
                </a>
              </li>
              <li>
                <a
                  href="tel:+61410606328"
                  className="text-gray-200 hover:text-gold-200 text-sm sm:text-base font-medium transition-colors duration-300 inline-flex items-center gap-2 py-1 group"
                  aria-label="Call 0410 606 328"
                >
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                  Phone
                </a>
              </li>
            </ul>
          </div>

          <div aria-labelledby="footer-social">
            <h4 id="footer-social" className="text-base sm:text-lg font-elegant font-bold mb-4 text-gold-200">
              Follow
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: SOCIAL_MEDIA.FACEBOOK, label: 'Facebook' },
                { href: SOCIAL_MEDIA.TWITTER, label: 'Twitter' },
                { href: SOCIAL_MEDIA.INSTAGRAM, label: 'Instagram' },
                { href: SOCIAL_MEDIA.YOUTUBE, label: 'YouTube' },
              ].map(({ href, label }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-gold-200 text-sm sm:text-base font-medium transition-colors duration-300 inline-flex items-center gap-2 py-1 group"
                    aria-label={`Follow on ${label}`}
                  >
                    <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity text-sm">→</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gold-800/40">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="text-center sm:text-left">
              <p className="text-gray-200 text-sm sm:text-base font-sans">
                © {new Date().getFullYear()} <span className="text-gold-300 font-elegant font-semibold">Christina Sings4U</span>. All rights reserved.
              </p>
              <p className="mt-1 text-gray-400 text-xs sm:text-sm font-sans">
                Professional Singer · Sydney, NSW, Australia
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link
                to="/privacy"
                className="text-gray-400 hover:text-gold-300 text-xs sm:text-sm font-medium transition-colors duration-300"
                aria-label="Privacy Policy"
              >
                Privacy Policy
              </Link>
              <span className="text-gold-900/60" aria-hidden="true">•</span>
              <Link
                to="/terms"
                className="text-gray-400 hover:text-gold-300 text-xs sm:text-sm font-medium transition-colors duration-300"
                aria-label="Terms of Service"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';
