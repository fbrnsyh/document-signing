# STORY-029: Type Signature

**Epic:** EPIC-004 - Signature Application  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a signer,  
I want to type my name as a signature,  
So that I can quickly sign with a stylized text.

## Description
Implement typed signature with name input and font selector (3 script fonts). Shows live preview.

## Acceptance Criteria
```gherkin
GIVEN I select the "Type" tab
WHEN I enter my name
THEN I see it rendered in the default font

GIVEN I have typed my name
WHEN I select a different font
THEN the preview updates with the new style

GIVEN three font options
WHEN displayed
THEN each has a distinct cursive/script style

GIVEN I click "Apply"
WHEN the signature is applied
THEN my typed name is rendered to the field
```

## Technical Notes
- Pre-load 3 signature-style fonts
- Render text to canvas for capture
- Auto-size to fit field width

## Traceability
- **FSD Reference:** FR-018
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-026
- **Blocks:** None
