# STORY-005: Registration API

**Epic:** EPIC-001 - User Authentication System  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to register new users securely,  
So that they can create accounts and access the platform.

## Description
Implement POST /api/auth/register endpoint that validates input, checks email uniqueness, hashes password, creates user record, and sends verification email.

## Acceptance Criteria
```gherkin
GIVEN a valid registration request
WHEN POST /api/auth/register is called
THEN a new user record is created with status "pending"
AND password is hashed with bcrypt
AND verification email is queued
AND response returns 201 with user ID

GIVEN a registration with existing email
WHEN POST /api/auth/register is called
THEN response returns 422 with error "Email already registered"

GIVEN a registration with weak password
WHEN POST /api/auth/register is called
THEN response returns 422 with password validation errors

GIVEN a registration with invalid email format
WHEN POST /api/auth/register is called
THEN response returns 422 with "Invalid email format"
```

## Business Rules
- **BR-AUTH-001:** Password min 8 chars, 1 uppercase, 1 number
- **BR-AUTH-002:** Email must be unique
- **BR-AUTH-007:** Account status is "pending" until email verified

## Technical Notes
- Endpoint: `POST /api/auth/register`
- Request: `{ name, email, password, password_confirmation }`
- Response: `{ id, email, status }`
- Use Laravel's Hash::make for password
- Queue verification email job

## Traceability
- **FSD Reference:** FR-001, BR-AUTH-001 to BR-AUTH-007
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** Database migrations
- **Blocks:** STORY-001
- **External Dependencies:** Email service

## Definition of Done
- [ ] API endpoint implemented
- [ ] Request validation complete
- [ ] Unit tests with 90%+ coverage
- [ ] Integration tests passing
- [ ] API documentation updated
- [ ] Code merged to main branch
