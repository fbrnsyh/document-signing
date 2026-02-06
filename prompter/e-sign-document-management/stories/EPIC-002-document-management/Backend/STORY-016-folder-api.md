# STORY-016: Folder Management API

**Epic:** EPIC-002 - Document Upload and Management  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Should Have

---

## User Story
As the system,  
I want to manage document folders,  
So that users can organize their documents.

## Description
Implement CRUD endpoints for folders: create, list, update, delete. Folders are user-specific and support nesting one level.

## Acceptance Criteria
```gherkin
GIVEN an authenticated user
WHEN POST /api/folders is called with name
THEN folder is created and response returns folder

GIVEN existing folders
WHEN GET /api/folders is called
THEN response returns tree of user's folders

GIVEN folder owner
WHEN PATCH /api/folders/{id} with new name
THEN folder is renamed

GIVEN empty folder
WHEN DELETE /api/folders/{id} is called
THEN folder is deleted

GIVEN folder with documents
WHEN DELETE /api/folders/{id} is called
THEN response returns 422 "Folder not empty"
```

## Business Rules
- **BR-DOC-012:** Folders are per-user
- **BR-DOC-013:** One level nesting allowed
- **BR-DOC-014:** Cannot delete non-empty folders

## Technical Notes
- Endpoints: POST, GET, PATCH, DELETE /api/folders
- Parent folder ID for nesting
- Index on user_id for performance

## Traceability
- **FSD Reference:** FR-009
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** None
- **Blocks:** STORY-010
- **External Dependencies:** None

## Definition of Done
- [ ] All CRUD endpoints functional
- [ ] Nesting working
- [ ] Delete validation working
- [ ] Tests passing
- [ ] Code merged to main branch
