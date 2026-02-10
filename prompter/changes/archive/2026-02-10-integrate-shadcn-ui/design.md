# Design: Shadcn UI Integration

## Architectural Reasoning
Transitioning to Shadcn UI allows us to move away from ad-hoc styled components to a standardized system built on Radix UI primitives. This ensures better accessibility and more predictable state management for complex components like dialogs and dropdowns.

### Component Mapping
| Legacy Component | Shadcn Component | Notes |
| :--- | :--- | :--- |
| `PrimaryButton` | `Button` (variant: "default") | Map blue styles to `primary` token. |
| `SecondaryButton` | `Button` (variant: "outline") | Map gray styles to `secondary` or `outline` variant. |
| `DangerButton` | `Button` (variant: "destructive") | Map red styles to `destructive` token. |
| `TextInput` | `Input` | Ensure focus and border states align with design tokens. |
| `Checkbox` | `Checkbox` | |
| `InputLabel` | `Label` | |
| `Modal` | `Dialog` | Wrap old `Modal` logic or replace with `DialogContent` structure. |
| `Dropdown` | `DropdownMenu` | |

### Styling Synchronization
All Shadcn components will use the CSS variables defined in `resources/css/app.css`. We will ensure that:
- `--primary` maps to the brand's primary color.
- `--destructive` maps to the danger/error color.
- `--radius` is standardized across components.

### Form Handling
We will continue using Inertia's `useForm` hook. Shadcn components will be updated to accept standard React props (e.g., `value`, `onChange`) to remain compatible with Inertia's form state.

### Migration Path
To avoid breaking the application, we will:
1.  Keep legacy components alive while refactoring.
2.  Use a feature-by-feature or page-by-page approach for larger pages (e.g., `Dashboard` first, then others).
3.  Add automated scripts or regex if possible for simple replacements like `PrimaryButton` -> `Button`.
