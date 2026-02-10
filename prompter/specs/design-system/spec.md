# design-system Specification

## Purpose
TBD - created by archiving change standardize-design-tokens. Update Purpose after archive.
## Requirements
### Requirement: Consistent Theme Usage
The application SHALL exclusively use semantic design tokens for all visual styling (background, text, borders) to ensure consistency and full support for Dark Mode.

#### Scenario: Replacing Hardcoded Colors
*   **Given** a component using hardcoded Tailwind classes like `text-gray-500` or `bg-blue-600`
*   **When** the component is rendered
*   **Then** it MUST instead use semantic tokens like `text-muted-foreground` or `bg-primary`
*   **And** the visual appearance SHALL remain professional and accessible in both Light and Dark modes.

#### Scenario: Eliminating Arbitrary Values
*   **Given** a UI element using an arbitrary color value like `bg-[#f3f4f6]`
*   **When** audited for design compliance
*   **Then** the arbitrary value MUST be replaced with the nearest corresponding design token from `app.css`.

### Requirement: Semantic Field Type Coloring
Document fields (Signature, Initial, Date, etc.) SHALL use semantically defined colors rather than specific primitive colors (blue, indigo, etc.).

#### Scenario: Field Placement Visuals
*   **Given** a "Signature" field type
*   **When** displayed in the FieldPlacement editor
*   **Then** it must use the `primary` or `chart-1` token for its highlighting and icons, ensuring it adapts to shifts in the primary theme.

