# STORY-008: Email Verification API

**Epic:** EPIC-001 - User Authentication System  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to verify user email addresses,  
So that only users with valid emails can access the platform.

## Description
Implement email verification endpoint that validates token, activates user account, and allows login.

## Acceptance Criteria
```gherkin
GIVEN a valid verification token
WHEN GET /api/auth/verify-email/{token} is called
THEN user status is updated to "active"
AND response redirects to login with success message

GIVEN an expired verification token
WHEN GET /api/auth/verify-email/{token} is called
THEN response returns error page with "Link expired"
AND option to resend verification email

GIVEN a user with pending status
WHEN POST /api/auth/resend-verification is called
THEN new verification email is sent
AND old token is invalidated
```

## Business Rules
- **BR-AUTH-007:** Accounts are "pending" until verified
- **BR-AUTH-010:** Verification links expire after 24 hours

## Technical Notes
- Endpoint: `GET /api/auth/verify-email/{token}`
- Endpoint: `POST /api/auth/resend-verification` `{ email }`
- Signed URL with expiration
- Rate limit resend to prevent abuse

## Traceability
- **FSD Reference:** FR-001
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-005
- **Blocks:** STORY-006
- **External Dependencies:** Email service

## Definition of Done
- [ ] Endpoints implemented
- [ ] Token validation secure
- [ ] Rate limiting on resend
- [ ] Unit tests passing
- [ ] Code merged to main branch
