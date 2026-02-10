# Design: Standardize Design Tokens

## Architectural Reasoning
The application currently uses a mix of semantic design tokens (`bg-background`, `text-primary`) and hardcoded Tailwind colors (`bg-blue-500`, `text-gray-600`). This fragmentation leads to:
1.  **Inconsistent Dark Mode**: Hardcoded colors often look poor or have low contrast in dark mode.
2.  **Design Debt**: Difficult to theme or brand the application globally.
3.  **Arbitrary Values**: Usage of `bg-[...]` scales poorly and bypasses the design system.

## Token Mapping Plan

### General Mapping
| Current Hardcoded | Semantic Token Replacement | Rationale |
|-------------------|----------------------------|-----------|
| `text-gray-900`, `text-gray-800` | `text-foreground` | Standard text for light mode |
| `text-gray-600`, `text-gray-500` | `text-muted-foreground` | Secondary/de-emphasized text |
| `bg-white` (in cards) | `bg-card` | Surface for card components |
| `bg-gray-100`, `bg-gray-50` | `bg-muted` / `bg-secondary` | Neutral backgrounds |
| `border-gray-200`, `border-gray-100` | `border-border` | Unified border color |
| `bg-indigo-600`, `bg-blue-600` | `bg-primary` | Main action color |
| `text-indigo-600`, `text-blue-600` | `text-primary` | Main interactive text |

### Component Specific Mapping (FieldPlacement)
Fields currently use a variety of colors to distinguish types.
-   **Signature**: `blue` -> `primary` / `chart-1`
-   **Initial**: `indigo` -> `chart-2`
-   **Date**: `green` -> `chart-3`
-   **Text**: `orange` -> `chart-4`

## Proposed CSS Additions
If the existing `chart-X` tokens are not sufficient or hues are too similar, we will add semantic aliases in `app.css`:
```css
--success: oklch(0.627 0.194 149.214); /* Green */
--warning: oklch(0.769 0.188 70.08); /* Yellow/Orange */
--info: oklch(0.668 0.163 244.412); /* Blue */
```
And map them in `@theme`:
```css
--color-success: var(--success);
--color-warning: var(--warning);
--color-info: var(--info);
```

## Verification Plan
1.  **Grep Audit**: Ensure no `text-gray-*` or `bg-blue-*` remain in `resources/js`.
2.  **Visual Walkthrough**: Check `Dashboard`, `Welcome`, and `Workflow` pages.
3.  **Contrast Check**: Verify accessibility in both Light and Dark modes.
