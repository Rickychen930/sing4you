import React, { memo } from 'react';

interface MusicalBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  /** Disable on viewport <=768px to avoid distraction and battery drain on mobile. Default true. */
  disableOnMobile?: boolean;
}

// HIDDEN: MusicalBackground component is disabled
export const MusicalBackground: React.FC<MusicalBackgroundProps> = memo(() => {
  // Always return null to hide the component
  return null;
}, () => true); // Always return true since component is disabled

MusicalBackground.displayName = 'MusicalBackground';
