import React, { memo } from 'react';
import { cn } from '../../utils/helpers';

interface DescriptionSectionProps {
  description: string;
  className?: string;
}

export const DescriptionSection: React.FC<DescriptionSectionProps> = memo(({
  description,
  className,
}) => {
  return (
    <div className={cn('mt-6 sm:mt-7 lg:mt-8 xl:mt-10 pt-6 sm:pt-7 lg:pt-8 xl:pt-10 border-t-2 border-gold-900/60 sm:border-gold-900/50 hover:border-gold-800/70 transition-colors duration-300 relative group', className)}>
      <div className="theme-divider-shimmer absolute top-0 left-1/2 -translate-x-1/2 max-w-[8rem] sm:max-w-[10rem] opacity-80" aria-hidden="true" />
      <div className="relative">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-elegant font-bold mb-4 sm:mb-5 lg:mb-6 bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100 bg-clip-text text-transparent leading-tight">
          Description
        </h3>
        <div className="prose prose-invert max-w-none">
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 whitespace-pre-line leading-relaxed font-sans group-hover:text-gray-100 transition-colors duration-300 description-section-text">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.description === nextProps.description &&
    prevProps.className === nextProps.className
  );
});

DescriptionSection.displayName = 'DescriptionSection';
