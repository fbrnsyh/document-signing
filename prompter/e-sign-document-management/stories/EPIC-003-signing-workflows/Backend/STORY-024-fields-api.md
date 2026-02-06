# STORY-024: Signature Fields API

**Epic:** EPIC-003 - Signing Workflow Configuration  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to store and manage signature field placements,  
So that signers know where to sign.

## Description
Implement API for creating, updating, and deleting signature fields with position, size, type, and signer assignment.

## Acceptance Criteria
```gherkin
GIVEN a workflow ID and field data
WHEN POST /api/workflows/{id}/fields
THEN field is created with position and assigned signer

GIVEN an existing field
WHEN PATCH with new position
THEN field position is updated

GIVEN a field
WHEN DELETE is called
THEN field is removed

GIVEN field data without signer assignment
WHEN creating field
THEN response returns 422 "Field must be assigned to a signer"
```

## Technical Notes
- Store position as percentages (x, y, width, height)
- Field types: signature, initial, date, text
- Page number for multi-page docs

## Traceability
- **FSD Reference:** FR-015
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-022, STORY-023
- **Blocks:** STORY-020
