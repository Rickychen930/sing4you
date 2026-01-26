# Design System — Harmony & Consistency

Senior-designer rules for **colors**, **fonts**, and **effects** across Christina Sings4U.

---

## 1. Color Harmony

### Semantic roles
| Role | Tailwind | Usage |
|------|----------|--------|
| **Body primary** | `text-gray-200` | Main body copy |
| **Body secondary** | `text-gray-300` | Supporting text, captions |
| **Muted** | `text-gray-400` | Footer tertiary, hints |
| **Heading gradient** | `from-gold-300 via-gold-200 to-gold-100` | All h1–h4 (bg-clip-text) |
| **Links** | `text-gold-300` → `hover:text-gold-200` | All links |
| **Primary accent** | `gold-500`, `gold-400` | CTAs, icons, focus |
| **Secondary accent** | `musical-500`, `musical-400` | Complementary UI, ♫ notes |

### Don’t mix
- Avoid `text-gray-50` / `text-gray-100` for body; use `gray-200` for consistency.
- Keep heading gradient **one** pattern: `from-gold-300 via-gold-200 to-gold-100`.

---

## 2. Typography

### Font roles
| Role | Font | Class | Use for |
|------|------|-------|---------|
| **Display / headings** | Playfair Display | `font-elegant` | h1–h6, section titles |
| **Body** | Inter | `font-sans` | Paragraphs, UI, forms |
| **Decorative** | Cormorant Garamond | `font-musical` | ♪ ♫ ♬ notes only |

### Rules
- All headings: `font-elegant font-bold` (or `font-semibold` for h3/h4).
- All body: `font-sans`, no `font-elegant` on paragraphs.
- Musical symbols: always `font-musical`.

---

## 3. Effects

### Decorative notes (♪ ♫ ♬)
- **Gold:** `text-gold-400/30` (or `/20` when very subtle).
- **Purple:** `text-musical-400/30` (or `/20`).
- Animation: `animate-float` only (avoid `animate-float-advanced` for consistency).
- Font: `font-musical`.

### Shadows
- **Gold glow:** `rgba(255, 194, 51, 0.2)`–`0.4`.
- **Purple glow:** `rgba(168, 85, 247, 0.15)`–`0.25`.
- **Text shadow (headings):** `0 2px 10px` gold + `0 1px 4px` purple; keep subtle.

### Transitions
- **Micro (buttons, links):** `duration-300`, `easing-standard`.
- **Cards / sections:** `duration-300`–`400`.

### Glass
- **Subtle:** `glass-effect`.
- **Strong (header, modals):** `glass-effect-strong`.

---

## 4. Gradient usage
- **Headings:** `bg-gradient-to-r from-gold-300 via-gold-200 to-gold-100` + `bg-clip-text text-transparent`.
- **Backgrounds:** `from-jazz-900`, `via-jazz-800` / `musical-900`, `to-gold-900` or `musical-900`; use `/20`–`/40` opacity.
- **Dividers / lines:** `from-transparent via-gold-400/60 to-transparent` or `via-gold-400/80`.

---

## 5. Quick reference
- Body: `text-gray-200 font-sans`
- Headings: `font-elegant font-bold` + gold gradient
- Links: `text-gold-300 hover:text-gold-200`
- Notes: `text-gold-400/30` or `text-musical-400/30`, `font-musical`, `animate-float`
