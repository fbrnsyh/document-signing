# STORY-056: User Invitation Modal

**Epic:** EPIC-009 - Admin User Management  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As an admin,  
I want to invite new users by email,  
So that they can join the team.

## Description
Implement user invitation modal with email input, role selection, and send functionality.

## Acceptance Criteria
```gherkin
GIVEN I click "Invite User"
WHEN the modal opens
THEN I see email input and role dropdown

GIVEN I enter a valid email and select a role
WHEN I click "Send Invitation"
THEN invitation is sent and I see success message

GIVEN I enter an already registered email
WHEN submitting
THEN I see "User already exists"

GIVEN invitation is sent
WHEN the user clicks the link
THEN they are directed to registration with role pre-assigned
```

## Traceability
- **FSD Reference:** FR-030
- **Epic:** EPIC-009

## Dependencies
- **Depends On:** STORY-055, STORY-059
- **Blocks:** None
