import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';
import { cn } from '../../utils/helpers';

interface CTASectionProps {
  title?: string;
  description?: string;
  showContactButtons?: boolean;
  className?: string;
}

export const CTASection: React.FC<CTASectionProps> = memo(({
  title = "Ready to Make Your Event Unforgettable?",
  description = "Let's discuss how we can create the perfect musical experience for your special occasion.",
  showContactButtons = true,
  className,
}) => {
  const handleWhatsApp = useCallback(() => {
    window.open(generateWhatsAppLink(undefined, undefined), '_blank');
  }, []);

  const handleEmail = useCallback(() => {
    window.location.href = generateMailtoLink();
  }, []);
  return (
    <section className={cn('py-12 sm:py-16 lg:py-20 xl:py-24 relative overflow-hidden', className)}>
      {/* Enhanced background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-900/25 via-jazz-900/35 to-musical-900/25"></div>
      
      {/* Animated glow effects */}
      <div className="absolute inset-0 opacity-60 sm:opacity-50 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 rounded-full blur-3xl animate-musical-pulse shadow-[0_0_60px_rgba(255,194,51,0.3)]" style={{ background: 'radial-gradient(circle, rgba(255, 194, 51, 0.35) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] rounded-full blur-3xl animate-musical-pulse shadow-[0_0_60px_rgba(168,85,247,0.3)]" style={{ background: 'radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 70%)', animationDelay: '1s' }}></div>
      </div>
      
      {/* Decorative elements - Enhanced */}
      <div className="absolute inset-0 pointer-events-none opacity-12 sm:opacity-10">
        <div className="absolute top-8 sm:top-10 left-5 sm:left-10 text-4xl sm:text-5xl lg:text-6xl text-gold-400/70 sm:text-gold-400/60 animate-float font-musical drop-shadow-[0_0_20px_rgba(255,194,51,0.4)]">♪</div>
        <div className="absolute bottom-8 sm:bottom-10 right-5 sm:right-10 text-3xl sm:text-4xl lg:text-5xl text-musical-400/70 sm:text-musical-400/60 animate-float font-musical drop-shadow-[0_0_20px_rgba(168,85,247,0.4)]" style={{ animationDelay: '1s' }}>♫</div>
        <div className="absolute top-1/2 left-1/4 text-2xl sm:text-3xl lg:text-4xl text-gold-400/50 sm:text-gold-400/40 animate-float font-musical drop-shadow-[0_0_15px_rgba(255,194,51,0.35)]" style={{ animationDelay: '2s' }}>♬</div>
        <div className="absolute bottom-1/3 right-1/3 text-xl sm:text-2xl lg:text-3xl text-musical-400/50 sm:text-musical-400/40 animate-float font-musical drop-shadow-[0_0_15px_rgba(168,85,247,0.35)]" style={{ animationDelay: '3s' }}>♩</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <div className="relative inline-block mb-5 sm:mb-6 lg:mb-8">
            {/* Enhanced multi-layer glow effect behind title */}
            <div className="absolute -inset-2 sm:-inset-3 lg:-inset-4 bg-gold-500/15 rounded-full blur-2xl opacity-70 animate-pulse shadow-[0_0_40px_rgba(255,194,51,0.3)]"></div>
            <div className="absolute -inset-4 sm:-inset-6 lg:-inset-8 bg-gold-500/10 rounded-full blur-3xl opacity-50 animate-pulse shadow-[0_0_60px_rgba(255,194,51,0.25)]" style={{ animationDelay: '1s' }}></div>
            <h2 className="relative text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-elegant font-bold mb-3 sm:mb-4 lg:mb-5 xl:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight px-4 drop-shadow-[0_4px_20px_rgba(255,194,51,0.4)]" style={{ textShadow: '0 0 50px rgba(255, 194, 51, 0.35), 0 0 100px rgba(126, 34, 206, 0.25), 0 4px 15px rgba(255, 194, 51, 0.3)' }}>
              {title}
            </h2>
          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-200/95 sm:text-gray-200 mb-6 sm:mb-8 lg:mb-10 xl:mb-12 max-w-3xl mx-auto leading-relaxed" style={{ textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)' }}>
            {description}
          </p>

          {showContactButtons && (
            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 lg:gap-4 xl:gap-6 justify-center items-stretch sm:items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={handleWhatsApp}
                className="w-full sm:w-auto"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1.5 sm:mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact via WhatsApp
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleEmail}
                className="w-full sm:w-auto border-2 border-white/90 text-white hover:bg-white/20 hover:border-white backdrop-blur-md shadow-[0_8px_24px_rgba(255,255,255,0.15)] hover:shadow-[0_12px_32px_rgba(255,255,255,0.25),0_0_30px_rgba(255,255,255,0.1)]"
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 mr-1.5 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </Button>
            </div>
          )}

          <div className="mt-5 sm:mt-6 lg:mt-8 xl:mt-10">
            <Link
              to="/contact"
              className="inline-block text-xs sm:text-sm md:text-base text-gold-400 hover:text-gold-300 transition-all duration-300 underline hover:no-underline font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-1.5 sm:px-2 py-1 min-h-[32px] sm:min-h-[36px] flex items-center hover:drop-shadow-[0_0_8px_rgba(255,194,51,0.5)]"
            >
              <span className="hover:translate-x-1 transition-transform duration-300 inline-block">Or fill out our contact form →</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.title === nextProps.title &&
    prevProps.description === nextProps.description &&
    prevProps.showContactButtons === nextProps.showContactButtons &&
    prevProps.className === nextProps.className
  );
});

CTASection.displayName = 'CTASection';
