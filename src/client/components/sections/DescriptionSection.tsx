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
    <div className={cn('mt-8 sm:mt-10 pt-8 sm:pt-10 border-t-2 border-gold-900/50', className)}>
      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-elegant font-bold mb-5 sm:mb-6 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent leading-tight">
        Description
      </h3>
      <div className="prose prose-invert max-w-none">
        <p className="text-base sm:text-lg lg:text-xl text-gray-200 whitespace-pre-line leading-relaxed font-normal">
          {description}
        </p>
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
