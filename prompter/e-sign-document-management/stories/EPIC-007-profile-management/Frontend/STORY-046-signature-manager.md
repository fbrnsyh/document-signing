# STORY-046: Signature Manager UI

**Epic:** EPIC-007 - User Profile and Signature Management  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a user,  
I want to manage my saved signature,  
So that I can quickly apply it when signing documents.

## Description
Implement signature manager section in profile showing current saved signature with options to create new or delete.

## Acceptance Criteria
```gherkin
GIVEN I have a saved signature
WHEN I view the signature section
THEN I see my signature preview

GIVEN I click "Create New Signature"
WHEN the modal opens
THEN I see draw/type/upload tabs (same as signing)

GIVEN I create a new signature
WHEN saved
THEN it replaces my previous default

GIVEN I click "Delete Signature"
WHEN confirmed
THEN my saved signature is removed
```

## Traceability
- **FSD Reference:** FR-006
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** STORY-045, STORY-048
- **Blocks:** None
