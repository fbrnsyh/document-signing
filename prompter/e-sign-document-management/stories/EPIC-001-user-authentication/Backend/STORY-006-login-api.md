# STORY-006: Login API

**Epic:** EPIC-001 - User Authentication System  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to authenticate users securely,  
So that only verified users can access protected resources.

## Description
Implement POST /api/auth/login endpoint that validates credentials, checks account status, handles lockout, creates session/token, and logs authentication event.

## Acceptance Criteria
```gherkin
GIVEN valid credentials for a verified user
WHEN POST /api/auth/login is called
THEN response returns 200 with auth token
AND session is created
AND login event is logged to audit trail

GIVEN invalid credentials
WHEN POST /api/auth/login is called
THEN response returns 401 "Invalid credentials"
AND failed attempt counter is incremented

GIVEN 5 failed attempts on an account
WHEN POST /api/auth/login is called again
THEN response returns 429 "Account locked"
AND lockout expires after 15 minutes

GIVEN credentials for unverified account
WHEN POST /api/auth/login is called
THEN response returns 403 "Please verify your email first"

GIVEN remember_me is true
WHEN POST /api/auth/login is called with valid credentials
THEN token expiration is set to 30 days
```

## Business Rules
- **BR-AUTH-003:** Lock after 5 failed attempts for 15 minutes
- **BR-AUTH-004:** Session 24h default, 30 days with remember me
- **BR-AUTH-008:** Only verified accounts can log in

## Technical Notes
- Endpoint: `POST /api/auth/login`
- Request: `{ email, password, remember_me }`
- Response: `{ token, user, expires_at }`
- Track failed attempts in Redis/cache
- Log IP address and user agent

## Traceability
- **FSD Reference:** FR-002, BR-AUTH-003, BR-AUTH-004
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-005, STORY-008 (Email verification)
- **Blocks:** STORY-002
- **External Dependencies:** None

## Definition of Done
- [ ] API endpoint implemented
- [ ] Rate limiting implemented
- [ ] Audit logging implemented
- [ ] Unit tests with 90%+ coverage
- [ ] Integration tests passing
- [ ] Code merged to main branch
