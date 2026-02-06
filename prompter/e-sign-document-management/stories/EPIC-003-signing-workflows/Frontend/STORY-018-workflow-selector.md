# STORY-018: Workflow Mode Selector

**Epic:** EPIC-003 - Signing Workflow Configuration  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a document owner,  
I want to select a signing mode (Direct, Sequential, or Parallel),  
So that I can configure how signers will sign my document.

## Description
Implement workflow mode selection UI with clear descriptions of each mode. Radio button selection with visual icons and explanations.

## Acceptance Criteria
```gherkin
GIVEN I am on the workflow setup page
WHEN the page loads
THEN I see three options: Direct, Sequential, Parallel

GIVEN I select "Direct (Self-Sign)"
WHEN I proceed
THEN I skip signer management and go to field placement

GIVEN I select "Sequential"
WHEN I proceed
THEN I see signer order management

GIVEN I select "Parallel"
WHEN I proceed
THEN I see signer list without ordering
```

## Business Rules
- **BR-WF-001:** Only three workflow modes supported
- **BR-WF-002:** Direct mode is for owner self-signing only

## Traceability
- **FSD Reference:** FR-012, FR-013, FR-014
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-009 (Document uploaded)
- **Blocks:** STORY-019, STORY-020
