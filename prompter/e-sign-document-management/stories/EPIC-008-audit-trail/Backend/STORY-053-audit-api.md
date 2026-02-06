# STORY-053: Audit Trail API

**Epic:** EPIC-008 - Audit Trail and Activity Log  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to expose audit trail data via API,  
So that clients can display activity history.

## Description
Implement audit trail API for fetching document-specific and system-wide (admin) activity logs.

## Acceptance Criteria
```gherkin
GIVEN GET /api/documents/{id}/activity
WHEN called by owner or signer
THEN audit events for that document are returned

GIVEN GET /api/admin/activity
WHEN called by admin
THEN all system events are returned with filtering

GIVEN filters for user_id, action, date_from, date_to
WHEN applied
THEN results are filtered accordingly

GIVEN non-admin user
WHEN accessing /api/admin/activity
THEN response returns 403
```

## Traceability
- **FSD Reference:** FR-025, FR-027
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-052
- **Blocks:** STORY-049, STORY-051
