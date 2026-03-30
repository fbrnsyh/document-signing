# AGENTS — Project Knowledge Base

## 1. 📍 Project Summary
- **Business Purpose**: A production-grade electronic signature and document management platform for small teams (5-50 users).
- **Product Type**: Web Application / SaaS.
- **Core Capabilities**: Secure document upload, multi-party signature workflows (Direct, Sequential, Parallel), visual signature placement, and immutable audit trails.
- **Target Users**: Professional teams needing legally binding digital signatures without complex enterprise overhead.

## 2. 🧱 Tech Stack
- **Frontend**: React 18.x, Inertia.js (Full-stack bridge), Tailwind CSS 3.x, shadcn/ui components.
- **Backend**: Laravel 10.x, PHP 8.3.
- **Database**: PostgreSQL 15.x (Primary).
- **Cache/Queue**: Laravel default (File/Database) or Redis (Optional).
- **Infrastructure**: Dockerized environment optimized for Coolify, featuring a multi-stage build (Node builder + PHP/Nginx runtime).
- **PDF Processing**: setasign/fpdf, setasign/fpdi for backend manipulation; pdfjs-dist for frontend rendering.

## 3. 🏗️ Architecture Overview
```
[ Browser ] <---(Inertia.js over HTTPS)---> [ Laravel App (Nginx + PHP-FPM) ]
                                                |            |
                                                |            v
                                                |      [ PostgreSQL DB ]
                                                v
                                         [ File Storage (Local/S3) ]
```
- **Service Boundaries**: Single monolithic application with a clear separation between React components (UI) and Laravel Controllers/Services (Logic).
- **Data Flow**: Inertia.js handles navigation and data passing between Laravel and React without a separate REST API for the core UI.
- **Async Processing**: Laravel Queues for email notifications and PDF processing tasks.

## 4. 📁 Folder Structure & Key Files
- `e-sign-app/`: Primary application directory.
    - `app/`: Laravel core (Models, Controllers, Services, Policies).
    - `resources/js/`: React frontend (Pages, Components, Contexts).
    - `routes/`: Web and API route definitions.
    - `Dockerfile`: Production image definition with multi-stage build.
    - `docker-compose.yml`: Service orchestration for Coolify/Local dev.
    - `.dockerignore`: Build optimization rules.
    - `artisan`: Laravel CLI entry point.
- `project-brief.md`: High-level vision and requirements.
- `AGENTS.md`: This knowledge base.

## 5. 🔑 Core Business Logic & Domain Rules
- **Signing Workflows**:
    - **Direct**: Upload -> Sign -> Complete.
    - **Sequential**: Signer 1 -> Signer 2 -> ... -> Complete.
    - **Parallel**: All signers notified -> Sign independently -> Complete when all finish.
- **Validation Rules**:
    - Max file size: 25 MB.
    - Required fields must be placed before sending.
    - Signers must be assigned to specific fields.
- **Audit Trails**: Every interaction (view, sign, reject) triggers an immutable log entry with IP, UserID, and Timestamp.

## 6. 🗂️ Data Models / Entities
- `User`: id, name, email, role (admin/member/viewer), signature_image.
- `Document`: id, uploader_id, title, status (draft/pending/partial/completed/cancelled), signing_mode.
- `SignatureRequest`: id, document_id, signer_id, signing_order, status (pending/signed/rejected).
- `SignatureField`: id, request_id, page, x/y/width/height, type (signature/initial/date/text).
- `AuditLog`: id, document_id, action, ip_address, metadata (JSON).

## 7. 🧠 Domain Vocabulary / Glossary
- **Inertia.js**: A library that allows building single-page apps using classic server-side routing and controllers.
- **Direct Signing**: A "self-sign" workflow where the uploader is the only signer.
- **Sequential Signing**: An "order-matters" workflow.
- **Parallel Signing**: A "free-for-all" workflow.
- **Soft Delete**: Deleting a record while keeping it in the database with a `deleted_at` timestamp.

## 8. 👥 Target Users & Personas
- **Admin**: System management, user onboarding, global document oversight.
- **Member**: Primary user who uploads documents and initiates signature requests.
- **Viewer**: Read-only access for parties needing to monitor progress without signing.

## 9. ✨ UI/UX Principles
- **Clean Interface**: Minimalist dashboard focusing on "Actions Required".
- **Visual Canvas**: Drag-and-drop interface for placing signature boxes on PDF previews.
- **Responsive**: Full mobile support for signing documents on the go.
- **Dark Mode**: Native support via Tailwind CSS.

## 10. 🔒 Security & Privacy Rules
- **Authentication**: Laravel Sanctum/Session with CSRF protection.
- **Authorization**: Laravel Policies enforce that users only access documents they uploaded or are assigned to.
- **File Privacy**: Documents stored outside `public/`. Access granted via time-limited (15m) signed URLs.
- **Encryption**: Hashed passwords (Bcrypt) and encrypted storage for sensitive data if required.

## 11. 🤖 Coding Conventions & Standards
- **Naming**: PascalCase for Classes/Components, camelCase for methods/variables.
- **Structure**: Follow standard Laravel directory structure. React components grouped by feature.
- **Errors**: Standard Laravel exception handling with user-friendly Inertia flash messages.
- **Logging**: Use `Log` facade for system events; `AuditLog` model for business-critical events.

## 12. 🧩 AI Agent Development Rules
- **❌ Prohibitions**:
    - Never invent fields not defined in the ERD/Schema.
    - Never invent workflows not defined in the FSD/Brief.
    - Never bypass authorization policies in Controller logic.
    - Never modify database schemas without matching migration files.
- **✅ Requirements**:
    - Always match existing Tailwind/shadcn component styles.
    - Ensure all state-changing actions are logged to `audit_logs`.
    - If modifying database structures, ensure `ERD` (if exists) is updated first.
- **Cascade Trigger**: If `project-brief.md` is updated, review `AGENTS.md` for consistency.

## 13. 🗺️ Integration Map
- **File Storage**: Local (dev), S3/DigitalOcean Spaces (production).
- **Email**: Mailgun/SES via Laravel Mail.
- **Coolify**: Automatic deployment via Dockerfile + docker-compose.yml.

## 14. 🗺️ Roadmap & Future Plans
- **Phase 1 (Current)**: MVP with User Auth, Document Upload, and Direct Signing.
- **Phase 2**: Multi-party workflows (Sequential/Parallel).
- **Phase 3**: Mobile optimization, advanced audit exports, and security hardening.

## 15. ⚠️ Known Issues & Limitations
- **PDF Conversion**: Non-PDF formats (DOCX/Images) need an internal conversion mechanism (currently planned).
- **Browser Preview**: High-complexity PDFs might render slowly in `pdfjs-dist`.

## 16. 🧪 Testing Strategy
- **Backend**: PHPUnit for models and service-level business logic.
- **Features**: Laravel HTTP tests for route validation.
- **Frontend**: Currently manual; Playwright/Cypress planned for signing canvas flows.

## 17. 🧯 Troubleshooting Guide
- **Build Errors**: Check Node version (20+) and Vite config.
- **Database Connection**: Ensure Postgres user has permissions and Docker network is stable.
- **Permissions**: Verify `storage/` and `bootstrap/cache/` are writable by `www-data`.

## 18. 📞 Ownership & Responsibility Map
- **Architecture**: AI/Shared.
- **Documentation**: AI (Maintainer of AGENTS.md and specs).
- **Deployment**: Coolify (Provisioning).

## 19. 📚 Canonical Documentation Flow
Product Brief
    ↓
   PRD (TBD)
    ↓
   FSD (TBD)
    ↓
   ERD (TBD)
    ↓
API Contract (TBD)
    ↓
UI Wireframes (TBD)
    ↓
 TDD-Lite (TBD)

## 20. 🧩 Document Dependency Rules
- PRD Requires: Product Brief
- FSD Requires: PRD
- ERD Requires: FSD
- TDD Requires: FSD + ERD

## 21. 📐 Source-of-Truth Matrix
- **Vision & Scope**: `project-brief.md`
- **Behavior & Rules**: `project-brief.md` / `AGENTS.md`
- **Architecture**: `AGENTS.md` / `Dockerfile` / `docker-compose.yml`

## 22. 🔁 Regeneration Rules
- `project-brief.md` changes → Review/Regenerate: `AGENTS.md`.
- Architectural shifts (e.g. moving to S3) → Update `AGENTS.md` Tech Stack.

## 23. ⏳ Missing Information
- **PRD/FSD/ERD**: Specific detailed requirement documents beyond the project brief are currently consolidated into `AGENTS.md`.
- **API Surface**: Not yet formally documented in an `api_contract.md`.