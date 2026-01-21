/**
 * Animation Constants
 * 
 * Centralized animation timing, easing, and duration definitions.
 * Use these constants for consistent animations across the application.
 */

// Animation Durations (in seconds)
export const ANIMATION_DURATION = {
  // Micro interactions
  fast: 0.3,
  // Standard interactions
  normal: 0.5,
  standard: 0.6,
  // Smooth transitions
  smooth: 0.7,
  // Complex animations
  slow: 0.8,
  slower: 1.0,
  // Long animations
  long: 2.0,
  veryLong: 3.0,
  // Infinite animations
  infinite: 6.0,
  float: 6.0,
  pulse: 2.0,
  shimmer: 2.0,
  shimmerMusical: 3.0,
  gradientShift: 8.0,
  particleMove: 20.0,
  musicalGlow: 15.0,
  gentlePulse: 20.0,
  musicalPatternMove: 30.0,
} as const;

// Animation Delays (in seconds)
export const ANIMATION_DELAY = {
  none: 0,
  short: 0.1,
  medium: 0.2,
  normal: 0.3,
  standard: 0.5,
  long: 1.0,
  longer: 1.5,
  veryLong: 2.0,
  extraLong: 3.0,
} as const;

// Easing Functions
export const EASING = {
  // Standard easing
  standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Smooth easing
  smooth: 'cubic-bezier(0.4, 0, 0.6, 1)',
  // Float easing
  float: 'cubic-bezier(0.4, 0, 0.6, 1)',
  // Advanced easing
  advanced: 'cubic-bezier(0.23, 1, 0.32, 1)',
  // Bounce easing
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  // Ease in out
  easeInOut: 'ease-in-out',
  // Linear
  linear: 'linear',
} as const;

// Transition Timing
export const TRANSITION_TIMING = {
  // Micro interactions (300ms)
  micro: 300,
  // Standard transitions (400ms)
  standard: 400,
  // Smooth transitions (500ms)
  smooth: 500,
  // Slow transitions (700ms)
  slow: 700,
} as const;

// Animation Names
export const ANIMATION_NAMES = {
  float: 'float',
  floatAdvanced: 'floatAdvanced',
  pulse: 'pulse',
  pulseSoft: 'pulse-soft',
  pulseGlow: 'pulseGlow',
  glow: 'glow',
  glowPulse: 'glowPulseAdvanced',
  shimmer: 'shimmer',
  shimmerAdvanced: 'shimmerAdvanced',
  shimmerMusical: 'shimmerMusical',
  shimmerText: 'shimmerText',
  sparkle: 'sparkle',
  sparkleFloat: 'sparkleFloat',
  musicalPulse: 'musicalPulse',
  musicalShine: 'musicalShine',
  wave: 'wave',
  waveReverse: 'waveReverse',
  fadeIn: 'fade-in',
  fadeInUp: 'fade-in-up',
  fadeInDown: 'fade-in-down',
  slideIn: 'slide-in',
  scaleIn: 'scaleIn',
  textReveal: 'textReveal',
  gradientShift: 'gradientShift',
  gradientText: 'gradientText',
  borderRotate: 'borderRotate',
  rotateGradient: 'rotateGradient',
  particleMove: 'particleMove',
  musicalGlow: 'musicalGlow',
  musicalPatternMove: 'musicalPatternMove',
  gentlePulse: 'gentlePulse',
  ripple: 'ripple',
  cardGlow: 'cardGlow',
  cardEntrance: 'cardEntrance',
  staggerFadeIn: 'staggerFadeIn',
  spinGlow: 'spinGlow',
  pageFadeIn: 'pageFadeIn',
  pageEnter: 'pageEnter',
  routeFadeIn: 'routeFadeIn',
  scrollReveal: 'scrollReveal',
  imageFadeIn: 'imageFadeIn',
  fireworkExplode: 'fireworkExplode',
  fireworkParticle: 'fireworkParticle',
  neonPulse: 'neonPulse',
  neonPulsePurple: 'neonPulsePurple',
  textGlow: 'textGlow',
  underlineExpand: 'underlineExpand',
} as const;

// Scroll Reveal Settings
export const SCROLL_REVEAL = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px',
  delay: 100,
  stagger: 150,
} as const;

// Parallax Settings
export const PARALLAX = {
  background: 0.5,
  content: 0.1,
  overlay: 0.2,
  particles: 0.3,
  slow: 0.3,
  medium: 0.5,
  fast: 0.7,
} as const;
