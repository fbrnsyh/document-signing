# Functional Specification Document
## E-Sign Document Management Web Application

---

## Document Information

| Field | Details |
|-------|---------|
| **Document Title** | E-Sign Document Management - Functional Specification |
| **Version** | 1.0 |
| **Date** | February 5, 2026 |
| **PRD Reference** | [prd.md](./prd.md) |
| **Author** | [TBD] |
| **Reviewers** | [TBD] |

---

## 1. Executive Summary

This FSD defines the functional specifications for a production-grade electronic signature and document management web application. The system enables small teams (5-50 users) to digitally sign documents through three distinct workflows (Direct, Sequential, Parallel), with complete audit trails and role-based access control.

**Core Capabilities:**
- User authentication with email verification and session management
- Document upload with multi-format support and PDF conversion
- Three signature workflows: Direct (self-sign), Sequential (ordered), Parallel (simultaneous)
- Real-time action dashboard with status tracking
- Immutable audit trails with export functionality
- Role-based permissions (Admin, Member, Viewer)

---

## 2. Scope

### 2.1 In Scope

| Module | Features |
|--------|----------|
| **Authentication** | Registration, login, password reset, session management, 2FA (Phase 3) |
| **User Management** | Profile updates, signature storage, role assignment |
| **Document Management** | Upload, metadata, folders, search, archive/delete |
| **Signature Workflows** | Direct, Sequential, Parallel signing modes |
| **Signature Capture** | Draw, upload image, typed signature |
| **Dashboard** | Pending actions, waiting on others, completed, drafts |
| **Audit Trail** | Per-document logging, system-wide admin view, export |
| **Notifications** | Email alerts for signing requests (Phase 2) |

### 2.2 Out of Scope

- Mobile native applications
- PKI/qualified electronic signatures
- Document template library
- Third-party API integrations
- Multi-language support (i18n)
- Blockchain-based signatures

### 2.3 Assumptions

| ID | Assumption |
|----|------------|
| A-01 | Users have stable internet connections |
| A-02 | All documents are converted to PDF for signing |
| A-03 | Business e-signatures are legally sufficient (no PKI required) |
| A-04 | Maximum 10 signers per document (pending stakeholder confirmation) |
| A-05 | Signers must have registered accounts (guest signing TBD) |

### 2.4 Dependencies

| Dependency | Description |
|------------|-------------|
| Laravel 11.x | Backend framework for API and business logic |
| React 18.x | Frontend framework with Inertia.js bridge |
| PostgreSQL 15.x | Primary database |
| S3-compatible storage | Document file storage |
| Email service (SMTP/SES) | Notification delivery |
| spatie/pdf-to-image | PDF thumbnail generation |

---

## 3. User Roles & Permissions

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| **Admin** | System administrator with full access | Manage users, view all documents, export system reports, modify roles |
| **Member** | Standard user with full document capabilities | Upload documents, assign signers, sign documents, manage own documents |
| **Viewer** | Read-only access | View assigned documents only, cannot upload or sign |

### Permission Matrix

| Action | Admin | Member | Viewer |
|--------|-------|--------|--------|
| Register/Login | ✓ | ✓ | ✓ |
| Upload documents | ✓ | ✓ | ✗ |
| Sign documents | ✓ | ✓ | ✗ |
| View own documents | ✓ | ✓ | ✓ |
| View all documents | ✓ | ✗ | ✗ |
| Manage users | ✓ | ✗ | ✗ |
| Export system reports | ✓ | ✗ | ✗ |
| Export document audit | ✓ | ✓ | ✗ |

---

## 4. Functional Requirements

### 4.1 Authentication Module

#### FR-001: User Registration
- **Priority:** Must Have
- **PRD Reference:** US-01
- **Description:** System shall allow new users to register using email and password
- **Business Rules:**
  - BR-001: Email must be unique across the system
  - BR-002: Password must be minimum 8 characters with 1 uppercase and 1 number
  - BR-003: Email verification required before account activation
- **Acceptance Criteria:**
  - [ ] Given valid email/password/name, when user submits registration, then verification email is sent within 60 seconds
  - [ ] Given verification link clicked, when token is valid, then account status changes to "active"
  - [ ] Given invalid email format, when user submits, then error message is displayed
  - [ ] Given existing email, when user submits, then "email already registered" error is shown
- **Error Handling:**
  - Invalid email format → Display "Please enter a valid email address"
  - Duplicate email → Display "This email is already registered"
  - Expired verification link → Display "Link expired, request new verification"

#### FR-002: User Login
- **Priority:** Must Have
- **PRD Reference:** US-02
- **Description:** System shall authenticate users with email and password
- **Business Rules:**
  - BR-004: Session expires after 120 minutes of inactivity
  - BR-005: Maximum 5 consecutive failed login attempts before temporary lockout (15 min)
  - BR-006: Successful login creates secure session with CSRF token
- **Acceptance Criteria:**
  - [ ] Given valid credentials, when user logs in, then redirect to dashboard
  - [ ] Given invalid credentials, when user logs in, then display "Invalid email or password"
  - [ ] Given 5 failed attempts, when user tries again, then display lockout message with countdown
  - [ ] Given session inactive 120+ minutes, when user acts, then redirect to login

#### FR-003: Password Reset
- **Priority:** Must Have
- **PRD Reference:** US-03
- **Description:** System shall allow users to reset forgotten passwords via email token
- **Business Rules:**
  - BR-007: Reset token expires after 1 hour
  - BR-008: Reset token is single-use
  - BR-009: Email sent regardless of whether email exists (prevent enumeration)
- **Acceptance Criteria:**
  - [ ] Given registered email, when reset requested, then email with reset link sent within 5 minutes
  - [ ] Given valid reset token, when new password submitted, then password is updated
  - [ ] Given expired/used token, when accessed, then display "Link expired" with option to request new

#### FR-004: Two-Factor Authentication (Phase 3)
- **Priority:** Should Have
- **PRD Reference:** PRD Scope
- **Description:** System shall support optional TOTP-based 2FA
- **Business Rules:**
  - BR-010: 2FA is optional per user
  - BR-011: TOTP codes valid for 30 seconds with 1-step tolerance
  - BR-012: Recovery codes generated on 2FA setup (10 single-use codes)

---

### 4.2 User Profile Module

#### FR-005: Profile Management
- **Priority:** Must Have
- **PRD Reference:** US-04
- **Description:** System shall allow users to update their profile information
- **Business Rules:**
  - BR-013: Email changes require re-verification
  - BR-014: Name limited to 100 characters
  - BR-015: Phone number optional, validated format if provided
- **Acceptance Criteria:**
  - [ ] Given logged-in user, when updating name/phone, then changes saved immediately
  - [ ] Given email change, when submitted, then verification email sent to new address
  - [ ] Given verified new email, when confirmed, then primary email updated

#### FR-006: Signature Management
- **Priority:** Must Have
- **PRD Reference:** US-05
- **Description:** System shall allow users to create and store their signature
- **Business Rules:**
  - BR-016: User may have one saved signature at a time
  - BR-017: Signature image stored as PNG, max 500KB
  - BR-018: Three creation methods: draw, upload, type
- **Acceptance Criteria:**
  - [ ] Given draw mode, when user draws on canvas, then signature captured as PNG
  - [ ] Given upload mode, when valid PNG/JPG selected, then signature saved
  - [ ] Given type mode, when name entered and font selected, then signature generated

---

### 4.3 Document Management Module

#### FR-007: Document Upload
- **Priority:** Must Have
- **PRD Reference:** US-06, US-07
- **Description:** System shall accept document uploads via drag-and-drop or file picker
- **Business Rules:**
  - BR-019: Maximum file size 25 MB per document
  - BR-020: Supported formats: PDF, DOCX, PNG, JPG
  - BR-021: Non-PDF formats converted to PDF on upload
  - BR-022: Maximum 10 documents per bulk upload
  - BR-023: Thumbnail generated for each uploaded document
- **Acceptance Criteria:**
  - [ ] Given valid file, when uploaded, then file stored and thumbnail generated
  - [ ] Given DOCX/PNG/JPG, when uploaded, then converted to PDF
  - [ ] Given file > 25MB, when upload attempted, then display size limit error
  - [ ] Given unsupported format, when upload attempted, then display format error
  - [ ] Given 10 files selected, when bulk uploaded, then all processed with individual status

#### FR-008: Document Metadata
- **Priority:** Must Have
- **PRD Reference:** US-08
- **Description:** System shall allow editing of document metadata
- **Business Rules:**
  - BR-024: Title required, max 255 characters
  - BR-025: Description optional, max 500 characters
  - BR-026: Tags optional, max 10 tags per document, 50 chars each
- **Acceptance Criteria:**
  - [ ] Given uploaded document, when metadata edited, then changes saved immediately
  - [ ] Given tags added, when searching, then document appears in tag search results

#### FR-009: Folder Organization
- **Priority:** Must Have
- **PRD Reference:** US-09
- **Description:** System shall support folder-based document organization
- **Business Rules:**
  - BR-027: Folders can be nested up to 3 levels deep
  - BR-028: Folder names max 100 characters
  - BR-029: Documents can belong to one folder only
- **Acceptance Criteria:**
  - [ ] Given user creates folder, when saved, then folder appears in navigation
  - [ ] Given document moved to folder, when viewing folder, then document listed

#### FR-010: Document Search & Filter
- **Priority:** Must Have
- **PRD Reference:** US-10
- **Description:** System shall provide search and filter capabilities
- **Business Rules:**
  - BR-030: Search matches title, tags, and uploader name
  - BR-031: Filter by status: Draft, Pending, Partial, Completed, Cancelled
  - BR-032: Filter by date range
- **Acceptance Criteria:**
  - [ ] Given search term, when submitted, then matching documents displayed
  - [ ] Given status filter, when applied, then only matching status documents shown

#### FR-011: Document Archive/Delete
- **Priority:** Must Have
- **PRD Reference:** US-11
- **Description:** System shall support soft deletion with recovery
- **Business Rules:**
  - BR-033: Deleted documents recoverable for 30 days
  - BR-034: After 30 days, documents permanently deleted via scheduled job
  - BR-035: Only document owner or admin can delete
- **Acceptance Criteria:**
  - [ ] Given document deleted, when viewing trash, then document appears
  - [ ] Given document in trash < 30 days, when restored, then document reactivated
  - [ ] Given document in trash > 30 days, then document permanently removed

---

### 4.4 Signature Workflow Module

#### FR-012: Direct Signing (Self-Sign)
- **Priority:** Must Have
- **PRD Reference:** US-12
- **Description:** System shall allow document owner to sign their own document
- **Business Rules:**
  - BR-036: Only document owner can initiate direct signing
  - BR-037: At least one signature field required before completion
  - BR-038: Document status changes to "Completed" after signing
- **Acceptance Criteria:**
  - [ ] Given uploaded document, when direct sign selected, then signature placement UI displayed
  - [ ] Given signature placed and applied, when confirmed, then document marked completed
  - [ ] Given no signature fields, when trying to complete, then error displayed

#### FR-013: Sequential Signing
- **Priority:** Must Have (Phase 2)
- **PRD Reference:** US-13
- **Description:** System shall enforce ordered multi-party signatures
- **Business Rules:**
  - BR-039: Signers must sign in defined order
  - BR-040: Next signer notified only after previous signer completes
  - BR-041: If any signer rejects, workflow terminates
  - BR-042: Document status: "Pending" → "Partial" → "Completed" or "Cancelled"
- **Acceptance Criteria:**
  - [ ] Given sequential workflow, when Signer 1 completes, then Signer 2 notified
  - [ ] Given Signer 2 tries before Signer 1, then access denied with message
  - [ ] Given any signer rejects, then workflow stops and owner notified

#### FR-014: Parallel Signing
- **Priority:** Must Have (Phase 2)
- **PRD Reference:** US-14
- **Description:** System shall allow simultaneous multi-party signatures
- **Business Rules:**
  - BR-043: All signers notified simultaneously
  - BR-044: Signers can complete in any order
  - BR-045: Document completes when all required signatures collected
- **Acceptance Criteria:**
  - [ ] Given parallel workflow initiated, when saved, then all signers receive email
  - [ ] Given Signer 3 signs before Signer 1, then signature accepted
  - [ ] Given all signers complete, then document status changes to "Completed"

#### FR-015: Signature Field Placement
- **Priority:** Must Have (Phase 2)
- **PRD Reference:** US-15
- **Description:** System shall provide visual editor for placing signature fields
- **Business Rules:**
  - BR-046: Fields can be placed on any page
  - BR-047: Field types: Signature, Initial, Date, Text Input
  - BR-048: Each field assigned to specific signer
  - BR-049: Fields can be marked required or optional
  - BR-050: Minimum one required signature field per signer
- **Acceptance Criteria:**
  - [ ] Given PDF displayed, when field dragged, then field placed at drop location
  - [ ] Given field placed, when resized, then dimensions updated
  - [ ] Given multi-page document, when navigating pages, then fields shown per page

#### FR-016: Signature Application - Draw
- **Priority:** Must Have
- **PRD Reference:** US-16
- **Description:** System shall capture hand-drawn signatures
- **Business Rules:**
  - BR-051: Drawing canvas minimum 300x100 pixels
  - BR-052: Support mouse and touch input
  - BR-053: Clear/redo functionality available
- **Acceptance Criteria:**
  - [ ] Given signing page, when draw selected, then canvas displayed
  - [ ] Given signature drawn, when confirmed, then signature applied to field
  - [ ] Given clear clicked, then canvas reset

#### FR-017: Signature Application - Upload
- **Priority:** Must Have
- **PRD Reference:** US-17
- **Description:** System shall accept uploaded signature images
- **Business Rules:**
  - BR-054: Accepted formats: PNG, JPG
  - BR-055: Maximum file size: 500KB
  - BR-056: Image automatically scaled to fit signature field
- **Acceptance Criteria:**
  - [ ] Given upload selected, when valid image chosen, then preview displayed
  - [ ] Given preview confirmed, then signature applied to field

#### FR-018: Signature Application - Typed
- **Priority:** Must Have
- **PRD Reference:** US-18
- **Description:** System shall generate styled typed signatures
- **Business Rules:**
  - BR-057: Minimum 3 font style options available
  - BR-058: Name text limited to 100 characters
  - BR-059: Generated signature rendered as image
- **Acceptance Criteria:**
  - [ ] Given type selected, when name entered, then preview in selected font displayed
  - [ ] Given font changed, then preview updates in real-time

#### FR-019: Document Rejection
- **Priority:** Must Have
- **PRD Reference:** US-19
- **Description:** System shall allow signers to reject documents
- **Business Rules:**
  - BR-060: Rejection reason required (min 10 characters)
  - BR-061: Rejection terminates workflow
  - BR-062: Owner notified immediately with rejection reason
  - BR-063: Document status changes to "Cancelled"
- **Acceptance Criteria:**
  - [ ] Given signer rejects, when reason provided, then rejection recorded
  - [ ] Given rejection recorded, then owner receives notification
  - [ ] Given rejection without reason, then validation error displayed

---

### 4.5 Dashboard Module

#### FR-020: Waiting for Signature Section
- **Priority:** Must Have
- **PRD Reference:** US-20
- **Description:** System shall display documents requiring user's signature
- **Business Rules:**
  - BR-064: Only shows documents where user is active/next signer
  - BR-065: Sorted by oldest first (FIFO)
  - BR-066: Displays: document name, sender, deadline (if set), workflow type
- **Acceptance Criteria:**
  - [ ] Given pending signatures exist, when dashboard loaded, then section populated
  - [ ] Given "Sign Now" clicked, then user navigated to signing page

#### FR-021: Waiting on Others Section
- **Priority:** Must Have
- **PRD Reference:** US-21
- **Description:** System shall display documents user sent awaiting others' signatures
- **Business Rules:**
  - BR-067: Shows documents uploaded by user with pending signatures
  - BR-068: Displays signature progress (e.g., "2/5 signed")
  - BR-069: Reminder functionality available
- **Acceptance Criteria:**
  - [ ] Given sent documents pending, when dashboard loaded, then section populated
  - [ ] Given "Send Reminder" clicked, then reminder email sent to pending signers

#### FR-022: Recently Completed Section
- **Priority:** Must Have
- **PRD Reference:** US-22
- **Description:** System shall display recently completed documents
- **Business Rules:**
  - BR-070: Shows last 10 completed documents (user involved)
  - BR-071: Sorted by completion date descending
  - BR-072: Download link available for each
- **Acceptance Criteria:**
  - [ ] Given completed documents exist, when dashboard loaded, then section shows up to 10
  - [ ] Given download clicked, then signed PDF downloaded

#### FR-023: Drafts Section
- **Priority:** Must Have
- **PRD Reference:** US-23
- **Description:** System shall display incomplete document setups
- **Business Rules:**
  - BR-073: Shows documents in "Draft" status
  - BR-074: Only owner's drafts visible
- **Acceptance Criteria:**
  - [ ] Given drafts exist, when dashboard loaded, then drafts listed
  - [ ] Given "Continue Setup" clicked, then workflow setup resumed

#### FR-024: Real-time Dashboard Updates (Phase 2)
- **Priority:** Should Have
- **PRD Reference:** US-24
- **Description:** System shall update dashboard without page refresh
- **Business Rules:**
  - BR-075: Updates via WebSocket or polling (fallback)
  - BR-076: Maximum 10-second delay for status changes
- **Acceptance Criteria:**
  - [ ] Given document signed elsewhere, when dashboard open, then section updates automatically

---

### 4.6 Audit Trail Module

#### FR-025: Document Audit Trail
- **Priority:** Must Have
- **PRD Reference:** US-25
- **Description:** System shall maintain immutable audit log per document
- **Business Rules:**
  - BR-077: All events logged with timestamp (UTC), user, action, IP address
  - BR-078: Audit logs cannot be edited or deleted
  - BR-079: Geolocation captured (country/region level)
- **Tracked Events:**
  - Document uploaded
  - Signature request sent
  - Email notification delivered
  - Document viewed
  - Signature applied
  - Signature rejected
  - Document completed
  - Document downloaded
  - Document cancelled
- **Acceptance Criteria:**
  - [ ] Given any tracked action, when performed, then audit entry created
  - [ ] Given audit trail viewed, then chronological timeline displayed

#### FR-026: Audit Trail Export (Phase 3)
- **Priority:** Should Have
- **PRD Reference:** US-26
- **Description:** System shall export audit trails as PDF or CSV
- **Business Rules:**
  - BR-080: Export includes all tracked events with full details
  - BR-081: PDF includes document title, date range, and certifying statement
- **Acceptance Criteria:**
  - [ ] Given export requested, when format selected, then file generated and downloaded

#### FR-027: System Activity Log (Admin)
- **Priority:** Should Have (Phase 3)
- **PRD Reference:** US-27
- **Description:** System shall provide admin view of all system activity
- **Business Rules:**
  - BR-082: Admin only access
  - BR-083: Filterable by user, date range, action type
  - BR-084: Exportable for compliance
- **Acceptance Criteria:**
  - [ ] Given admin accesses activity log, then all system events displayed
  - [ ] Given filters applied, then results filtered accordingly

---

### 4.7 Admin Module

#### FR-028: User Role Management
- **Priority:** Must Have
- **PRD Reference:** US-28
- **Description:** System shall allow admins to manage user roles
- **Business Rules:**
  - BR-085: Only Admin can modify roles
  - BR-086: Cannot demote last Admin account
  - BR-087: Role change effective immediately
- **Acceptance Criteria:**
  - [ ] Given admin views users, then all users listed with current roles
  - [ ] Given role changed, then permissions update immediately

#### FR-029: System Document View
- **Priority:** Must Have
- **PRD Reference:** US-29
- **Description:** System shall allow admins to view all documents
- **Business Rules:**
  - BR-088: Admin can view but not modify other users' documents
  - BR-089: Full search and filter capabilities
- **Acceptance Criteria:**
  - [ ] Given admin views documents, then all system documents accessible

#### FR-030: System Reports (Phase 3)
- **Priority:** Should Have
- **PRD Reference:** US-30
- **Description:** System shall generate compliance reports
- **Business Rules:**
  - BR-090: Date range selection required
  - BR-091: Export formats: PDF, CSV
- **Acceptance Criteria:**
  - [ ] Given report parameters set, when generated, then downloadable file produced

---

## 5. Business Rules Catalog

| ID | Rule | Applies To | Validation |
|----|------|------------|------------|
| BR-001 | Email must be unique across system | Registration | Database unique constraint |
| BR-002 | Password: min 8 chars, 1 uppercase, 1 number | Registration, Password Reset | Regex validation |
| BR-003 | Email verification required before activation | Registration | Status check on login |
| BR-004 | Session expires after 120 min inactivity | Login | Session middleware |
| BR-005 | Max 5 failed login attempts → 15 min lockout | Login | Rate limiter |
| BR-019 | Max file size 25 MB | Upload | File size validation |
| BR-020 | Formats: PDF, DOCX, PNG, JPG | Upload | MIME type validation |
| BR-022 | Max 10 docs per bulk upload | Upload | Array count validation |
| BR-033 | Soft delete recoverable 30 days | Delete | Scheduled job |
| BR-037 | Min 1 signature field required | Direct Sign | Field count validation |
| BR-040 | Sequential: next signer after previous completes | Sequential | Order validation |
| BR-061 | Rejection terminates workflow | Signing | Status update trigger |
| BR-077 | Audit immutable with timestamp/user/IP | All actions | Append-only table |

---

## 6. Data Specifications

### 6.1 Data Entities

#### Users
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | UUID | Yes | Auto-generated | Primary key |
| name | VARCHAR(100) | Yes | Max 100 chars | Display name |
| email | VARCHAR(255) | Yes | Email format, unique | Login email |
| password | VARCHAR(255) | Yes | Bcrypt hashed | Encrypted password |
| role | ENUM | Yes | admin, member, viewer | Access level |
| signature_image | VARCHAR(255) | No | Path string | Stored signature path |
| email_verified_at | TIMESTAMP | No | Valid timestamp | Verification time |
| created_at | TIMESTAMP | Yes | Auto | Creation time |
| updated_at | TIMESTAMP | Yes | Auto | Last update |

#### Documents
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | UUID | Yes | Auto-generated | Primary key |
| uploader_id | UUID (FK) | Yes | Valid user | Document owner |
| folder_id | UUID (FK) | No | Valid folder | Parent folder |
| title | VARCHAR(255) | Yes | Max 255 chars | Document title |
| description | TEXT | No | Max 500 chars | Optional description |
| original_filename | VARCHAR(255) | Yes | - | Original upload name |
| file_path | VARCHAR(255) | Yes | - | Storage path |
| file_size | INTEGER | Yes | Positive | Size in bytes |
| status | ENUM | Yes | draft, pending, partial, completed, cancelled | Current status |
| signing_mode | ENUM | Yes | direct, sequential, parallel | Workflow type |
| deleted_at | TIMESTAMP | No | - | Soft delete timestamp |
| completed_at | TIMESTAMP | No | - | Completion timestamp |
| created_at | TIMESTAMP | Yes | Auto | Creation time |
| updated_at | TIMESTAMP | Yes | Auto | Last update |

#### Signature Requests
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | UUID | Yes | Auto-generated | Primary key |
| document_id | UUID (FK) | Yes | Valid document | Parent document |
| signer_id | UUID (FK) | Yes | Valid user | Assigned signer |
| signing_order | INTEGER | No | Positive | Order for sequential |
| status | ENUM | Yes | pending, signed, rejected | Request status |
| signed_at | TIMESTAMP | No | - | Signature time |
| rejection_reason | TEXT | No | Min 10 chars if rejected | Rejection note |
| created_at | TIMESTAMP | Yes | Auto | Creation time |
| updated_at | TIMESTAMP | Yes | Auto | Last update |

#### Signature Fields
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | UUID | Yes | Auto-generated | Primary key |
| document_id | UUID (FK) | Yes | Valid document | Parent document |
| signature_request_id | UUID (FK) | Yes | Valid request | Assigned signer |
| page_number | INTEGER | Yes | Positive | PDF page |
| x_position | DECIMAL | Yes | 0-100 (%) | Horizontal position |
| y_position | DECIMAL | Yes | 0-100 (%) | Vertical position |
| width | DECIMAL | Yes | Positive | Field width |
| height | DECIMAL | Yes | Positive | Field height |
| field_type | ENUM | Yes | signature, initial, date, text | Field type |
| is_required | BOOLEAN | Yes | - | Required flag |
| created_at | TIMESTAMP | Yes | Auto | Creation time |

#### Audit Logs
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | UUID | Yes | Auto-generated | Primary key |
| document_id | UUID (FK) | Yes | Valid document | Related document |
| user_id | UUID (FK) | No | Valid user | Acting user |
| action | ENUM | Yes | See tracked events | Action type |
| ip_address | VARCHAR(45) | Yes | IPv4/IPv6 | User IP |
| metadata | JSON | No | - | Additional data |
| created_at | TIMESTAMP | Yes | Auto | Event time |

#### Folders
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | UUID | Yes | Auto-generated | Primary key |
| user_id | UUID (FK) | Yes | Valid user | Owner |
| parent_id | UUID (FK) | No | Valid folder | Parent folder |
| name | VARCHAR(100) | Yes | Max 100 chars | Folder name |
| created_at | TIMESTAMP | Yes | Auto | Creation time |
| updated_at | TIMESTAMP | Yes | Auto | Last update |

#### Document Tags
| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| id | UUID | Yes | Auto-generated | Primary key |
| document_id | UUID (FK) | Yes | Valid document | Parent |
| tag | VARCHAR(50) | Yes | Max 50 chars | Tag value |

### 6.2 Data Relationships

```
users ||--o{ documents : uploads
users ||--o{ signature_requests : signs
users ||--o{ folders : owns
users ||--o{ audit_logs : performs
documents ||--o{ signature_requests : has
documents ||--o{ signature_fields : contains
documents ||--o{ audit_logs : tracked
documents ||--o{ document_tags : tagged
documents }o--|| folders : belongs_to
signature_requests ||--o{ signature_fields : assigned
folders ||--o{ folders : parent_child
```

### 6.3 Key Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| users | email | RFC 5322 compliant, unique |
| users | password | Min 8 chars, 1 uppercase, 1 number |
| documents | file_size | Max 26,214,400 bytes (25 MB) |
| documents | status | Valid transitions only |
| signature_fields | x/y_position | 0-100 range |
| audit_logs | * | Insert only, no updates |

---

## 7. Interface Specifications

### 7.1 User Interface Requirements

#### Screen: Registration
- Email, password, confirm password, name fields
- Password strength indicator
- Terms acceptance checkbox
- Submit button with loading state

#### Screen: Login
- Email, password fields
- Remember me checkbox
- Forgot password link
- Submit button with loading state

#### Screen: Dashboard
- Four sections in priority order:
  1. Waiting for Your Signature (cards with Sign Now action)
  2. Waiting on Others (cards with progress and reminder action)
  3. Recently Completed (list with download action)
  4. Drafts (cards with Continue Setup action)
- Global search
- Notification bell with unread count

#### Screen: Document Upload
- Drag-and-drop zone with click-to-browse
- Upload progress per file
- Bulk upload display
- Error states per file

#### Screen: Document Signing
- PDF viewer with page navigation
- Signature field highlighting
- Signature method tabs (Draw/Upload/Type)
- Apply/Reject buttons
- Progress indicator for multi-signer

#### Screen: Audit Trail
- Vertical timeline with event cards
- Each card: icon, action, user, timestamp, IP
- Export button (PDF/CSV)

### 7.2 API Specifications (Key Endpoints)

| Endpoint | Method | Input | Output | Business Logic |
|----------|--------|-------|--------|----------------|
| /api/auth/register | POST | email, password, name | user, token | Create user, send verification |
| /api/auth/login | POST | email, password | user, token | Validate credentials, create session |
| /api/auth/password/reset | POST | email | success | Generate reset token, send email |
| /api/documents | POST | file, title, tags[] | document | Upload, convert, generate thumbnail |
| /api/documents/{id} | GET | - | document, fields | Retrieve with signature fields |
| /api/documents/{id}/sign | POST | field_id, signature_data | signature_request | Apply signature to field |
| /api/documents/{id}/reject | POST | reason | signature_request | Reject and notify owner |
| /api/documents/{id}/audit | GET | - | audit_logs[] | Retrieve audit trail |
| /api/dashboard | GET | - | sections{} | Aggregate dashboard data |

### 7.3 Integration Requirements

| System | Purpose | Method |
|--------|---------|--------|
| Email Service (SMTP/SES) | Notifications | Laravel Mail |
| S3 Storage | Document files | Laravel Storage |
| WebSocket (Pusher/Socket.io) | Real-time updates | Laravel Echo |

---

## 8. Non-Functional Considerations

| Category | Requirement | Functional Impact |
|----------|-------------|-------------------|
| Performance | Page load < 2 sec | Eager loading, caching |
| Performance | Upload processing < 5 sec for 10 MB | Queue processing |
| Scalability | 500 concurrent users | Horizontal scaling, queues |
| Security | HTTPS only | Force SSL middleware |
| Security | Rate limit 60/min | Route middleware |
| Security | Signed URLs 15 min expiry | Storage configuration |
| Accessibility | WCAG 2.1 AA | Semantic HTML, ARIA labels |
| Reliability | 99.5% uptime | Health checks, monitoring |

---

## 9. Reporting & Analytics Requirements

| Report | Access | Data | Format |
|--------|--------|------|--------|
| Document Audit Trail | Owner, Admin | All document events | PDF, CSV |
| System Activity (Admin) | Admin only | All system events | PDF, CSV |
| User Activity Summary | Admin only | Actions per user | PDF, CSV |

---

## 10. Traceability Matrix

| PRD Item | FSD Requirement(s) | Priority |
|----------|-------------------|----------|
| US-01 | FR-001 | Must Have |
| US-02 | FR-002 | Must Have |
| US-03 | FR-003 | Must Have |
| US-04 | FR-005 | Must Have |
| US-05 | FR-006 | Must Have |
| US-06 | FR-007 | Must Have |
| US-07 | FR-007 | Must Have |
| US-08 | FR-008 | Must Have |
| US-09 | FR-009 | Must Have |
| US-10 | FR-010 | Must Have |
| US-11 | FR-011 | Must Have |
| US-12 | FR-012 | Must Have |
| US-13 | FR-013 | Must Have (Phase 2) |
| US-14 | FR-014 | Must Have (Phase 2) |
| US-15 | FR-015 | Must Have (Phase 2) |
| US-16 | FR-016 | Must Have |
| US-17 | FR-017 | Must Have |
| US-18 | FR-018 | Must Have |
| US-19 | FR-019 | Must Have |
| US-20 | FR-020 | Must Have |
| US-21 | FR-021 | Must Have |
| US-22 | FR-022 | Must Have |
| US-23 | FR-023 | Must Have |
| US-24 | FR-024 | Should Have (Phase 2) |
| US-25 | FR-025 | Must Have |
| US-26 | FR-026 | Should Have (Phase 3) |
| US-27 | FR-027 | Should Have (Phase 3) |
| US-28 | FR-028 | Must Have |
| US-29 | FR-029 | Must Have |
| US-30 | FR-030 | Should Have (Phase 3) |

---

## 11. Appendices

### A. Glossary

| Term | Definition |
|------|------------|
| Direct Signing | Self-sign workflow where uploader signs own document |
| Sequential Signing | Multi-party signing in specific order |
| Parallel Signing | Multi-party signing in any order |
| Signature Field | Designated document area for signature |
| Audit Trail | Immutable record of document actions |
| Soft Delete | Recoverable deletion within retention period |

### B. Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-05 | [TBD] | Initial FSD creation |

### C. Open Questions/TBD

| ID | Question | Impact | Status |
|----|----------|--------|--------|
| TBD-01 | Maximum signers per document | FR-013, FR-014 | Pending |
| TBD-02 | Guest signing via magic links | FR-013, FR-014 | Pending |
| TBD-03 | Document retention policy | FR-011 | Pending |
| TBD-04 | Compliance requirements (GDPR/HIPAA/SOC2) | Security | Pending |
| TBD-05 | Signing request expiration | FR-013, FR-014 | Pending |

---

**Document Status**: Draft  
**Created**: February 5, 2026  
**Last Updated**: February 5, 2026
