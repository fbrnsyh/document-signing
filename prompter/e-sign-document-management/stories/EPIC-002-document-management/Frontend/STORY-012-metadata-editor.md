# STORY-012: Document Metadata Editor

**Epic:** EPIC-002 - Document Upload and Management  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As a document owner,  
I want to edit document title and tags,  
So that I can organize and find documents easily.

## Description
Implement metadata editing panel accessible from document detail. Allows editing title and managing tags (add/remove up to 10).

## Acceptance Criteria
```gherkin
GIVEN I am viewing a document I own
WHEN I click "Edit" on the metadata section
THEN the title and tags become editable

GIVEN I am editing document metadata
WHEN I change the title and click Save
THEN the title is updated and I see a success message

GIVEN I am adding tags
WHEN I add a tag and have fewer than 10
THEN the tag is added to the document

GIVEN I have 10 tags
WHEN I try to add another tag
THEN I see "Maximum 10 tags allowed"

GIVEN I am not the document owner
WHEN I view the document
THEN I do not see the Edit button
```

## Business Rules
- **BR-DOC-004:** Only owner can edit metadata
- **BR-DOC-005:** Title max 200 characters
- **BR-DOC-006:** Max 10 tags per document

## Technical Notes
- Tag input with autocomplete from existing tags
- Inline editing pattern
- Auto-save on blur or explicit save button

## Traceability
- **FSD Reference:** FR-008
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-015 (Update API)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] Title editing works
- [ ] Tag management works
- [ ] Validation enforced
- [ ] Permission check working
- [ ] Code merged to main branch
