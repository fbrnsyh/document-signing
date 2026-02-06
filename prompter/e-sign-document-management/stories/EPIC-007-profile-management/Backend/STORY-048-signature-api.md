# STORY-048: Signature Storage API

**Epic:** EPIC-007 - User Profile and Signature Management  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to store and retrieve user signatures,  
So that saved signatures are available for signing.

## Description
Implement signature storage API for saving, retrieving, and deleting user's default signature.

## Acceptance Criteria
```gherkin
GIVEN POST /api/profile/signature with signature data
WHEN processed
THEN signature is stored and linked to user

GIVEN GET /api/profile/signature
WHEN user has saved signature
THEN signature image is returned

GIVEN DELETE /api/profile/signature
WHEN processed
THEN saved signature is removed

GIVEN user with no saved signature
WHEN GET is called
THEN response returns 404
```

## Technical Notes
- Store signature image in S3
- Link via user_signatures table
- Max one signature per user (replace on save)

## Traceability
- **FSD Reference:** FR-006
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** S3 storage
- **Blocks:** STORY-046
