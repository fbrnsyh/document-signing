# STORY-047: Profile Update API

**Epic:** EPIC-007 - User Profile and Signature Management  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to update user profile information,  
So that users can maintain accurate records.

## Description
Implement profile update API for name, email (with verification), and password changes.

## Acceptance Criteria
```gherkin
GIVEN PATCH /api/profile with new name
WHEN processed
THEN name is updated and returned

GIVEN PATCH /api/profile with new email
WHEN processed
THEN verification email is sent to new address

GIVEN new email is verified
WHEN verified
THEN email is updated and old email notified

GIVEN PATCH /api/profile/password
WHEN current_password is correct
THEN password is updated and sessions invalidated
```

## Technical Notes
- Email change requires verification flow
- Password change invalidates other sessions
- Audit log profile changes

## Traceability
- **FSD Reference:** FR-005
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** STORY-005
- **Blocks:** STORY-045
