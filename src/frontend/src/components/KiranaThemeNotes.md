# Kirana Store Theme Design System

## Overview
This document describes the warm, Indian provision store (kirana) inspired design system applied to the Provision Store PWA.

## Color Palette

### Light Mode
- **Primary (Saffron):** `oklch(0.65 0.18 50)` - Warm saffron orange, inspired by Indian spices
- **Secondary (Earthy):** `oklch(0.92 0.03 55)` - Soft beige/cream for secondary elements
- **Accent (Warm):** `oklch(0.88 0.08 45)` - Warm terracotta accent
- **Background:** `oklch(0.98 0.01 60)` - Off-white with warm undertone
- **Foreground:** `oklch(0.25 0.02 40)` - Dark brown for text

### Dark Mode
- **Primary (Bright Saffron):** `oklch(0.72 0.20 48)` - Brighter saffron for visibility
- **Background:** `oklch(0.18 0.02 40)` - Deep warm brown
- **Foreground:** `oklch(0.95 0.01 55)` - Warm off-white

## Typography
- **Font Stack:** System fonts for optimal performance and native feel
- **Base Size:** 16px for comfortable mobile reading
- **Scale:** Consistent spacing using Tailwind's default scale
- **Weights:** Regular (400) for body, Semibold (600) for headings, Bold (700) for emphasis

## Spacing & Layout
- **Container Padding:** 1rem (mobile), 1.5rem (tablet), 2rem (desktop)
- **Border Radius:** 0.75rem (12px) for a friendly, approachable feel
- **Grid Gaps:** 0.75rem (12px) for tight layouts, 1rem (16px) for comfortable spacing

## Component Styling Guidelines

### Cards
- Use `Card` component from shadcn/ui
- Apply subtle shadows on hover for interactivity
- Maintain consistent padding (p-4 for mobile)

### Buttons
- Primary buttons use the saffron primary color
- Minimum touch target: 44x44px for mobile accessibility
- Use `Button` component with appropriate variants:
  - `default`: Primary actions (saffron background)
  - `secondary`: Secondary actions (earthy background)
  - `ghost`: Tertiary actions (transparent)
  - `outline`: Alternative actions (bordered)

### Badges
- Use for status indicators and discounts
- `destructive` variant for sale/discount badges (red)
- `secondary` variant for informational badges

### Icons
- Use lucide-react for UI icons
- Emoji for product categories (adds warmth and cultural relevance)
- Consistent sizing: h-4 w-4 (small), h-5 w-5 (medium), h-6 w-6 (large)

## Mobile-First Considerations
- All interactive elements meet 44x44px minimum touch target
- Responsive grid: 3 columns (mobile) → 4 columns (tablet) → 6 columns (desktop)
- Sticky header for easy navigation
- Safe area insets respected (viewport-fit=cover)
- No horizontal overflow

## Accessibility
- WCAG AA contrast ratios maintained in both light and dark modes
- Semantic HTML structure (header, main, section, footer)
- Proper heading hierarchy (h1 → h2 → h3)
- Touch targets meet minimum size requirements
- Focus states visible on all interactive elements

## Cultural Relevance
- Warm color palette reflects Indian spices and traditional kirana stores
- Emoji usage adds friendly, approachable feel
- Rupee symbol (₹) for pricing
- Store timings and contact info prominently displayed
- Categories reflect typical Indian provision store inventory

## Usage with shadcn/ui Components
All shadcn/ui components automatically inherit the theme tokens. To customize:

1. **Colors:** Use semantic color classes (`bg-primary`, `text-foreground`, etc.)
2. **Spacing:** Use Tailwind spacing utilities (`p-4`, `gap-3`, etc.)
3. **Borders:** Use `rounded-lg`, `rounded-md`, or `rounded-sm` for consistency
4. **Shadows:** Use `shadow-sm`, `shadow`, or `shadow-md` sparingly

## Do's and Don'ts

### Do:
✅ Use semantic color tokens (primary, secondary, accent)
✅ Maintain consistent spacing and border radius
✅ Test on mobile viewports (360x800, 390x844)
✅ Use emoji for visual interest in appropriate contexts
✅ Keep touch targets at least 44x44px

### Don't:
❌ Use arbitrary color values (e.g., #fff, blue-500)
❌ Mix border radius styles inconsistently
❌ Create touch targets smaller than 44x44px
❌ Use blue or purple as primary colors (breaks theme)
❌ Ignore dark mode styling
