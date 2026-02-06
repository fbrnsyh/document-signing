# STORY-020: Signature Field Placement Editor

**Epic:** EPIC-003 - Signing Workflow Configuration  
**Role:** Frontend  
**Story Points:** 8  
**Priority:** Must Have

---

## User Story
As a document owner,  
I want to place signature fields on my PDF document,  
So that signers know where to sign.

## Description
Implement PDF viewer with drag-and-drop field placement. Support signature, initial, date, and text field types. Fields can be resized, moved, deleted, and assigned to specific signers.

## Acceptance Criteria
```gherkin
GIVEN I am on the field placement page
WHEN the PDF loads
THEN I see the document with a field toolbox sidebar

GIVEN I drag a signature field to the PDF
WHEN I drop it on the document
THEN a signature field appears at that position

GIVEN I have placed a field
WHEN I click on it
THEN I see a properties panel to assign it to a signer

GIVEN I have placed fields
WHEN I navigate between pages
THEN fields are preserved on each page

GIVEN I select a field
WHEN I press Delete
THEN the field is removed
```

## Business Rules
- **BR-WF-005:** Each field must be assigned to a signer
- **BR-WF-006:** Signature fields are required by default

## Technical Notes
- Use pdf.js for PDF rendering
- Drag-and-drop with react-dnd or similar
- Field positions stored as percentages for scaling
- Multi-page support

## Traceability
- **FSD Reference:** FR-015
- **Epic:** EPIC-003

## Dependencies
- **Depends On:** STORY-018, STORY-019
- **Blocks:** STORY-021
