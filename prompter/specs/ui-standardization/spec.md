# ui-standardization Specification

## Purpose
TBD - created by archiving change integrate-shadcn-ui. Update Purpose after archive.
## Requirements
### Requirement: Project-Wide Shadcn UI Adoption
The application SHALL utilize Shadcn UI as the exclusive library for primitive UI components (Buttons, Inputs, Checkboxes, Selects, Dialogs, etc.) to ensure accessibility and design consistency.

#### Scenario: Legacy Component Deprecation
*   **Given** an existing legacy component like `PrimaryButton` or `TextInput`
*   **When** a developer needs a button or input on a page
*   **Then** they MUST use the equivalent Shadcn component found in `resources/js/Components/ui/*`
*   **And** the legacy components SHALL be phased out until no references remain.

#### Scenario: Visual Parity During Migration
*   **Given** a page being migrated from legacy components to Shadcn UI
*   **When** the migration is complete
*   **Then** the page MUST maintain functional parity
*   **But** it SHALL adopt the updated visual styling, spacing, and transition effects provided by Shadcn UI.

#### Scenario: Form Integration
*   **Given** a form using Inertia.js `useForm`
*   **When** integrated with Shadcn UI components (e.g., `Input`, `Checkbox`)
*   **Then** the components MUST correctly bind to form values and emit appropriate change events
*   **And** validation errors MUST be displayed using Shadcn-compatible patterns (e.g., using `Label` and error text styling).

