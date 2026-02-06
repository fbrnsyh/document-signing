# STORY-055: User Management Table

**Epic:** EPIC-009 - Admin User Management  
**Role:** Frontend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As an administrator,  
I want to view and manage all users in a table,  
So that I can maintain team access control.

## Description
Implement admin user management table with name, email, role, status columns. Includes search, filter by role, and action menus for each user.

## Acceptance Criteria
```gherkin
GIVEN I am an admin
WHEN I navigate to user management
THEN I see a table of all users

GIVEN the user table
WHEN I search for a name or email
THEN results are filtered in real-time

GIVEN I click the action menu
WHEN viewing a user row
THEN I see options: View Profile, Change Role, Deactivate

GIVEN I change a user's role
WHEN the change is saved
THEN the table updates immediately

GIVEN I am the last admin
WHEN I try to demote myself
THEN I see an error "Cannot remove last admin"
```

## Technical Notes
- Data table with sorting
- Action dropdown menu
- Role change confirmation
- Pagination for large teams

## Traceability
- **FSD Reference:** FR-028
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-058 (User list API)
- **Blocks:** STORY-056, STORY-057
