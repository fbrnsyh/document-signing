# STORY-028: Upload Signature

**Epic:** EPIC-004 - Signature Application  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a signer,  
I want to upload an image of my signature,  
So that I can use my existing signature.

## Description
Implement signature upload tab with file picker, preview, and validation for PNG/JPG under 500KB.

## Acceptance Criteria
```gherkin
GIVEN I select the "Upload" tab
WHEN I click "Choose File"
THEN I can select an image file

GIVEN I select a valid image
WHEN uploaded
THEN I see a preview of my signature

GIVEN I upload a file over 500KB
WHEN validated
THEN I see "File too large (max 500KB)"

GIVEN I upload a non-image file
WHEN validated
THEN I see "Please upload PNG or JPG"
```

## Technical Notes
- Accept PNG, JPG only
- Max 500KB file size
- Scale to fit signature field
- Transparent background preferred

## Traceability
- **FSD Reference:** FR-017
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-026
- **Blocks:** None
