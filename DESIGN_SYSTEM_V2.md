# 🎨 Design System v2 - BaoPixel Studio

## Overview

Nouveau design system inspiré de:
- **iOS 26:** Rounded corners arrondi, glassmorphism, animations fluides
- **Spotify UI Kit:** Gradients, cartes élégantes, dark mode optimisé
- **Claude Apps:** Minimalisme, clarté, focus sur le contenu

---

## 🎯 Philosophie de Design

✅ **Mobile-First** — Commence par mobile, scale jusqu'à desktop
✅ **Glassmorphism** — Surfaces translucides avec blur
✅ **Colorful Gradients** — Dégradés modernes et dynamiques
✅ **Smooth Animations** — Transitions fluides et naturelles
✅ **High Contrast** — Texte lisible sur tous les fonds
✅ **Accessibility** — WCAG compliant, keyboard navigation

---

## 🎨 Système de Couleurs

### Brand Colors (Primary)
```css
--brand-primary: #7C3AED     /* Purple vibrant */
--brand-secondary: #EC4899   /* Rose/Pink */
--brand-accent: #F97316      /* Orange energique */
--brand-success: #10B981     /* Green */
--brand-warning: #F59E0B     /* Amber/Yellow */
--brand-danger: #EF4444      /* Red */
--brand-info: #06B6D4        /* Cyan/Blue */
```

### Backgrounds
```css
--bg-base: #0F0F0F           /* Page background */
--bg-elevated: #191919       /* Elevated surfaces */
--bg-hover: #242424          /* Hover state */
--bg-selected: #2D2D2D       /* Selected state */
--bg-glass: rgba(255,255,255,0.05)  /* Glassmorphism */
```

### Text Colors (Hierarchy)
```css
--text-primary: #FAFAFA      /* Primary text - 98% */
--text-secondary: #B0B0B0    /* Secondary text - 69% */
--text-tertiary: #808080     /* Tertiary text - 50% */
--text-muted: #5A5A5A        /* Muted text - 35% */
--text-disabled: #424242     /* Disabled text - 26% */
```

---

## 📐 Spacing Token Scale

```css
--space-xs: 0.25rem    /* 4px */
--space-sm: 0.5rem     /* 8px */
--space-md: 1rem       /* 16px */
--space-lg: 1.5rem     /* 24px */
--space-xl: 2rem       /* 32px */
--space-2xl: 3rem      /* 48px */
--space-3xl: 4rem      /* 64px */
```

**Usage:**
```css
padding: var(--space-md);      /* 16px */
margin: var(--space-lg);       /* 24px */
gap: var(--space-sm);          /* 8px */
```

---

## 🔲 Border Radius

```css
--radius-sm: 0.375rem   /* 6px */
--radius-md: 0.75rem    /* 12px - Default for inputs/buttons */
--radius-lg: 1.25rem    /* 20px - Default for cards */
--radius-xl: 1.75rem    /* 28px - Large components */
--radius-full: 9999px   /* Fully rounded (pills) */
```

---

## 🔤 Typography

### Font Families
```css
--font-sans: 'Inter', -apple-system, sans-serif       /* Body text */
--font-display: 'Plus Jakarta Sans', sans-serif       /* Headings */
--font-mono: 'JetBrains Mono', monospace              /* Code */
```

### Font Sizes (Responsive)
```css
--text-xs: clamp(0.75rem, 1vw, 0.875rem)
--text-sm: clamp(0.875rem, 1.2vw, 1rem)
--text-base: clamp(1rem, 1.5vw, 1.125rem)
--text-lg: clamp(1.125rem, 2vw, 1.5rem)
--text-xl: clamp(1.25rem, 2.5vw, 1.875rem)
--text-2xl: clamp(1.5rem, 3vw, 2.25rem)
--text-3xl: clamp(1.875rem, 4vw, 3rem)
```

**clamp()** = automatiquement responsive sans media queries!

### Line Heights
```css
--lh-tight: 1.2       /* Headings */
--lh-normal: 1.5      /* Body text */
--lh-relaxed: 1.75    /* Comfortable reading */
```

---

## 🎬 Animations & Transitions

### Duration Tokens
```css
--trans-fast: 100ms ease-out     /* Quick feedback */
--trans-normal: 200ms ease-out   /* Default transitions */
--trans-slow: 300ms ease-out     /* Slow reveals */
```

### Available Animations
```css
.fade-up       /* Fade in + slide up */
.fade-in       /* Simple fade */
.slide-in      /* Slide from left */
.pulse         /* Pulsing opacity */
.spin          /* Rotating 360° */
.glow          /* Glowing box-shadow */
.shake         /* Shake animation */
```

**Usage:**
```html
<div class="fade-up">Appears with fade-up animation</div>
```

---

## 🎛️ Component Styles

### Cards
```html
<div class="card">
  <!-- Content with nice padding, border, rounded corners, backdrop blur -->
</div>

<div class="card elevated">
  <!-- Higher elevation with stronger shadow -->
</div>
```

### Surfaces
```html
<div class="surface">
  <!-- Lighter background, good for grouped content -->
</div>
```

### Buttons
```html
<button class="btn-primary">Primary Action</button>
<button class="btn-secondary">Secondary Action</button>
<button class="btn-ghost">Tertiary Action</button>
<button class="btn-danger">Delete</button>
<button class="btn-sm btn-primary">Small Button</button>
```

### Badges
```html
<span class="badge badge-primary">Label</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-warning">Warning</span>
<span class="badge badge-danger">Danger</span>
```

### Inputs
```html
<input type="text" placeholder="Type something...">
<textarea placeholder="Longer text..."></textarea>
<select>
  <option>Option 1</option>
</select>
```

---

## 📱 Responsive Grid System

### Mobile First Approach

```html
<!-- Automatically 1 column on mobile, 2+ on desktop -->
<div class="grid grid-2">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**Breakpoints:**
- Mobile: 0px (default)
- Small: 640px
- Medium: 1024px
- Large: 1280px

**Grid Classes:**
```css
.grid          /* 1 column everywhere */
.grid-2        /* 1 mobile, 2 desktop */
.grid-3        /* 1 mobile, 2 mid, 3 desktop */
.grid-4        /* 1 mobile, 2 mid, 4 desktop */
```

---

## 🎯 Shadow System

```css
--shadow-sm: 0 1px 2px rgba(0,0,0,0.2)
--shadow-md: 0 4px 12px rgba(0,0,0,0.3)
--shadow-lg: 0 12px 24px rgba(0,0,0,0.4)
--shadow-xl: 0 20px 40px rgba(0,0,0,0.5)
--shadow-glow: 0 0 30px rgba(124,58,237,0.15)
```

**Usage:**
```css
box-shadow: var(--shadow-lg);
```

---

## 💻 Flexbox Utilities

```html
<div class="flex">            <!-- display: flex -->
<div class="flex-col">        <!-- flex-direction: column -->
<div class="flex-center">     <!-- center items & justify -->
<div class="gap-md">          <!-- gap: 16px -->
```

---

## 🔧 Migration from Old Design

### Old → New Variable Names

| Old | New | Notes |
|-----|-----|-------|
| `--bg` | `--bg-base` | |
| `--surface` | `--surface-bg` | |
| `--card` | `--card-bg` | |
| `--border` | `--card-border` | |
| `--text` | `--text-primary` | |
| `--muted` | `--text-secondary` | |
| `--purple` | `--brand-primary` | |
| `--orange` | `--brand-accent` | |

### Updating Components

**Old style (inline):**
```typescript
style={{background:'var(--card)',border:'1px solid var(--border)'}}
```

**New style (using classes):**
```typescript
className="card"
```

**Or new variables:**
```typescript
style={{background:'var(--card-bg)',border:`1px solid var(--card-border)`}}
```

---

## 📊 Glassmorphism Effect

Le design utilise du glassmorphism pour une apparence moderne:

```css
background: var(--card-bg);  /* Semi-transparent */
border: 1px solid var(--card-border);
border-radius: var(--radius-lg);
backdrop-filter: blur(10px);  /* The "glass" effect */
```

---

## 🎨 Color Combinations

### Safe Combinations
```
Text: --text-primary
On: --card-bg, --surface-bg, --bg-elevated

Text: --text-secondary
On: --bg-base, --card-bg

Text: --brand-primary
On: --bg-base, transparent bg with border

Accent: --brand-secondary, --brand-accent
As: Gradient overlays, hover states, attention-getters
```

---

## 🚀 Performance

- **CSS Variables** — Plus rapide que SASS
- **GPU-accelerated transitions** — `transform`, `opacity` seulement
- **Mobile-optimized** — No unnecessary repaints
- **Dark mode optimized** — Réduces eye strain

---

## 📚 Best Practices

✅ **Use CSS variables** — Cohérence garantie
✅ **Mobile first media queries** — Responsive by default
✅ **Semantic HTML** — For accessibility
✅ **Avoid hardcoded colors** — Always use variables
✅ **Use class-based styling** — Write utility classes
✅ **Test on mobile** — Real devices, not just browser devtools

---

## 🔗 Files Modified

- `app/globals.css` — New design system + CSS
- `app/page.tsx` — Will need refactoring for new class names (next step)

---

**Next Step:** Refactorer `app/page.tsx` pour utiliser les nouvelles classes CSS et variables! 🚀
