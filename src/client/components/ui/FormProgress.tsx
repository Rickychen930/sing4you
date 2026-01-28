import React, { memo, useMemo } from 'react';
import { cn } from '../../utils/helpers';

interface FormProgressProps {
  totalFields: number;
  completedFields: number;
  className?: string;
}

export const FormProgress: React.FC<FormProgressProps> = memo(({ totalFields, completedFields, className }) => {
  const percentage = useMemo(() => {
    if (totalFields === 0) return 0;
    return Math.round((completedFields / totalFields) * 100);
  }, [totalFields, completedFields]);

  return (
    <div className={cn('mb-6 sm:mb-8', className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm sm:text-base text-gray-300 font-sans font-medium">
          Form Progress
        </span>
        <span className="text-sm sm:text-base text-gold-300 font-sans font-semibold">
          {completedFields}/{totalFields} fields
        </span>
      </div>
      <div className="w-full h-2 sm:h-2.5 bg-jazz-900/60 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Form ${percentage}% complete`}
        />
      </div>
    </div>
  );
});

FormProgress.displayName = 'FormProgress';
