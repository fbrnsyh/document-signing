---
name: ui-revamp-signflow
description: Implements the premium "SignFlow" glassmorphic design system. Use this when revamping pages to match the modern, fluid, and transparent aesthetic seen in the dashboard reference.
---

# UI Revamp: SignFlow Design System

## Quick Start
To apply the SignFlow aesthetic, use the following core tokens and patterns. This style prioritizes white space, subtle glass effects, and vibrant gradients.

## Core Design Tokens (Tailwind)

### 1. Glass Surfaces
```html
<!-- Main Glass Card -->
<div class="bg-white/80 backdrop-blur-md border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] rounded-3xl p-8">
  <!-- Content -->
</div>
```

### 2. Branding Colors
- **Primary**: `oklch(0.6397 0.1720 36.4421)` (Warm Orange/Brand Coral)
- **Signature Gradient**: `from-[#4F46E5] to-[#7C3AED]` (Used for progress and primary CTAs)
- **Background Gradient**: `bg-gradient-to-br from-[#E0E7FF]/20 via-white to-[#F5D0FE]/20`

## Components & Patterns

### 1. Summary Cards (Top Row)
- **Container**: Equal width, rounded-3xl, centered icons.
- **Icons**: Background circle in a washed-out version of the icon color.
- **Labels**: Muted text, uppercase, small tracking.

### 2. Actionable List
- **Row**: `bg-white/40 hover:bg-white/60 transition-colors border-b last:border-0 p-4 flex items-center gap-4`.
- **Primary Action**: "Sign Now" button should be `variant="secondary"` (Grayscale) but with a subtle hover lift.

### 3. Glass Progress Bar
```html
<div class="space-y-2">
  <div class="flex justify-between text-sm font-bold">
    <span>Document Progress</span>
    <span>66%</span>
  </div>
  <div class="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
    <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" style="width: 66%"></div>
  </div>
</div>
```

### 4. Avatar Stacks
- Overlapping circles with white borders.
- Final circle with `+N` or initials for remaining users.

## Workflow: Revamping a Page

1.  **Analyze current layout**: Identify functional blocks (List, Stats, Header).
2.  **Apply Background**: Change site background to the soft mesh gradient (indigo/purple/white).
3.  **Encapsulate in Glass**: Wrap major sections in the `bg-white/80 backdrop-blur-md` container.
4.  **Enforce Spacing**: Increase `p-8` for sections and `gap-8` between cards. SignFlow requires "breathability".
5.  **Refine Typography**: Use `tracking-tight` on headers and `text-muted-foreground` for helper text.
6.  **Add Micro-animations**: Use Framer Motion for `hover:scale-[1.01]` and `initial={{ opacity: 0, y: 10 }}`.

## Resources
- **Reference Image**: Located at `assets/reference-ui.png`.
- **Shadcn Integration**: Extend `tailwind.config.js` with the glassmorphism utilities if not present.
