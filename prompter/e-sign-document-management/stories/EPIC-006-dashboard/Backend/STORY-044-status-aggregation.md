# STORY-044: Document Status Aggregation

**Epic:** EPIC-006 - Dashboard and Document Status  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to compute document status accurately,  
So that dashboard sections are correct.

## Description
Implement status computation logic that determines document category based on workflow state and user role.

## Acceptance Criteria
```gherkin
GIVEN user is a pending signer
WHEN status computed
THEN document appears in "Waiting for Signature"

GIVEN user is owner with pending signers
WHEN status computed
THEN document appears in "Waiting on Others"

GIVEN workflow is draft
WHEN status computed
THEN document appears in "Drafts"

GIVEN workflow completed in last 30 days
WHEN status computed
THEN document appears in "Recently Completed"
```

## Technical Notes
- Computed status based on role and workflow state
- Index on workflow.status, signer.status
- Cache invalidation on status change

## Traceability
- **FSD Reference:** FR-020, FR-021, FR-022, FR-023
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-022
- **Blocks:** STORY-043
