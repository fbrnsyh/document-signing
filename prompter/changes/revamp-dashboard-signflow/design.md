# Design: Revamp Dashboard Page using SignFlow Style

## Architecture
The revamp will focus on the UI/UX layer within the React components. No changes to the data-fetching logic or backend controllers are anticipated.

## Key Design Patterns (SignFlow)

### 1. Mesh Gradient Background
Apply the signature background mesh to the entire dashboard viewport:
```css
bg-gradient-to-br from-[#E0E7FF]/20 via-white to-[#F5D0FE]/20
```

### 2. Header & Navigation
Update `AuthenticatedLayout` to use `bg-white/80 backdrop-blur-md border-b border-white/20` for a consistent top-nav glass effect.

### 3. Stat Cards (Summary)
- **Container**: `bg-white/70 backdrop-blur-sm border border-white/30 rounded-[2rem] p-8 shadow-sm`.
- **Icon**: Placed in a circular container with an ultra-light background (e.g., `bg-primary/5`).
- **Typography**: Large, bold counts with muted, uppercase labels.

### 4. Document Section Cards
- **Parent Container**: Use "glass" containers for each main section (Waiting for Signature, etc.).
- **Item Rows**: Use `bg-white/40 hover:bg-white/80 backdrop-blur-none transition-all border-b last:border-0 rounded-2xl mb-2 p-5 flex items-center gap-6`.
- **Primary Buttons**: Maintain high-contrast CTAs but with slightly softened corners and deeper shadows (shadow-lg shadow-primary/20).

### 5. Progress Indicators
Convert standard progress bars to the **SignFlow Glass Progress Bar**:
- Background: `bg-muted/20`.
- Fill: `bg-gradient-to-r from-blue-600 to-indigo-500`.

## Animations (Framer Motion)
- **Entrance**: Staggered fade-up for section cards.
- **Hover**: Subtle `scale-[1.01]` and increased shadow depth for interactive cards.

## Trade-offs
- **Blur Performance**: Excessive `backdrop-blur` can impact performance on low-end machines. We will use it judiciously on large containers.
- **Dark Mode**: OKLCH colors will handle the inversion, but we must ensure the semi-transparent layers remain legible in dark mode.
