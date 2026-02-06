# STORY-021: Workflow Review and Send

**Epic:** EPIC-003 - Signing Workflow Configuration  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a document owner,  
I want to review my workflow before sending,  
So that I can confirm everything is correct.

## Description
Implement final review step showing document preview, signers, fields summary. Includes save as draft and send options.

## Acceptance Criteria
```gherkin
GIVEN I am on the review step
WHEN the page loads
THEN I see document thumbnail, signers list, and field count

GIVEN I click "Save as Draft"
WHEN the action completes
THEN I return to dashboard with document in drafts

GIVEN I click "Send for Signature"
WHEN confirmed
THEN workflow is initiated and emails are sent

GIVEN there are validation errors
WHEN I try to send
THEN I see what needs to be fixed
```

## Traceability
- **FSD Reference:** FR-012, FR-013, FR-014
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-018, STORY-019, STORY-020, STORY-025
- **Blocks:** None
