# STORY-015: Document Update API

**Epic:** EPIC-002 - Document Upload and Management  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As the system,  
I want to update document metadata,  
So that owners can manage their document information.

## Description
Implement PATCH /api/documents/{id} endpoint for updating title, tags, and folder assignment. Only document owner can update.

## Acceptance Criteria
```gherkin
GIVEN document owner
WHEN PATCH /api/documents/{id} is called with new title
THEN title is updated and response returns updated document

GIVEN document owner with fewer than 10 tags
WHEN tags are added via PATCH
THEN tags are saved successfully

GIVEN document owner with 10 tags
WHEN adding 11th tag
THEN response returns 422 "Maximum 10 tags"

GIVEN non-owner user
WHEN PATCH /api/documents/{id} is called
THEN response returns 403 "Forbidden"
```

## Business Rules
- **BR-DOC-004:** Only owner can update
- **BR-DOC-005:** Title max 200 chars
- **BR-DOC-006:** Max 10 tags

## Technical Notes
- Endpoint: `PATCH /api/documents/{id}`
- Request body: `{ title?, tags?, folder_id? }`
- Authorization middleware check

## Traceability
- **FSD Reference:** FR-008
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-013
- **Blocks:** STORY-012
- **External Dependencies:** None

## Definition of Done
- [ ] Update endpoint functional
- [ ] Authorization enforced
- [ ] Validation working
- [ ] Unit tests passing
- [ ] Code merged to main branch
