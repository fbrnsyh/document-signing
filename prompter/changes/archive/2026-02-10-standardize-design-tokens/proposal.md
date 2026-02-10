# Proposal: Standardize Design Tokens

## Why
The application currently uses a mix of hardcoded Tailwind colors and semantic design tokens. This makes maintaining a consistent look and feel difficult, especially for Dark Mode support. Standardizing on semantic tokens centralizes color management and ensures a professional, themed experience throughout the app.


## Goal
Standardize all background and text colors across the application by replacing arbitrary Tailwind values and hardcoded colors with the established semantic design token system defined in `e-sign-app/resources/css/app.css`.

## Scope
-   **CSS Regularization**: Map hardcoded colors (e.g., `text-blue-500`, `bg-gray-100`) to semantic tokens (e.g., `text-primary`, `bg-muted`).
-   **Component Refactoring**: Update core components like `FieldPlacement`, `ReviewAndSend`, and `SignerManagement` to use tokens.
-   **Page Updates**: Ensure `Welcome`, `Dashboard`, and `Documents` pages follow the token system.
-   **Arbitrary Values**: Remove any Tailwind arbitrary values like `bg-[#...]` or `text-[...]` where they refer to colors (font sizes like `text-[10px]` may remain if no token exists, but color-related ones must go).

## What Changes
- `e-sign-app/resources/js/Components/Audit/AdminActivityLog.jsx`: Updated icon colors, loading states, error messages, and general UI to use semantic tokens.
- `e-sign-app/resources/js/Pages/Documents/Index.jsx`: Standardized search inputs and layout borders.
- `e-sign-app/resources/js/Pages/Documents/Upload.jsx`: Updated folder selection and queue list styles.
- `e-sign-app/resources/js/Pages/Documents/Show.jsx`: Standardized title editing and status badges.
- `e-sign-app/resources/js/Components/Workflow/FieldPlacement.jsx`: Refactored tool icons and property panels.
- `e-sign-app/resources/js/Components/Workflow/ReviewAndSend.jsx`: Updated summary card visual styles.

## Implementation Strategy
1.  **Define Mapping**: Create a clear mapping of existing hardcoded colors to the closest semantic tokens.
2.  **Add Tokens (Optional)**: If essential semantic colors (like `success` or `warning`) are missing from `app.css`, propose adding them to the base layer.
3.  **Search and Replace**: Systematically replace occurrences using `multi_replace_file_content`.
4.  **Verification**: Manual verification across light and dark modes to ensure no visual regressions and improved consistency.

## Benefits
-   **Consistency**: Unified look and feel across the entire app.
-   **Maintainability**: Changing a single token in `app.css` updates the whole UI.
-   **Dark Mode Support**: Seamless transition between modes as tokens are already mode-aware.
