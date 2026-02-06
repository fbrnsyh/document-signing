# STORY-043: Dashboard Data API

**Epic:** EPIC-006 - Dashboard and Document Status  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to provide dashboard data efficiently,  
So that the dashboard loads quickly.

## Description
Implement dedicated dashboard API endpoint that returns all four sections in a single optimized response.

## Acceptance Criteria
```gherkin
GIVEN authenticated user
WHEN GET /api/dashboard is called
THEN response includes all four sections with counts

GIVEN response structure
WHEN returned
THEN sections are: pending_signature, waiting_on_others, recently_completed, drafts

GIVEN large data set
WHEN dashboard is requested
THEN response time is under 500ms

GIVEN each section
WHEN populated
THEN max 10 documents returned with pagination links
```

## Technical Notes
- Single endpoint for all sections
- Optimized queries with eager loading
- Cache counts for fast load
- Include summary stats

## Traceability
- **FSD Reference:** FR-020, FR-021, FR-022, FR-023
- **Epic:** EPIC-006

## Dependencies
- **Depends On:** STORY-014
- **Blocks:** STORY-039, STORY-040, STORY-041, STORY-042
