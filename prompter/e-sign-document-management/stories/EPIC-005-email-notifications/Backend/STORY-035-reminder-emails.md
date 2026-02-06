# STORY-035: Reminder Email System

**Epic:** EPIC-005 - Email Notifications  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As the system,  
I want to send reminder emails to pending signers,  
So that documents are signed in a timely manner.

## Description
Implement automated reminder system that sends emails after configurable intervals (3 days, 7 days). Document owner can trigger manual reminders.

## Acceptance Criteria
```gherkin
GIVEN a pending signer for 3+ days
WHEN the scheduled job runs
THEN a reminder email is sent

GIVEN document owner
WHEN POST /api/workflows/{id}/remind is called
THEN reminder is sent to pending signers immediately

GIVEN 3 reminders already sent
WHEN next reminder is due
THEN no automatic reminder is sent (max reached)

GIVEN a completed signer
WHEN reminder job runs
THEN they are not reminded
```

## Business Rules
- **BR-EMAIL-001:** Max 3 automatic reminders
- **BR-EMAIL-002:** Min 3 days between auto reminders

## Traceability
- **FSD Reference:** FR-024
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-034
- **Blocks:** None
