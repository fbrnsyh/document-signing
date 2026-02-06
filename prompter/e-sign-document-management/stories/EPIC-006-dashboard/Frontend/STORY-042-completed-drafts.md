# STORY-042: Completed and Drafts Sections

**Epic:** EPIC-006 - Dashboard and Document Status  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As a user,  
I want to see my recent completed documents and drafts,  
So that I can access them quickly.

## Description
Implement "Recently Completed" (last 10) and "Drafts" sections on the dashboard.

## Acceptance Criteria
```gherkin
GIVEN completed documents exist
WHEN I view "Recently Completed"
THEN I see the last 10 completed documents

GIVEN I click on a completed document
WHEN processed
THEN I navigate to document detail with download option

GIVEN drafts exist
WHEN I view "Drafts"
THEN I see in-progress workflows not yet sent

GIVEN I click "Continue" on a draft
WHEN processed
THEN I return to workflow setup where I left off
```

## Traceability
- **FSD Reference:** FR-022, FR-023
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-039, STORY-043
- **Blocks:** None
