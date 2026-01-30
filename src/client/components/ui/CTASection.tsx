import React, { memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { SectionWrapper } from './SectionWrapper';
import { Button } from './Button';
import { DecorativeEffects } from './DecorativeEffects';
import { generateWhatsAppLink } from '../../../shared/utils/whatsapp';
import { generateMailtoLink } from '../../../shared/utils/email';
import { cn } from '../../utils/helpers';

interface CTASectionProps {
  title?: string;
  description?: string;
  showContactButtons?: boolean;
  className?: string;
  /** Optional section id */
  id?: string;
}

export const CTASection: React.FC<CTASectionProps> = memo(({
  title = "Ready to Make Your Event Unforgettable?",
  description = "Let's discuss how we can create the perfect musical experience for your special occasion.",
  showContactButtons = true,
  className,
  id = 'cta',
}) => {
  const handleWhatsApp = useCallback(() => {
    window.open(generateWhatsAppLink(undefined, undefined), '_blank');
  }, []);

  const handleEmail = useCallback(() => {
    window.location.href = generateMailtoLink();
  }, []);

  return (
    <SectionWrapper
      id={id}
      title={title}
      subtitle={description}
      variant="emphasis"
      alternate
      ariaLabel="Call to action"
      className={cn(
        'bg-gradient-to-br from-gold-900/25 via-jazz-900/30 to-musical-900/25',
        'relative overflow-hidden',
        'border-y border-gold-700/40',
        className
      )}
    >
      {/* Emphasis glow — design token gold */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(255,194,51,0.35) 0%, transparent 70%)',
        }}
        aria-hidden
      />

      <DecorativeEffects
        musicalNotes
        sparkles
        className="opacity-25 z-0"
      />
      {showContactButtons && (
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="theme-divider-shimmer mx-auto mb-6 sm:mb-8" aria-hidden="true" />
          <p className="text-gold-300/90 text-sm sm:text-base font-medium mb-6 sm:mb-8 font-sans">
            Quick response • Professional service • Sydney-wide
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
            <Button
              variant="primary"
              size="lg"
              onClick={handleWhatsApp}
              className="w-full sm:w-auto group font-sans shadow-[0_6px_20px_rgba(255,194,51,0.4)] hover:shadow-[0_8px_28px_rgba(255,194,51,0.5)]"
              aria-label="Contact via WhatsApp"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Contact via WhatsApp
              </span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleEmail}
              className="w-full sm:w-auto font-sans border-2 border-white/80 text-white hover:bg-white/15 hover:border-white backdrop-blur-sm group"
              aria-label="Send email"
            >
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </span>
            </Button>
          </div>
          <div className="mt-4 sm:mt-5 lg:mt-6">
            <Link
              to="/contact"
              className="inline-block text-sm sm:text-base font-sans text-gold-300 hover:text-gold-100 transition-colors underline underline-offset-2 font-medium focus:outline-none focus:ring-2 focus:ring-gold-500/60 focus:ring-offset-2 focus:ring-offset-jazz-900 rounded px-2 py-1.5"
              aria-label="Fill out our contact form"
            >
              Or fill out our contact form →
            </Link>
          </div>
        </div>
      )}
    </SectionWrapper>
  );
}, (prevProps, nextProps) =>
  prevProps.title === nextProps.title &&
  prevProps.description === nextProps.description &&
  prevProps.showContactButtons === nextProps.showContactButtons &&
  prevProps.id === nextProps.id &&
  prevProps.className === nextProps.className
);

CTASection.displayName = 'CTASection';
