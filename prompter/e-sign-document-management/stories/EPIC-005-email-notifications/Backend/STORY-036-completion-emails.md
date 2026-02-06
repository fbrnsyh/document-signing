# STORY-036: Completion Notifications

**Epic:** EPIC-005 - Email Notifications  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to notify all parties when a document is fully signed,  
So that everyone knows the process is complete.

## Description
Implement completion email that triggers when all signers complete. Includes link to download signed document.

## Acceptance Criteria
```gherkin
GIVEN last signer completes
WHEN workflow becomes "completed"
THEN completion emails are queued for all parties

GIVEN completion email
WHEN sent
THEN it includes download link for signed document

GIVEN document owner
WHEN completion occurs
THEN they receive email with summary of all signers

GIVEN signer
WHEN completion occurs
THEN they receive email confirming their participation
```

## Traceability
- **FSD Reference:** FR-024
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-031
- **Blocks:** None
