import React, { useEffect, useCallback } from 'react';

/**
 * CursorEffect Component
 * 
 * Changes cursor to microphone icon
 * 
 * @example
 * <CursorEffect />
 */
interface CursorEffectProps {
  /** Effect intensity: 'low' | 'medium' | 'high' (not used, kept for compatibility) */
  intensity?: 'low' | 'medium' | 'high';
  /** Particle colors (not used, kept for compatibility) */
  colors?: string[];
  /** Disable effect on mobile */
  disableOnMobile?: boolean;
}

export const CursorEffect: React.FC<CursorEffectProps> = ({
  disableOnMobile = true,
}) => {
  // Check if mobile device
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
  }, []);

  // Setup custom cursor - optimized to prevent memory leaks
  useEffect(() => {
    if (disableOnMobile && isMobile()) return;

    // Vintage jazz mic cursor — classic ball mic, gold capsule + purple neck/base
    const svg = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jazz-cap" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#FFD54F"/>
          <stop offset="50%" stop-color="#FFC233"/>
          <stop offset="100%" stop-color="#cc8b1a"/>
        </linearGradient>
        <linearGradient id="jazz-neck" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#6b21a8"/>
          <stop offset="50%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#6b21a8"/>
        </linearGradient>
      </defs>
      <circle cx="14" cy="8" r="5.5" fill="url(#jazz-cap)" stroke="#b8860b" stroke-width="0.7"/>
      <ellipse cx="14" cy="6.6" rx="1.8" ry="1.1" fill="rgba(255,255,255,0.3)"/>
      <rect x="12.3" y="13.2" width="3.4" height="7.5" rx="0.6" fill="url(#jazz-neck)" stroke="#7e22ce" stroke-width="0.4"/>
      <path d="M10.6 20.8h6.8l0.5 1.8h-7.8z" fill="#1a0a2e" stroke="#9333ea" stroke-width="0.4"/>
      <rect x="12.9" y="20.6" width="2.2" height="1.2" rx="0.3" fill="#2d1b4e"/>
    </svg>`;
    const svgDataUri = `data:image/svg+xml;base64,${btoa(svg)}`;

    // Apply custom cursor — hotspot at tip of mic (center of ball)
    const cursorStyle = `url("${svgDataUri}") 14 8, auto`;
    document.body.style.cursor = cursorStyle;
    document.documentElement.style.cursor = cursorStyle;

    return () => {
      // Cleanup: restore default cursor
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
    };
  }, [disableOnMobile, isMobile]);

  // Don't render anything, just apply CSS cursor
  return null;
};
