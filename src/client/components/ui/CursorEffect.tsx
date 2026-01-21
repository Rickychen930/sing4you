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

  // Setup custom cursor
  useEffect(() => {
    if (disableOnMobile && isMobile()) return;

    // Create SVG mic icon for cursor (golden color matching theme)
    const svg = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1C10.34 1 9 2.34 9 4V12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12V4C15 2.34 13.66 1 12 1Z" fill="#FFC233" stroke="#E8A822" stroke-width="0.5"/>
      <path d="M19 10V12C19 15.87 15.87 19 12 19C8.13 19 5 15.87 5 12V10H3V12C3 16.97 7.03 21 12 21C16.97 21 21 16.97 21 12V10H19Z" fill="#FFC233" stroke="#E8A822" stroke-width="0.5"/>
      <path d="M11 22H13V24H11V22Z" fill="#FFC233" stroke="#E8A822" stroke-width="0.5"/>
    </svg>`;

    // Convert SVG to data URL
    const svgBlob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Apply custom cursor to body and all elements
    const cursorStyle = `url("${url}") 16 16, auto`;
    document.body.style.cursor = cursorStyle;
    
    // Also apply to html element for better coverage
    document.documentElement.style.cursor = cursorStyle;

    return () => {
      // Cleanup: restore default cursor
      document.body.style.cursor = '';
      document.documentElement.style.cursor = '';
      URL.revokeObjectURL(url);
    };
  }, [disableOnMobile, isMobile]);

  // Don't render anything, just apply CSS cursor
  return null;
};
