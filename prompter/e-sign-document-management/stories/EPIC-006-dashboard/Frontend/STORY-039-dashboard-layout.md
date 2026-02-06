# STORY-039: Dashboard Layout

**Epic:** EPIC-006 - Dashboard and Document Status  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a user,  
I want a dashboard that shows all my pending actions,  
So that I can quickly see what needs attention.

## Description
Implement the main dashboard layout with four sections: Waiting for Signature, Waiting on Others, Recently Completed, and Drafts. Includes header with greeting and new document button.

## Acceptance Criteria
```gherkin
GIVEN I am logged in
WHEN I navigate to the dashboard
THEN I see a personalized greeting with my name

GIVEN I have documents in various states
WHEN the dashboard loads
THEN I see four organized sections with counts

GIVEN I click "New Document"
WHEN the button is pressed
THEN I am navigated to the upload page

GIVEN a section has no items
WHEN the dashboard loads
THEN the section shows an empty state message
```

## Technical Notes
- Grid layout for desktop
- Stack layout for mobile
- Skeleton loading states
- Real-time badge counts

## Traceability
- **FSD Reference:** FR-020, FR-021, FR-022, FR-023
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-043 (Dashboard API)
- **Blocks:** STORY-040, STORY-041, STORY-042
