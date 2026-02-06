# STORY-034: Signing Invitation Emails

**Epic:** EPIC-005 - Email Notifications  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to send signing invitation emails,  
So that signers are notified and can access documents.

## Description
Implement email sending for signing invitations with secure, signed URLs. Triggered when workflow is initiated. Uses email queue for reliability.

## Acceptance Criteria
```gherkin
GIVEN a workflow is initiated
WHEN signers are defined
THEN invitation emails are queued for all eligible signers

GIVEN a sequential workflow
WHEN initiated
THEN only the first signer receives invitation

GIVEN a parallel workflow
WHEN initiated
THEN all signers receive invitations simultaneously

GIVEN an invitation email
WHEN received by signer
THEN it contains document name, sender, and secure signing link

GIVEN a signing link
WHEN accessed
THEN it is signed and expires in 30 days
```

## Business Rules
- **BR-WF-011:** Sequential sends to first signer only
- **BR-WF-012:** Signing links expire after 30 days

## Technical Notes
- Use Laravel queue for email jobs
- Signed URLs with expiration
- Include document metadata in email
- Track delivery status

## Traceability
- **FSD Reference:** FR-024
- **Epic:** EPIC-005

## Dependencies
- **Depends On:** STORY-025 (Workflow initiation)
- **Blocks:** None
