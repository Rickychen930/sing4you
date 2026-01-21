# Constants Usage Examples

Contoh penggunaan constants di berbagai skenario.

## Colors

### Di TypeScript/JavaScript

```typescript
import { GOLD_COLORS, COLOR_RGBA, GRADIENTS } from '@/shared/constants';

// Menggunakan solid colors
const primaryColor = GOLD_COLORS[500]; // '#ffc233'

// Menggunakan RGBA dengan opacity
const goldWithOpacity = COLOR_RGBA.gold['500-50']; // 'rgba(255, 194, 51, 0.5)'

// Menggunakan gradients
const jazzGradient = GRADIENTS.jazz;

// Di inline styles
<div style={{ 
  backgroundColor: GOLD_COLORS[500],
  color: COLOR_RGBA.white['90']
}}>
  Content
</div>
```

### Di CSS (menggunakan CSS variables)

```css
.my-element {
  color: var(--color-gold-500);
  background: var(--color-jazz-900);
}
```

### Di Tailwind (tetap gunakan classes)

```tsx
// Gunakan Tailwind classes seperti biasa
<div className="bg-gold-500 text-jazz-900">
  Content
</div>
```

## Animations

### Di TypeScript/JavaScript

```typescript
import { ANIMATION_DURATION, EASING, ANIMATION_DELAY, PARALLAX } from '@/shared/constants';

// Di inline styles
<div style={{
  transition: `all ${ANIMATION_DURATION.normal} ${EASING.standard}`,
  animationDelay: `${ANIMATION_DELAY.medium}s`,
}}>
  Content
</div>

// Di useEffect untuk parallax
useEffect(() => {
  const parallaxSpeed = PARALLAX.background; // 0.5
  // ... parallax logic
}, []);
```

### Di CSS (menggunakan CSS variables)

```css
.my-element {
  transition: all var(--duration-normal) var(--easing-standard);
  animation-delay: var(--duration-fast);
}
```

## Design Tokens

### Di TypeScript/JavaScript

```typescript
import { SPACING, FONT_SIZE, BORDER_RADIUS, Z_INDEX, OPACITY } from '@/shared/constants';

// Di inline styles
<div style={{
  padding: SPACING.lg,
  fontSize: FONT_SIZE.xl,
  borderRadius: BORDER_RADIUS.xl,
  zIndex: Z_INDEX.modal,
  opacity: OPACITY['80'],
}}>
  Content
</div>
```

### Di CSS (menggunakan CSS variables)

```css
.my-element {
  padding: var(--spacing-lg);
  font-size: var(--font-size-xl);
  border-radius: var(--radius-xl);
  z-index: var(--z-modal);
}
```

## Best Practices

1. **Untuk Tailwind classes**: Tetap gunakan Tailwind seperti biasa
   ```tsx
   <div className="bg-gold-500 p-4 rounded-xl">
   ```

2. **Untuk inline styles di React**: Gunakan constants
   ```tsx
   <div style={{ 
     backgroundColor: GOLD_COLORS[500],
     padding: SPACING.lg 
   }}>
   ```

3. **Untuk custom CSS**: Gunakan CSS variables
   ```css
   .custom-class {
     color: var(--color-gold-500);
   }
   ```

4. **Untuk dynamic values di JavaScript**: Gunakan constants
   ```typescript
   const speed = PARALLAX.background;
   const color = COLOR_RGBA.gold['500-50'];
   ```

## Migration Guide

Jika Anda menemukan hardcoded values, ganti dengan constants:

### Before
```typescript
const style = {
  color: '#ffc233',
  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  padding: '24px',
};
```

### After
```typescript
import { GOLD_COLORS, ANIMATION_DURATION, EASING, SPACING } from '@/shared/constants';

const style = {
  color: GOLD_COLORS[500],
  transition: `all ${ANIMATION_DURATION.normal} ${EASING.standard}`,
  padding: SPACING.lg,
};
```
