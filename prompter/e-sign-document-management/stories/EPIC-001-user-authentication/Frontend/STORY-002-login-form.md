# STORY-002: Login Form

**Epic:** EPIC-001 - User Authentication System  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Must Have

---

## User Story
As a registered user,  
I want to log in with my email and password,  
So that I can access my documents and dashboard.

## Description
Implement the login form UI with email/password fields, remember me option, and links to forgot password and registration pages.

## Acceptance Criteria
```gherkin
GIVEN I am on the login page
WHEN I enter valid email and password
AND I click "Sign In"
THEN I am redirected to the dashboard

GIVEN I am on the login page
WHEN I enter invalid credentials
THEN I see an error "Invalid email or password"
AND the password field is cleared

GIVEN I check "Remember me"
WHEN I successfully log in
THEN my session persists for 30 days

GIVEN I am on the login page
WHEN I click "Forgot password?"
THEN I am navigated to the password reset page

GIVEN my account is locked
WHEN I attempt to log in
THEN I see "Account locked. Try again in X minutes"
```

## Business Rules
- **BR-AUTH-003:** Account locks after 5 failed attempts for 15 minutes
- **BR-AUTH-004:** Default session is 24 hours, 30 days with remember me

## Technical Notes
- Store auth token in secure HTTP-only cookie
- Show/hide password toggle
- Redirect to original destination after login if applicable

## Traceability
- **FSD Reference:** FR-002
- **Epic:** EPIC-001

## Dependencies
- **Depends On:** STORY-006 (Backend login API)
- **Blocks:** None
- **External Dependencies:** None

## Definition of Done
- [ ] Code implemented and peer-reviewed
- [ ] Unit tests written and passing
- [ ] Responsive on mobile devices
- [ ] Accessibility audit passed
- [ ] Acceptance criteria verified
- [ ] Code merged to main branch
