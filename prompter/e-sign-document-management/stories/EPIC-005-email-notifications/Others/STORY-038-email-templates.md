# STORY-038: Email Templates

**Epic:** EPIC-005 - Email Notifications  
**Role:** Others  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want branded email templates,  
So that notifications are professional and consistent.

## Description
Create responsive HTML email templates for all notification types using the design system colors and typography.

## Acceptance Criteria
```gherkin
GIVEN invitation template
WHEN rendered
THEN it shows E-Sign logo, document name, sender, and CTA button

GIVEN reminder template
WHEN rendered
THEN it shows urgency indicator and days pending

GIVEN completion template
WHEN rendered
THEN it shows checkmark/success styling and download button

GIVEN any email
WHEN rendered
THEN it is responsive on mobile devices
```

## Technical Notes
- Inline CSS for email compatibility
- Test with Litmus/Email on Acid
- Dark mode support where possible
- Unsubscribe link in footer

## Traceability
- **FSD Reference:** FR-024
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** Design system
- **Blocks:** STORY-034, STORY-035, STORY-036, STORY-037
