import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';

export const Footer: React.FC = memo(() => {
  return (
    <footer className="bg-gradient-to-br from-jazz-900 via-jazz-800 to-musical-900 text-white py-10 sm:py-14 relative overflow-hidden border-t border-gold-900/40">
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Musical decorative elements - Subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-8">
        <div className="absolute top-10 left-1/4 text-4xl sm:text-5xl text-gold-400/50 animate-float font-musical">♪</div>
        <div className="absolute top-1/3 right-1/4 text-3xl sm:text-4xl text-musical-400/50 animate-float font-musical" style={{ animationDelay: '1s' }}>♫</div>
        <div className="absolute bottom-20 left-1/3 text-5xl sm:text-6xl text-gold-400/50 animate-float font-musical" style={{ animationDelay: '2s' }}>♬</div>
        <div className="absolute bottom-10 right-1/3 text-2xl sm:text-3xl text-musical-400/50 animate-float font-musical" style={{ animationDelay: '3s' }}>♩</div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12 lg:gap-16">
          <div>
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold mb-5 sm:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
              Christina Sings4U
            </h3>
            <p className="text-base sm:text-lg text-gray-200 leading-relaxed max-w-sm">
              Elegant live vocals for your special moments in Sydney, NSW.
            </p>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-5 sm:mb-6 text-gold-200">Quick Links</h4>
            <ul className="space-y-4 text-base sm:text-lg">
              <li>
                <Link to="/" className="text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group">
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group">
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                  <span>Services</span>
                </Link>
              </li>
              <li>
                <Link to="/performances" className="text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group">
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                  <span>Performances</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group">
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                  <span>Contact</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-5 sm:mb-6 text-gold-200">Contact</h4>
            <ul className="space-y-4 text-base sm:text-lg">
              <li>
                <a
                  href={generateWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group"
                >
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                  <span>WhatsApp</span>
                </a>
              </li>
              <li>
                <a
                  href={generateMailtoLink()}
                  className="text-gray-200 hover:text-gold-400 transition-all duration-300 font-medium hover:translate-x-2 inline-flex items-center gap-2 group"
                >
                  <span className="text-gold-500 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">→</span>
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gold-800/40 mt-8 sm:mt-10 pt-6 sm:pt-8 text-center">
          <p className="text-sm sm:text-base text-gray-400 font-medium">
            &copy; {new Date().getFullYear()} Christina Sings4U. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';