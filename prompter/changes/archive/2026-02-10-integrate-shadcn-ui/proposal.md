# Proposal: Integrate Shadcn UI

## Why
The application currently uses a mix of legacy Inertia/Laravel components and newly introduced Shadcn UI components. This inconsistency leads to fragmented UI styles, duplicated logic for common components (like buttons and inputs), and makes it harder to maintain a unified design system. Integrating Shadcn UI project-wide will provide a robust, accessible, and highly customizable component library that aligns with modern React best practices.

## Goal
Fully integrate Shadcn UI as the primary component library. This involves:
1.  Replacing all legacy UI components (PrimaryButton, TextInput, etc.) with their Shadcn equivalents.
2.  Adding missing Shadcn components (Tabs, Select, Card, etc.) to support existing features.
3.  Standardizing all pages to use Shadcn components for consistent look and feel.
4.  Ensuring all components follow the semantic design tokens established in the project.

## Scope
-   **Component Replacement**:
    - `PrimaryButton.jsx`, `SecondaryButton.jsx`, `DangerButton.jsx` -> `ui/button.jsx`
    - `TextInput.jsx` -> `ui/input.jsx`
    - `Checkbox.jsx` -> `ui/checkbox.jsx`
    - `InputLabel.jsx` -> `ui/label.jsx`
    - `Modal.jsx` -> `ui/dialog.jsx`
    - `Dropdown.jsx` -> `ui/dropdown-menu.jsx`
-   **New Components**: Install and configure `Tabs`, `Select`, `Card`, `Badge`, `Switch`, and `Table` from Shadcn.
-   **Refactoring**: Update all Pages (`Dashboard`, `Documents`, `Welcome`, etc.) and high-level components to use the new `ui/*` components.
-   **Cleanup**: Once all references are removed, delete legacy components from `resources/js/Components`.

## What Changes
- `resources/js/Components/ui/*`: Addition of common UI components.
- All files in `resources/js/Pages/`: Search and replace legacy components with Shadcn counterparts.
- `resources/js/Layouts/`: Update layout-level navigation and identity elements to use Shadcn styles.

## Implementation Strategy
1.  **Preparation**: Verify all existing Shadcn components (`button`, `input`, `checkbox`, etc.) have the correct variants to match the app's design tokens.
2.  **Add Components**: Install additional Shadcn components needed for current UI patterns.
3.  **Phase 1: Forms & Inputs**: Replace `TextInput`, `Checkbox`, and `InputLabel` across the app.
4.  **Phase 2: Buttons**: Replace all variations of legacy buttons with `Button` component using variants.
5.  **Phase 3: Overlays**: Replace `Modal` and `Dropdown` with `Dialog` and `DropdownMenu`.
6.  **Phase 4: Cleanup**: Remove deprecated legacy component files.

## Benefits
-   **Visual Consistency**: A unified aesthetic across the entire application.
-   **Accessibility**: Built-in ARIA compliance from Radix UI (which Shadcn uses).
-   **Developer Experience**: Faster development using a standardized, well-documented component library.
-   **Maintainability**: Easier to theme and update global styles via Tailwind and Shadcn's theme system.
