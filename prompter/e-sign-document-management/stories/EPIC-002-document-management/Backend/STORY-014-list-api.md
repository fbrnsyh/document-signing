# STORY-014: Documents List API

**Epic:** EPIC-002 - Document Upload and Management  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to return paginated document lists,  
So that users can view and manage their documents.

## Description
Implement GET /api/documents endpoint with pagination, filtering by status/folder/date, and search capability. Returns documents user owns or is signer on.

## Acceptance Criteria
```gherkin
GIVEN an authenticated user
WHEN GET /api/documents is called
THEN response returns paginated list of user's documents

GIVEN status filter parameter
WHEN GET /api/documents?status=pending is called
THEN only pending documents are returned

GIVEN folder_id parameter
WHEN GET /api/documents?folder_id=123 is called
THEN only documents in that folder are returned

GIVEN search parameter
WHEN GET /api/documents?search=contract is called
THEN documents matching "contract" in title/tags are returned
```

## Business Rules
- **BR-DOC-007:** Default sort by created_at DESC
- **BR-DOC-008:** Return owned + participated documents

## Technical Notes
- Endpoint: `GET /api/documents`
- Query params: page, per_page, status, folder_id, search, date_from, date_to
- Response includes pagination meta
- Indexed search on title, tags

## Traceability
- **FSD Reference:** FR-009, FR-010
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-013
- **Blocks:** STORY-010
- **External Dependencies:** None

## Definition of Done
- [ ] Endpoint returns paginated results
- [ ] All filters working
- [ ] Search functional
- [ ] Performance optimized (<200ms)
- [ ] Code merged to main branch
