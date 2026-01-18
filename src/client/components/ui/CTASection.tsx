import React from 'react';
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

export const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to Make Your Event Unforgettable?",
  description = "Let's discuss how we can create the perfect musical experience for your special occasion.",
  showContactButtons = true,
  className,
}) => {
  return (
    <section className={cn('py-12 sm:py-16 lg:py-20 relative overflow-hidden', className)}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-900/20 via-jazz-900/30 to-musical-900/20"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-10 left-10 text-6xl text-gold-400 animate-float font-musical">♪</div>
        <div className="absolute bottom-10 right-10 text-5xl text-musical-400 animate-float font-musical" style={{ animationDelay: '1s' }}>♫</div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-8xl text-gold-500/20 animate-pulse font-musical">♬</div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-elegant font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent">
            {title}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {showContactButtons && (
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => window.open(generateWhatsAppLink(undefined, undefined), '_blank')}
                className="w-full sm:w-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Contact via WhatsApp
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = generateMailtoLink()}
                className="w-full sm:w-auto border-2 border-white/90 text-white hover:bg-white/15 hover:border-white backdrop-blur-md shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </Button>
            </div>
          )}

          <div className="mt-8 sm:mt-10">
            <Link
              to="/contact"
              className="inline-block text-sm sm:text-base text-gold-400 hover:text-gold-300 transition-colors duration-300 underline hover:no-underline font-medium"
            >
              Or fill out our contact form →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
