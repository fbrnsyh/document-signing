# Tasks: Integrate Shadcn UI

- [ ] **Infrastructure & Core Components**
    - [ ] Install missing Shadcn components: `Tabs`, `Select`, `Card`, `Badge`, `Switch`, `Table`, `Popover`, `Tooltip`.
    - [ ] Verify `Button`, `Input`, `Checkbox`, `Dialog`, `DropdownMenu`, `Label` are correctly configured with theme tokens.
    - [ ] Create a utility for common form field patterns (Label + Input + Error) using Shadcn primitives.

- [ ] **Button Migration**
    - [ ] Replace `PrimaryButton` with `Button` (variant: default) across all components.
    - [ ] Replace `SecondaryButton` with `Button` (variant: outline) across all components.
    - [ ] Replace `DangerButton` with `Button` (variant: destructive) across all components.
    - [ ] Update imports and prop names (e.g., `processing` -> custom loading logic if needed, though Shadcn Button handles this via variants/manual icons).

- [ ] **Form & Input Migration**
    - [ ] Replace `TextInput` with `Input` in all Auth pages (Login, Register, etc.).
    - [ ] Replace `TextInput` with `Input` in Profile and Admin pages.
    - [ ] Replace legacy `Checkbox` with Shadcn `Checkbox` (ensure compatibility with Inertia's checkbox state handling).
    - [ ] Replace `InputLabel` with Shadcn `Label`.

- [ ] **Overlay & Navigation Migration**
    - [ ] Replace `Modal` with `Dialog` in `InviteUserModal`, `SignatureModal`, `RejectModal`.
    - [ ] Replace `Dropdown` with `DropdownMenu` in Layouts and Document lists.
    - [ ] Update `NavLink` and `ResponsiveNavLink` to align with Shadcn's navigation styles if applicable.

- [ ] **Page-Specific Refactoring**
    - [ ] Refactor `FieldPlacement.jsx` to use Shadcn components for tools and properties panel.
    - [ ] Refactor `ReviewAndSend.jsx` to use Shadcn `Card` and `Badge` for the summary view.
    - [ ] Refactor `AdminActivityLog.jsx` to use Shadcn `Table`.

- [ ] **Cleanup & Validation**
    - [ ] Delete `resources/js/Components/PrimaryButton.jsx`.
    - [ ] Delete `resources/js/Components/SecondaryButton.jsx`.
    - [ ] Delete `resources/js/Components/DangerButton.jsx`.
    - [ ] Delete `resources/js/Components/TextInput.jsx`.
    - [ ] Delete `resources/js/Components/Checkbox.jsx`.
    - [ ] Delete `resources/js/Components/InputLabel.jsx`.
    - [ ] Delete `resources/js/Components/Modal.jsx`.
    - [ ] Delete `resources/js/Components/Dropdown.jsx`.
    - [ ] Run `npm run build` and verify no broken imports.
    - [ ] Manually verify UI across light and dark modes.
