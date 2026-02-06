# STORY-045: Profile Settings Page

**Epic:** EPIC-007 - User Profile and Signature Management  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a user,  
I want to view and edit my profile settings,  
So that I can keep my information up to date.

## Description
Implement profile settings page with sections for personal info, security, and signature management.

## Acceptance Criteria
```gherkin
GIVEN I navigate to profile settings
WHEN the page loads
THEN I see my name, email, and phone (if set)

GIVEN I edit my name
WHEN I save changes
THEN my name is updated across the application

GIVEN I try to change my email
WHEN I submit a new email
THEN verification is sent to the new email

GIVEN I click "Change Password"
WHEN the form opens
THEN I must enter current password and new password twice
```

## Traceability
- **FSD Reference:** FR-005
- **Epic:** EPIC-007

## Dependencies
- **Depends On:** STORY-047
- **Blocks:** None
