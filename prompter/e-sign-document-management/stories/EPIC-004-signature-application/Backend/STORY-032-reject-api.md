# STORY-032: Document Rejection API

**Epic:** EPIC-004 - Signature Application  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to process document rejections,  
So that workflows can be properly cancelled.

## Description
Implement rejection API that records reason, cancels workflow, notifies all parties, and logs audit event.

## Acceptance Criteria
```gherkin
GIVEN a valid signing token
WHEN POST /api/sign/{token}/reject with reason
THEN workflow status becomes "cancelled"

GIVEN rejection processed
WHEN completed
THEN all parties are notified via email

GIVEN rejection
WHEN logged
THEN audit trail includes rejection reason and rejector

GIVEN reason under 10 characters
WHEN submitted
THEN response returns 422 "Reason too short"
```

## Business Rules
- **BR-SIGN-003:** Reason min 10 characters
- **BR-SIGN-004:** Rejection cancels entire workflow

## Traceability
- **FSD Reference:** FR-019
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-033
- **Blocks:** STORY-030
