# Font & Effects Harmony Guide

## Font System - Harmonized

### Primary Fonts
1. **Playfair Display** (Elegant)
   - Usage: All headings (h1-h6)
   - Weights: 600, 700
   - Letter-spacing: -0.03em to -0.015em (decreasing by heading level)
   - Line-height: 1.2
   - Text-shadow: Consistent gold/purple glow

2. **Cormorant Garamond** (Musical)
   - Usage: Decorative musical notes (♪ ♫ ♬ ♩)
   - Weights: 300-700
   - Letter-spacing: 0.05em
   - Used for: Animated decorative elements

3. **Inter** (Sans)
   - Usage: Body text, paragraphs, UI elements
   - Weights: 300-700
   - Letter-spacing: -0.01em
   - Line-height: 1.75
   - Default font for all non-heading text

## Transition System - Harmonized

### Timing Hierarchy
- **300ms** (Micro): Buttons, links, hover effects
- **400ms** (Standard): Cards, containers, standard interactions
- **500ms** (Smooth): Complex animations, fade-ins
- **700ms** (Slow): Backgrounds, large gradients

### Easing Functions
- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Smooth**: `cubic-bezier(0.4, 0, 0.6, 1)`
- **Float**: `cubic-bezier(0.4, 0, 0.6, 1)`

## Animation System - Harmonized

### Duration Standards
- **Fast**: 0.3s (micro interactions)
- **Normal**: 0.5-0.6s (standard animations)
- **Slow**: 0.8s+ (complex, multi-step animations)

### Key Animations
1. **float**: 6s (musical notes decoration)
2. **pulse**: 2s (loading states)
3. **shimmer**: 2s (skeleton loading)
4. **fade-in**: 0.5-0.8s (content reveals)
5. **scrollReveal**: 0.8s (scroll-triggered)

## Text Shadow System - Harmonized

### Hierarchy
- **H1**: `0 4px 20px rgba(255, 194, 51, 0.3), 0 2px 10px rgba(126, 34, 206, 0.2)`
- **H2**: `0 3px 15px rgba(255, 194, 51, 0.25), 0 1px 6px rgba(126, 34, 206, 0.15)`
- **H3-H6**: `0 2px 10px rgba(255, 194, 51, 0.2), 0 1px 4px rgba(126, 34, 206, 0.15)`
- **Base headings**: `0 2px 12px rgba(255, 194, 51, 0.2), 0 1px 4px rgba(126, 34, 206, 0.15)`

## Color Text System

### Gradient Text
- **Primary Gold**: `from-gold-300 via-gold-200 to-gold-100`
- **Accent Gold**: `from-gold-400 via-gold-300 to-gold-300`
- **Musical Purple**: `from-musical-300 via-musical-200 to-musical-300`

## Font Features

### Enabled
- `font-feature-settings: 'liga', 'kern'` - Better letter spacing
- `text-rendering: optimizeLegibility` - Better text rendering
- `-webkit-font-smoothing: antialiased` - Smooth font rendering
- `-moz-osx-font-smoothing: grayscale` - Mac OS font smoothing

## Best Practices

1. **Consistency**: Always use defined font families (font-elegant, font-musical, font-sans)
2. **Transitions**: Use 300ms for interactive, 400ms for containers, 500ms+ for complex
3. **Easing**: Prefer cubic-bezier(0.4, 0, 0.2, 1) for most cases
4. **Text Shadow**: Match shadow intensity to heading level
5. **Letter Spacing**: Decrease as heading level increases
