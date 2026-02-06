# STORY-059: User Invitation API

**Epic:** EPIC-009 - Admin User Management  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to send and manage user invitations,  
So that new users can be onboarded.

## Description
Implement invitation API for sending invites and handling invitation acceptance during registration.

## Acceptance Criteria
```gherkin
GIVEN admin user
WHEN POST /api/admin/invitations with email and role
THEN invitation is created and email sent

GIVEN invitation email
WHEN user clicks link
THEN they are directed to registration with token

GIVEN registration with valid token
WHEN completed
THEN user is created with pre-assigned role

GIVEN already registered email
WHEN invitation attempted
THEN response returns 422 "User already exists"
```

## Technical Notes
- Store invitations with token, email, role, expires_at
- Token expires after 7 days
- Delete invitation on successful registration

## Traceability
- **FSD Reference:** FR-030
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-005, STORY-034
- **Blocks:** STORY-056
