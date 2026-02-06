# STORY-041: Waiting on Others Section

**Epic:** EPIC-006 - Dashboard and Document Status  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a document owner,  
I want to see documents waiting for others to sign,  
So that I can track progress and send reminders.

## Description
Implement "Waiting on Others" dashboard section showing owner's documents with pending signers and progress indicator.

## Acceptance Criteria
```gherkin
GIVEN I own documents with pending signers
WHEN I view this section
THEN I see cards with document name and progress (2/3 signed)

GIVEN a document card
WHEN I view it
THEN I see who has signed and who is pending

GIVEN I click "Send Reminder"
WHEN processed
THEN reminder is sent to pending signers

GIVEN all my documents are complete
WHEN the section loads
THEN I see "All documents have been signed"
```

## Traceability
- **FSD Reference:** FR-021
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-039, STORY-043
- **Blocks:** None
