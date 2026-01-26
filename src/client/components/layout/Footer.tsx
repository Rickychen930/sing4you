import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';

export const Footer: React.FC = memo(() => {
  return (
    <footer className="bg-gradient-to-br from-jazz-900 via-jazz-800 to-musical-900 text-white py-8 sm:py-12 lg:py-16 xl:py-20 relative overflow-hidden border-t border-gold-900/50">
      {/* Enhanced background layers */}
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-jazz-900/60 via-transparent to-transparent"></div>
      
      {/* Subtle musical accents — reduced for clarity */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.12] sm:opacity-10">
        <span className="absolute top-12 left-1/4 text-2xl sm:text-3xl lg:text-4xl text-gold-400/30 font-musical animate-float select-none" style={{ animationDelay: '0s' }} aria-hidden>♪</span>
        <span className="absolute bottom-24 right-1/4 text-xl sm:text-2xl lg:text-3xl text-musical-400/30 font-musical animate-float select-none" style={{ animationDelay: '2s' }} aria-hidden>♫</span>
        <span className="absolute top-1/2 right-1/3 text-lg sm:text-xl text-gold-400/20 font-musical animate-float select-none" style={{ animationDelay: '1s' }} aria-hidden>♬</span>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12 mb-10 sm:mb-12 lg:mb-14">
          <div className="relative">
            <div className="absolute -inset-2 bg-gold-500/10 rounded-2xl blur-xl opacity-40 pointer-events-none" aria-hidden />
            <div className="relative">
              <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold mb-3 sm:mb-4 lg:mb-5 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
                Christina Sings4U
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-200 leading-relaxed max-w-sm font-sans">
                Elegant live vocals for your special moments in Sydney, NSW.
              </p>
              <span className="mt-3 sm:mt-4 text-xl sm:text-2xl text-gold-400/30 font-musical animate-float inline-block" style={{ animationDelay: '0.5s' }} aria-hidden>♪</span>
            </div>
          </div>

          <nav className="relative" aria-labelledby="footer-quick-links">
            <div className="absolute -inset-2 bg-musical-500/10 rounded-2xl blur-xl opacity-40 pointer-events-none" aria-hidden />
            <div className="relative">
              <h4 id="footer-quick-links" className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-4 sm:mb-5 lg:mb-6 text-gold-200 font-elegant">Quick Links</h4>
              <ul className="space-y-3 sm:space-y-3.5 lg:space-y-4 text-sm sm:text-base md:text-lg lg:text-xl">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/about', label: 'About' },
                  { to: '/categories', label: 'Services' },
                  { to: '/performances', label: 'Performances' },
                  { to: '/contact', label: 'Contact' },
                ].map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-gray-200 hover:text-gold-200 transition-all duration-300 font-medium hover:translate-x-1 inline-flex items-center gap-2 group"
                    >
                      <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-all duration-300 text-base">→</span>
                      <span>{label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          <div className="relative" aria-labelledby="footer-contact">
            <div className="absolute -inset-2 bg-gold-500/10 rounded-2xl blur-xl opacity-40 pointer-events-none" aria-hidden />
            <div className="relative">
              <h4 id="footer-contact" className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold mb-4 sm:mb-5 lg:mb-6 text-gold-200 font-elegant">Contact</h4>
              <ul className="space-y-3 sm:space-y-3.5 lg:space-y-4 text-sm sm:text-base md:text-lg lg:text-xl">
                <li>
                  <a
                    href={generateWhatsAppLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-200 hover:text-gold-200 transition-all duration-300 font-medium hover:translate-x-1 inline-flex items-center gap-2 group"
                  >
                    <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-all duration-300 text-base">→</span>
                    <span>WhatsApp</span>
                  </a>
                </li>
                <li>
                  <a
                    href={generateMailtoLink()}
                    className="text-gray-200 hover:text-gold-200 transition-all duration-300 font-medium hover:translate-x-1 inline-flex items-center gap-2 group"
                  >
                    <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-all duration-300 text-base">→</span>
                    <span>Email</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gold-800/50 pt-6 sm:pt-8 lg:pt-10 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 md:w-40 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-gold-400/80 to-musical-500/80 to-transparent rounded-full" aria-hidden />
          <p className="text-sm sm:text-base md:text-lg text-gray-200 font-medium leading-relaxed font-sans">
            &copy; {new Date().getFullYear()} <span className="text-gold-300 font-elegant font-semibold">Christina Sings4U</span>. All rights reserved.
          </p>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-gray-400 font-sans">
            Professional Singer · Sydney, NSW, Australia
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';