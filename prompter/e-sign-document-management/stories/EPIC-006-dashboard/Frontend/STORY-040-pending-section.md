# STORY-040: Pending Signature Section

**Epic:** EPIC-006 - Dashboard and Document Status  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a signed,  
I want to see documents waiting for my signature,  
So that I can quickly take action.

## Description
Implement "Waiting for Signature" dashboard section showing documents where user is a pending signer.

## Acceptance Criteria
```gherkin
GIVEN I have documents to sign
WHEN I view this section
THEN I see cards with document name, sender, and date received

GIVEN I click on a document card
WHEN the action is processed
THEN I am navigated to the signing page

GIVEN I click "Sign Now"
WHEN the button is pressed
THEN I am navigated directly to signing

GIVEN no pending signatures
WHEN the section loads
THEN I see "No documents waiting for your signature"
```

## Traceability
- **FSD Reference:** FR-020
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-039, STORY-043
- **Blocks:** None
