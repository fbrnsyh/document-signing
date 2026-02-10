# Tasks: Standardize Design Tokens

- [x] **Infrastructure**
    - [x] Add semantic color aliases (`success`, `warning`, `info`) to `e-sign-app/resources/css/app.css` if missing.  <!-- dependency: none -->
    - [x] Update Tailwind `@theme` in `app.css` to include new semantic tokens. <!-- dependency: Infrastructure-1 -->

- [x] **Core Layout & Components**
    - [x] Refactor `AuthenticatedLayout.jsx` to ensure all structural elements use tokens. <!-- dependency: Infrastructure -->
    - [x] Refactor `Components/Workflow/FieldPlacement.jsx` field types and UI. <!-- dependency: Infrastructure -->
    - [x] Refactor `Components/Workflow/ReviewAndSend.jsx` summary cards. <!-- dependency: Infrastructure -->
    - [x] Refactor `Components/Workflow/SignerManagement.jsx` signer list items. <!-- dependency: Infrastructure -->

- [x] **Pages**
    - [x] Update `Pages/Welcome.jsx` landing page sections. <!-- dependency: Infrastructure -->
    - [x] Update `Pages/Dashboard.jsx` stat cards and lists. <!-- dependency: Infrastructure -->
    - [x] Update `Pages/Documents/Index.jsx` document list rows. <!-- dependency: Infrastructure -->

- [x] **Validation**
    - [x] Audit all remaining files in `resources/js` for hardcoded Tailwind colors. <!-- dependency: all -->
    - [x] Test Dark Mode consistency across all modified pages. <!-- dependency: all -->

