# STORY-049: Document Activity Timeline

**Epic:** EPIC-008 - Audit Trail and Activity Log  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As a document owner or signer,  
I want to see the activity timeline for a document,  
So that I can track what has happened.

## Description
Implement chronological activity timeline on document detail page showing all events with timestamps and actors.

## Acceptance Criteria
```gherkin
GIVEN I view a document detail page
WHEN I click "Activity" tab
THEN I see chronological list of all events

GIVEN an event in the timeline
WHEN displayed
THEN it shows: action, user, timestamp, and details

GIVEN events span multiple days
WHEN displayed
THEN events are grouped by date

GIVEN events include signature
WHEN displayed
THEN IP address and location (if available) are shown
```

## Traceability
- **FSD Reference:** FR-025
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-052, STORY-053
- **Blocks:** None
