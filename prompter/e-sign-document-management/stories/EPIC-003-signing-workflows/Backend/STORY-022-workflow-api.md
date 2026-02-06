# STORY-022: Workflow Creation API

**Epic:** EPIC-003 - Signing Workflow Configuration  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to create and manage signing workflows,  
So that documents can be configured for signing.

## Description
Implement workflow CRUD API for creating workflow records, setting mode, and managing workflow state.

## Acceptance Criteria
```gherkin
GIVEN a document ID and workflow mode
WHEN POST /api/workflows is called
THEN a workflow is created with status "draft"

GIVEN an existing workflow
WHEN PATCH /api/workflows/{id} with mode change
THEN workflow mode is updated

GIVEN a workflow in draft status
WHEN DELETE /api/workflows/{id} is called
THEN workflow is deleted

GIVEN a workflow in progress
WHEN DELETE is attempted
THEN response returns 422 "Cannot delete active workflow"
```

## Technical Notes
- Endpoint: POST, GET, PATCH, DELETE /api/workflows
- Workflow statuses: draft, pending, partial, completed, cancelled
- Foreign key to document

## Traceability
- **FSD Reference:** FR-012, FR-013, FR-014
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-013
- **Blocks:** STORY-018, STORY-023, STORY-024
