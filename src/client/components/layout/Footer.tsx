import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';

export const Footer: React.FC = memo(() => {
  return (
    <footer className="bg-gradient-to-br from-jazz-900 via-jazz-800 to-musical-900 text-white py-8 sm:py-12 lg:py-16 relative overflow-hidden border-t border-gold-900/40">
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Musical decorative elements - Subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-10 sm:opacity-8">
        <div className="absolute top-10 left-1/4 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-gold-400/60 sm:text-gold-400/50 animate-float font-musical drop-shadow-[0_0_15px_rgba(255,194,51,0.3)]">♪</div>
        <div className="absolute top-1/3 right-1/4 text-xl sm:text-2xl lg:text-3xl xl:text-4xl text-musical-400/60 sm:text-musical-400/50 animate-float font-musical drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" style={{ animationDelay: '1s' }}>♫</div>
        <div className="absolute bottom-20 left-1/3 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-gold-400/60 sm:text-gold-400/50 animate-float font-musical drop-shadow-[0_0_20px_rgba(255,194,51,0.3)]" style={{ animationDelay: '2s' }}>♬</div>
        <div className="absolute bottom-10 right-1/3 text-lg sm:text-xl lg:text-2xl xl:text-3xl text-musical-400/60 sm:text-musical-400/50 animate-float font-musical drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]" style={{ animationDelay: '3s' }}>♩</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
          <div>
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-elegant font-bold mb-3 sm:mb-4 lg:mb-5 xl:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(255,194,51,0.3)]" style={{ textShadow: '0 3px 15px rgba(255, 194, 51, 0.25), 0 1px 6px rgba(168, 85, 247, 0.15)' }}>
              Christina Sings4U
            </h3>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-50 leading-relaxed max-w-sm">
              Elegant live vocals for your special moments in Sydney, NSW.
            </p>
          </div>

          <div>
            <h4 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-3 sm:mb-4 lg:mb-5 xl:mb-6 text-gold-200">Quick Links</h4>
            <ul className="space-y-3 sm:space-y-3.5 lg:space-y-4 xl:space-y-5 text-sm sm:text-base md:text-lg lg:text-xl">
              <li>
                <Link to="/" className="text-gray-50 hover:text-gold-200 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group leading-relaxed">
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]">→</span>
                  <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Home</span>
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-200 hover:text-gold-300 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group">
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]">→</span>
                  <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Services</span>
                </Link>
              </li>
              <li>
                <Link to="/performances" className="text-gray-200 hover:text-gold-300 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group">
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]">→</span>
                  <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Performances</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-gold-300 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group">
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]">→</span>
                  <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-bold mb-3 sm:mb-4 lg:mb-5 xl:mb-6 text-gold-200">Contact</h4>
            <ul className="space-y-2 sm:space-y-2.5 lg:space-y-3 xl:space-y-4 text-xs sm:text-sm md:text-base lg:text-lg">
              <li>
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-50 hover:text-gold-200 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group leading-relaxed"
                >
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]">→</span>
                  <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={generateMailtoLink()}
                  className="text-gray-50 hover:text-gold-200 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group leading-relaxed"
                >
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]">→</span>
                  <span className="group-hover:drop-shadow-[0_0_6px_rgba(255,194,51,0.4)] transition-all duration-300">Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-800/40 pt-4 sm:pt-5 lg:pt-6 xl:pt-8 2xl:pt-10 text-center">
          <p className="text-sm sm:text-base md:text-lg text-gray-300/90 font-medium leading-relaxed">
            &copy; {new Date().getFullYear()} Christina Sings4U. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';