# STORY-033: Signing Token Validation

**Epic:** EPIC-004 - Signature Application  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to validate signing tokens,  
So that only authorized signers can access documents.

## Description
Implement token validation middleware for signing endpoints. Checks token validity, expiration, and signer eligibility.

## Acceptance Criteria
```gherkin
GIVEN a valid unexpired token
WHEN used to access signing page
THEN access is granted and signer data returned

GIVEN an expired token
WHEN used
THEN response returns 401 "Signing link has expired"

GIVEN a token for cancelled workflow
WHEN used
THEN response returns 410 "This signing request was cancelled"

GIVEN a token for completed signer
WHEN used
THEN response returns 409 "You have already signed"
```

## Technical Notes
- Signed tokens with HMAC
- Token encodes: workflow_id, signer_id, expires_at
- Middleware for /api/sign/* routes

## Traceability
- **FSD Reference:** FR-016
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-025
- **Blocks:** STORY-026, STORY-031, STORY-032
