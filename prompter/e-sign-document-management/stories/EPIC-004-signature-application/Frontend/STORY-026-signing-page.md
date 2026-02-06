# STORY-026: Document Signing Page

**Epic:** EPIC-004 - Signature Application  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a signer,  
I want to view a document and see where I need to sign,  
So that I can complete my signatures efficiently.

## Description
Implement the signing page that displays the PDF with highlighted signature fields. Clicking a field opens the signature modal. Shows progress and completion button.

## Acceptance Criteria
```gherkin
GIVEN I access the signing page via email link
WHEN the page loads
THEN I see the PDF with my signature fields highlighted

GIVEN I have pending signature fields
WHEN I click on one
THEN the signature modal opens

GIVEN I have completed all my fields
WHEN the last field is signed
THEN the "Complete Signing" button becomes enabled

GIVEN I click "Complete Signing"
WHEN I confirm
THEN my signatures are finalized and I see a success message

GIVEN I am not authenticated
WHEN I access the signing link
THEN I am prompted to log in or register
```

## Business Rules
- **BR-SIGN-001:** All required fields must be completed
- **BR-SIGN-002:** Signing link must be valid and not expired

## Traceability
- **FSD Reference:** FR-016, FR-017, FR-018
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-033 (Token validation), STORY-024 (Fields API)
- **Blocks:** STORY-027, STORY-028, STORY-029
