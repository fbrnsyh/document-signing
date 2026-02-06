# STORY-023: Signer Management API

**Epic:** EPIC-003 - Signing Workflow Configuration  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to manage signers for a workflow,  
So that the correct people are assigned to sign.

## Description
Implement API for adding, updating, removing, and reordering signers on a workflow.

## Acceptance Criteria
```gherkin
GIVEN a workflow ID
WHEN POST /api/workflows/{id}/signers with email and name
THEN signer is added and assigned order

GIVEN existing signers
WHEN PATCH /api/workflows/{id}/signers/reorder with new order
THEN signer order is updated

GIVEN a signer
WHEN DELETE /api/workflows/{id}/signers/{signer_id}
THEN signer is removed

GIVEN 10 signers exist
WHEN adding 11th signer
THEN response returns 422 "Maximum 10 signers"
```

## Business Rules
- **BR-WF-003:** Min 1 signer for non-direct
- **BR-WF-004:** Max 10 signers

## Traceability
- **FSD Reference:** FR-013, FR-014
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-022
- **Blocks:** STORY-019
