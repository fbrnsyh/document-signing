# STORY-030: Reject Document Modal

**Epic:** EPIC-004 - Signature Application  
**Role:** Frontend  
**Story Points:** 2  
**Priority:** Must Have

---

## User Story
As a signer,  
I want to reject a document with a reason,  
So that I can decline to sign if needed.

## Description
Implement rejection modal with reason textarea and confirmation warning that rejection cancels the workflow.

## Acceptance Criteria
```gherkin
GIVEN I click "Reject Document"
WHEN the modal opens
THEN I see a warning that rejection cancels for all parties

GIVEN I type a reason under 10 characters
WHEN I try to confirm
THEN the button is disabled with "Minimum 10 characters"

GIVEN I provide a valid reason
WHEN I confirm rejection
THEN the workflow is cancelled and I see confirmation

GIVEN I click "Cancel"
WHEN in the modal
THEN I return to the signing page
```

## Business Rules
- **BR-SIGN-003:** Rejection reason min 10 characters
- **BR-SIGN-004:** Rejection cancels entire workflow

## Traceability
- **FSD Reference:** FR-019
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-026, STORY-032
- **Blocks:** None
