# STORY-017: Archive and Restore API

**Epic:** EPIC-002 - Document Upload and Management  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As the system,  
I want to archive and restore documents,  
So that users can manage document lifecycle.

## Description
Implement archive/restore endpoints for soft-deleting completed documents. Archived documents are hidden from default list but retrievable.

## Acceptance Criteria
```gherkin
GIVEN a completed document
WHEN POST /api/documents/{id}/archive is called
THEN document is marked archived
AND hidden from default list

GIVEN an archived document
WHEN POST /api/documents/{id}/restore is called
THEN document is restored to active list

GIVEN document list request
WHEN include_archived=true parameter is set
THEN archived documents are included

GIVEN a non-completed document
WHEN archive is attempted
THEN response returns 422 "Only completed documents can be archived"
```

## Business Rules
- **BR-DOC-015:** Only completed documents can be archived
- **BR-DOC-016:** Archived docs hidden by default

## Technical Notes
- Soft delete with archived_at timestamp
- Filter in list query
- Owner-only operation

## Traceability
- **FSD Reference:** FR-011
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-013
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] Archive endpoint functional
- [ ] Restore endpoint functional
- [ ] List filtering working
- [ ] Tests passing
- [ ] Code merged to main branch
