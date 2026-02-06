# STORY-019: Signer Management UI

**Epic:** EPIC-003 - Signing Workflow Configuration  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a document owner,  
I want to add and manage signers for my document,  
So that the right people can sign in the correct order.

## Description
Implement signer management interface for adding signers by email, setting display names, and ordering (for sequential). Supports adding, removing, and reordering signers.

## Acceptance Criteria
```gherkin
GIVEN I am on the signer management step
WHEN I add a signer with email and name
THEN the signer appears in the list

GIVEN I have multiple signers in sequential mode
WHEN I drag to reorder
THEN the signing order updates

GIVEN I click remove on a signer
WHEN confirmed
THEN the signer is removed from the list

GIVEN I enter an invalid email
WHEN I try to add
THEN I see "Invalid email format"

GIVEN I try to add myself as a signer
WHEN in non-direct mode
THEN I am added as a signer (allowed)
```

## Business Rules
- **BR-WF-003:** Min 1 signer required (except direct mode)
- **BR-WF-004:** Max 10 signers per document

## Traceability
- **FSD Reference:** FR-013, FR-014
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-018, STORY-023
- **Blocks:** STORY-020
