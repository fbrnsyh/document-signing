# STORY-013: Document Upload API

**Epic:** EPIC-002 - Document Upload and Management  
**Role:** Backend  
**Story Points:** 8  
**Priority:** Must Have

---

## User Story
As the system,  
I want to receive and process document uploads,  
So that users can add documents to the platform.

## Description
Implement POST /api/documents/upload endpoint that accepts files, validates type/size, converts non-PDFs to PDF, stores in S3, creates database record, and returns document metadata.

## Acceptance Criteria
```gherkin
GIVEN a valid PDF file under 25MB
WHEN POST /api/documents/upload is called
THEN file is stored in S3
AND database record is created
AND response returns document ID and metadata

GIVEN a valid DOCX file
WHEN POST /api/documents/upload is called
THEN file is converted to PDF
AND PDF is stored in S3

GIVEN a file larger than 25MB
WHEN POST /api/documents/upload is called
THEN response returns 422 "File too large"

GIVEN an unsupported file type
WHEN POST /api/documents/upload is called
THEN response returns 422 "Unsupported format"
```

## Business Rules
- **BR-DOC-001:** Max file size 25MB
- **BR-DOC-002:** Allowed: PDF, DOCX, PNG, JPG
- **BR-DOC-011:** Non-PDF files converted to PDF

## Technical Notes
- Endpoint: `POST /api/documents/upload`
- Multipart form data with file and optional metadata
- Use LIBREOFFICE or similar for DOCX conversion
- Generate signed URLs for S3 access
- Queue conversion for large files

## Traceability
- **FSD Reference:** FR-007
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** S3 configuration
- **Blocks:** STORY-009
- **External Dependencies:** S3, PDF conversion service

## Definition of Done
- [ ] Upload endpoint functional
- [ ] PDF conversion working
- [ ] S3 integration tested
- [ ] Unit tests with 90%+ coverage
- [ ] Integration tests passing
- [ ] Code merged to main branch
