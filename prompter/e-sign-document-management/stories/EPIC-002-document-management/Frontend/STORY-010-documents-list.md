# STORY-010: Documents List View

**Epic:** EPIC-002 - Document Upload and Management  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a user,  
I want to view all my documents in a list,  
So that I can find and manage my documents.

## Description
Implement documents list page with table/card view, status badges, folder navigation, and action buttons. Supports pagination and sorting.

## Acceptance Criteria
```gherkin
GIVEN I am on the documents page
WHEN the page loads
THEN I see a list of my documents with title, status, date, and actions

GIVEN I have documents in multiple statuses
WHEN I view the list
THEN each document shows appropriate status badge (Draft/Pending/Completed/Cancelled)

GIVEN I click on a folder in the sidebar
WHEN the folder loads
THEN I see only documents in that folder

GIVEN I click on a document row
WHEN the detail page loads
THEN I see the document detail view

GIVEN I have more than 10 documents
WHEN I scroll or paginate
THEN additional documents load
```

## Business Rules
- **BR-DOC-007:** Default sort by most recent
- **BR-DOC-008:** Show documents user owns or is signer on

## Technical Notes
- Server-side pagination (10 per page)
- Virtualization for performance
- Folder tree in sidebar
- Status badge component

## Traceability
- **FSD Reference:** FR-009, FR-010
- **Epic:** EPIC-002

## Dependencies
- **Depends On:** STORY-014 (List API)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] List view functional
- [ ] Pagination working
- [ ] Folder navigation working
- [ ] Status badges correct
- [ ] Mobile responsive (card view)
- [ ] Code merged to main branch
