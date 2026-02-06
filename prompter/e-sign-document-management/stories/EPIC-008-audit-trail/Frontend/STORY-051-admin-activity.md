# STORY-051: Admin Activity Log View

**Epic:** EPIC-008 - Audit Trail and Activity Log  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As an admin,  
I want to view all system activity,  
So that I can monitor platform usage.

## Description
Implement admin activity log page with filters for user, action type, and date range.

## Acceptance Criteria
```gherkin
GIVEN I am an admin
WHEN I navigate to Activity Log
THEN I see all system events across all users

GIVEN I filter by user
WHEN applied
THEN only that user's events are shown

GIVEN I filter by date range
WHEN applied
THEN only events in that range are shown

GIVEN I filter by action type
WHEN applied
THEN only those action types are shown
```

## Traceability
- **FSD Reference:** FR-027
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-053
- **Blocks:** None
