# STORY-037: Rejection Notifications

**Epic:** EPIC-005 - Email Notifications  
**Role:** Backend  
**Story Points:** 2  
**Priority:** Must Have

---

## User Story
As the system,  
I want to notify all parties when a document is rejected,  
So that they know the workflow was cancelled.

## Description
Implement rejection notification emails that trigger on document rejection with reason included.

## Acceptance Criteria
```gherkin
GIVEN a signer rejects a document
WHEN rejection is processed
THEN document owner receives rejection notification

GIVEN rejection email to owner
WHEN sent
THEN it includes rejector name and reason

GIVEN other signers exist
WHEN rejection occurs
THEN they receive cancellation notification
```

## Traceability
- **FSD Reference:** FR-024
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-032
- **Blocks:** None
