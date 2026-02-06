# STORY-052: Audit Event Logging

**Epic:** EPIC-008 - Audit Trail and Activity Log  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to log all document-related events,  
So that a complete audit trail is maintained.

## Description
Implement audit event logging service that captures all document actions. Records event type, timestamp, user, IP address, and user agent. Events are immutable.

## Acceptance Criteria
```gherkin
GIVEN any document action occurs
WHEN the action is processed
THEN an audit event is created

GIVEN an audit event
WHEN created
THEN it includes: event_type, timestamp, user_id, document_id, IP, user_agent

GIVEN audit events exist
WHEN queried
THEN they cannot be modified or deleted

GIVEN a document upload
WHEN completed
THEN "document_uploaded" event is logged
```

## Business Rules
- **BR-AUDIT-001:** All document actions must be logged
- **BR-AUDIT-002:** Audit records are immutable
- **BR-AUDIT-003:** Retain for minimum 7 years

## Technical Notes
- Separate audit_events table
- No update/delete on table
- Async logging via queue
- Index on document_id, user_id, created_at

## Traceability
- **FSD Reference:** FR-025, FR-027
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** None (cross-cutting)
- **Blocks:** STORY-049, STORY-053
