# Project Context

## Purpose

This is an electronic signature and document management web application designed for small teams (5-50 users). The system streamlines document workflows by enabling secure digital signing, eliminating manual paper-based processes, and providing complete audit traceability. The application allows users to upload documents, define signing workflows (direct, sequential, or parallel), place signature fields, and collect legally binding electronic signatures.

## Tech Stack

- **Backend Framework**: Laravel 10.x with PHP 8.1+
- **Frontend Framework**: React 18.x with JSX
- **Full-Stack Bridge**: Inertia.js for SPA experience without separate API
- **Styling**: Tailwind CSS 3.x with dark mode support
- **UI Components**: shadcn/ui component library with Lucide React icons
- **Database**: PostgreSQL (configured in Laravel)
- **File Storage**: Laravel Storage (local or S3-compatible)
- **PDF Processing**: setasign/fpdf and setasign/fpdi libraries
- **Authentication**: Laravel Sanctum for API authentication
- **Build Tools**: Vite for frontend asset compilation

## Project Conventions

### Code Style

- **PHP**: Follow PSR-12 coding standards with Laravel conventions
- **JavaScript/React**: Use functional components with hooks, prefer arrow functions
- **CSS**: Utility-first approach with Tailwind CSS, avoid custom CSS when possible
- **Naming**:
  - Controllers: PascalCase (e.g., DocumentController)
  - Models: PascalCase (e.g., Document)
  - Components: PascalCase (e.g., SignatureModal)
  - Methods/Functions: camelCase
  - Variables: camelCase
  - Constants: UPPER_SNAKE_CASE
- **File Organization**: Follow Laravel conventions for backend, group React components by feature

### Architecture Patterns

- **MVC Pattern**: Laravel's Model-View-Controller architecture
- **Service Layer**: Business logic encapsulated in service classes (e.g., AuditService, SigningService)
- **Repository Pattern**: Not strictly implemented, but models handle data access
- **Component-Based UI**: React components with clear separation of concerns
- **Policy-Based Authorization**: Laravel policies for access control
- **Event-Driven**: Laravel events for audit logging and notifications

### Testing Strategy

- **Unit Tests**: PHPUnit for backend logic, focusing on models and services
- **Feature Tests**: Laravel's built-in testing for HTTP endpoints
- **Frontend Testing**: Currently not implemented, but planned for critical user flows
- **Test Coverage**: Aim for 80% coverage on business-critical code
- **Test Organization**: Separate test classes for different models/controllers

### Git Workflow

- **Branching Strategy**: GitFlow with main, develop, and feature branches
- **Commit Convention**: Conventional Commits format (feat:, fix:, docs:, etc.)
- **Code Review**: All changes require pull request review before merging
- **Release Tags**: Semantic versioning for production releases

## Domain Context

### Electronic Signature Workflows

The application supports three distinct signing workflows:

1. **Direct Signing**: User uploads and signs their own document
2. **Sequential Signing**: Document requires signatures in a specific order
3. **Parallel Signing**: All signers can sign independently in any order

### Document Lifecycle

Documents progress through these states: draft → pending → partially_signed → completed/cancelled → archived

### User Roles

- **Admin**: Full system access, can manage users and view all documents
- **Member**: Can upload documents, assign signers, and sign documents
- **Viewer**: Read-only access to assigned documents

### Audit Requirements

All document interactions must be logged with timestamps, user information, and IP addresses for compliance purposes.

## Important Constraints

### Security Requirements

- All documents must be stored outside the public web root
- File access must use signed, temporary URLs that expire
- All state-changing requests require CSRF protection
- Passwords must be hashed with bcrypt (cost factor: 12)
- Rate limiting: 60 requests/minute per user

### Performance Requirements

- Page load time < 2 seconds (excluding file downloads)
- Support up to 500 concurrent users
- Document upload processing < 5 seconds for 10 MB files
- Maximum file size: 25 MB per document

### Compliance Requirements

- Complete audit trails for all document activities
- Immutable records with no editing or deletion of logs
- IP and geolocation tracking for signature events
- Timestamp precision with timezone information

## External Dependencies

### File Storage

- Primary: Laravel's local storage (development)
- Production: S3-compatible storage (AWS S3, DigitalOcean Spaces)

### Email Services

- Laravel Mail with SMTP or SES configuration for notifications
- Email templates for signature requests, reminders, and completions

### PDF Processing

- setasign/fpdf: PDF generation and manipulation
- setasign/fpdi: Importing existing PDF documents
- pdfjs-dist: PDF rendering in the browser for signature placement

### Authentication

- Laravel's built-in authentication system
- Laravel Sanctum for API authentication
- Email verification for new user registrations
