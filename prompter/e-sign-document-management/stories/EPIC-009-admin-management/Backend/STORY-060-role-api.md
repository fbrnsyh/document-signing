# STORY-060: Role Management API

**Epic:** EPIC-009 - Admin User Management  
**Role:** Backend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As the system,  
I want to manage user roles,  
So that admins can control access levels.

## Description
Implement role update and user deactivation APIs with validation for last admin protection.

## Acceptance Criteria
```gherkin
GIVEN admin user
WHEN PATCH /api/admin/users/{id}/role with new role
THEN user role is updated

GIVEN attempt to demote last admin
WHEN processed
THEN response returns 422 "Cannot remove last admin"

GIVEN PATCH /api/admin/users/{id}/deactivate
WHEN processed
THEN user status becomes "inactive"

GIVEN deactivated user
WHEN they attempt to login
THEN response returns 403 "Account deactivated"
```

## Business Rules
- **BR-ADMIN-001:** Cannot remove last admin
- **BR-ADMIN-003:** Deactivation preserves data

## Traceability
- **FSD Reference:** FR-028
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-058
- **Blocks:** STORY-057
