# STORY-058: User List API (Admin)

**Epic:** EPIC-009 - Admin User Management  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to provide user list data to admins,  
So that they can manage the team.

## Description
Implement admin-only user list API with search, role filtering, and pagination.

## Acceptance Criteria
```gherkin
GIVEN admin user
WHEN GET /api/admin/users
THEN all users are returned with pagination

GIVEN search parameter
WHEN applied
THEN results match name or email

GIVEN role filter
WHEN applied
THEN only users with that role are returned

GIVEN non-admin
WHEN accessing endpoint
THEN response returns 403
```

## Traceability
- **FSD Reference:** FR-028
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-005
- **Blocks:** STORY-055
