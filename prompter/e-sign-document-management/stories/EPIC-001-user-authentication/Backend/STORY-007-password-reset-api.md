# STORY-007: Password Reset API

**Epic:** EPIC-001 - User Authentication System  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to handle password reset requests,  
So that users can recover access to their accounts.

## Description
Implement password reset request and confirmation APIs. Generate secure tokens, send reset emails, validate tokens, and update passwords.

## Acceptance Criteria
```gherkin
GIVEN a registered email
WHEN POST /api/auth/forgot-password is called
THEN a reset token is generated (expires in 60 min)
AND reset email is queued
AND response returns 200 (same for any email for security)

GIVEN a valid reset token
WHEN POST /api/auth/reset-password is called with new password
THEN password is updated
AND all existing sessions are invalidated
AND response returns 200

GIVEN an expired reset token
WHEN POST /api/auth/reset-password is called
THEN response returns 422 "Reset link has expired"

GIVEN an already-used reset token
WHEN POST /api/auth/reset-password is called
THEN response returns 422 "Reset link is invalid"
```

## Business Rules
- **BR-AUTH-005:** Reset tokens expire after 60 minutes
- **BR-AUTH-001:** New password must meet complexity requirements
- **BR-AUTH-009:** Reset invalidates all active sessions

## Technical Notes
- Endpoints: 
  - `POST /api/auth/forgot-password` `{ email }`
  - `POST /api/auth/reset-password` `{ token, password, password_confirmation }`
- Use signed tokens with timestamp
- One-time use tokens (mark as used after successful reset)

## Traceability
- **FSD Reference:** FR-003, BR-AUTH-005
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-005
- **Blocks:** STORY-003
- **External Dependencies:** Email service

## Definition of Done
- [ ] Both endpoints implemented
- [ ] Token generation and validation secure
- [ ] Session invalidation working
- [ ] Unit tests with 90%+ coverage
- [ ] Integration tests passing
- [ ] Code merged to main branch
