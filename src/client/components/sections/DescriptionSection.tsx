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
    <div className={cn('mt-6 sm:mt-8 pt-6 sm:pt-8 border-t-2 border-gold-900/40', className)}>
      <h3 className="text-xl sm:text-2xl font-elegant font-bold mb-4 sm:mb-5 bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400 bg-clip-text text-transparent">
        Description
      </h3>
      <div className="prose prose-invert max-w-none">
        <p className="text-base sm:text-lg text-gray-200 whitespace-pre-line leading-relaxed font-normal">
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
