# Constants Documentation

This directory contains all centralized constants for the application, organized by category.

## File Structure

```
constants/
├── index.ts          # Main export file - re-exports all constants
├── colors.ts         # Color definitions matching Tailwind config
├── animations.ts     # Animation timing, easing, and duration constants
├── design-tokens.ts  # Design system tokens (spacing, typography, etc.)
└── README.md         # This file
```

## Usage

### Importing Constants

```typescript
// Import all constants from main index
import { GOLD_COLORS, ANIMATION_DURATION, SPACING } from '@/shared/constants';

// Or import from specific files
import { GOLD_COLORS } from '@/shared/constants/colors';
import { ANIMATION_DURATION } from '@/shared/constants/animations';
```

### Colors

All color constants match the Tailwind config colors. Use these in TypeScript/JavaScript code:

```typescript
import { GOLD_COLORS, COLOR_RGBA, GRADIENTS } from '@/shared/constants';

// Solid colors
const primaryColor = GOLD_COLORS[500]; // '#ffc233'

// RGBA colors with opacity
const goldWithOpacity = COLOR_RGBA.gold['500-50']; // 'rgba(255, 194, 51, 0.5)'

// Gradients
const jazzGradient = GRADIENTS.jazz;
```

**Note:** For CSS/Tailwind classes, continue using Tailwind's color utilities (e.g., `bg-gold-500`, `text-musical-600`).

### Animations

Use animation constants for consistent timing:

```typescript
import { ANIMATION_DURATION, EASING, ANIMATION_DELAY } from '@/shared/constants';

// In component styles
const style = {
  transition: `all ${ANIMATION_DURATION.normal} ${EASING.standard}`,
  animationDelay: `${ANIMATION_DELAY.medium}s`,
};
```

### Design Tokens

Use design tokens for spacing, typography, and other design values:

```typescript
import { SPACING, FONT_SIZE, BORDER_RADIUS, Z_INDEX } from '@/shared/constants';

// In component styles
const style = {
  padding: SPACING.lg,
  fontSize: FONT_SIZE.xl,
  borderRadius: BORDER_RADIUS.xl,
  zIndex: Z_INDEX.modal,
};
```

## CSS Variables

CSS custom properties (variables) are defined in `src/index.css` under `:root`. These can be used in CSS:

```css
.my-element {
  color: var(--color-gold-500);
  transition: all var(--duration-normal) var(--easing-standard);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
}
```

## Best Practices

1. **Use Tailwind classes in JSX/TSX** - For most styling, use Tailwind utility classes
2. **Use constants in JavaScript/TypeScript** - When you need color values in logic or inline styles
3. **Use CSS variables in custom CSS** - For complex CSS that can't be done with Tailwind
4. **Keep consistency** - Always use constants instead of hardcoded values
5. **Update Tailwind config** - If you add new colors, update both `tailwind.config.js` and `colors.ts`

## Color System

The color system is organized into palettes:

- **GOLD_COLORS**: Primary brand color (warm, luxurious)
- **MUSICAL_COLORS**: Accent color (purple, musical vibes)
- **JAZZ_COLORS**: Background color (navy, sophisticated depth)
- **BURGUNDY_COLORS**: Secondary accent (jazz club elegance)
- **BRONZE_COLORS**: Tertiary accent (warm elegance)

Each palette has shades from 50 (lightest) to 900 (darkest), matching Tailwind's color scale.

## Animation System

Animations follow a timing hierarchy:

- **Fast (300ms)**: Micro interactions (buttons, links)
- **Normal (500ms)**: Standard interactions
- **Smooth (700ms)**: Complex animations
- **Slow (800ms+)**: Long animations

Easing functions:
- **Standard**: `cubic-bezier(0.4, 0, 0.2, 1)` - Default for most transitions
- **Smooth**: `cubic-bezier(0.4, 0, 0.6, 1)` - For float animations
- **Advanced**: `cubic-bezier(0.23, 1, 0.32, 1)` - For complex animations

## Integration with Tailwind

All constants are designed to work seamlessly with Tailwind:

- Colors match Tailwind config exactly
- Spacing matches Tailwind's spacing scale
- Breakpoints match Tailwind's breakpoints
- Design tokens complement Tailwind utilities

When you need values that Tailwind doesn't provide, use these constants.
