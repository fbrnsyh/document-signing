# STORY-057: Role Assignment UI

**Epic:** EPIC-009 - Admin User Management  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an admin,  
I want to change user roles,  
So that I can manage access levels.

## Description
Implement role change dropdown/modal from user table with confirmation for admin role changes.

## Acceptance Criteria
```gherkin
GIVEN I click on a user's role
WHEN the dropdown opens
THEN I see: Admin, Member, Viewer options

GIVEN I select a new role
WHEN confirmed
THEN the role is updated immediately

GIVEN I demote an admin
WHEN confirming
THEN I see warning about permission changes

GIVEN I am the last admin
WHEN trying to demote myself
THEN I see "Cannot remove last admin"
```

## Business Rules
- **BR-ADMIN-001:** Cannot remove last admin
- **BR-ADMIN-002:** Role changes take effect immediately

## Traceability
- **FSD Reference:** FR-028
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-055, STORY-060
- **Blocks:** None
