# STORY-025: Workflow Initiation API

**Epic:** EPIC-003 - Signing Workflow Configuration  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to initiate a signing workflow,  
So that signers are notified and can begin signing.

## Description
Implement workflow initiation that validates completeness, changes status, generates signing tokens, and triggers email notifications.

## Acceptance Criteria
```gherkin
GIVEN a complete workflow in draft
WHEN POST /api/workflows/{id}/initiate
THEN status changes to "pending" and emails are queued

GIVEN signers without assigned fields
WHEN initiate is called
THEN response returns 422 "All signers must have fields"

GIVEN no signers defined
WHEN initiate is called (non-direct)
THEN response returns 422 "At least one signer required"

GIVEN workflow initiated
WHEN completed
THEN signing tokens are generated for each signer
```

## Business Rules
- **BR-WF-007:** All signers must have at least one field
- **BR-WF-008:** Cannot initiate incomplete workflow

## Traceability
- **FSD Reference:** FR-012, FR-013, FR-014
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-022, STORY-023, STORY-024
- **Blocks:** STORY-021, STORY-034
