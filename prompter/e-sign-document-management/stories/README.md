# E-Sign Document Management - User Stories

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Stories** | 60 |
| **Total Story Points** | 202 |
| **Frontend Stories** | 29 |
| **Backend Stories** | 30 |
| **Others** | 1 |

---

## Story Index by EPIC

### EPIC-001: User Authentication (31 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-001](EPIC-001-user-authentication/Frontend/STORY-001-registration-form.md) | Registration Form | Frontend | 5 | Must Have |
| [STORY-002](EPIC-001-user-authentication/Frontend/STORY-002-login-form.md) | Login Form | Frontend | 3 | Must Have |
| [STORY-003](EPIC-001-user-authentication/Frontend/STORY-003-password-reset-flow.md) | Password Reset Flow | Frontend | 3 | Must Have |
| [STORY-004](EPIC-001-user-authentication/Frontend/STORY-004-auth-layout.md) | Auth Layout | Frontend | 2 | Must Have |
| [STORY-005](EPIC-001-user-authentication/Backend/STORY-005-registration-api.md) | Registration API | Backend | 5 | Must Have |
| [STORY-006](EPIC-001-user-authentication/Backend/STORY-006-login-api.md) | Login API | Backend | 5 | Must Have |
| [STORY-007](EPIC-001-user-authentication/Backend/STORY-007-password-reset-api.md) | Password Reset API | Backend | 5 | Must Have |
| [STORY-008](EPIC-001-user-authentication/Backend/STORY-008-email-verification-api.md) | Email Verification API | Backend | 3 | Must Have |

---

### EPIC-002: Document Management (40 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-009](EPIC-002-document-management/Frontend/STORY-009-upload-interface.md) | Upload Interface | Frontend | 5 | Must Have |
| [STORY-010](EPIC-002-document-management/Frontend/STORY-010-documents-list.md) | Documents List | Frontend | 5 | Must Have |
| [STORY-011](EPIC-002-document-management/Frontend/STORY-011-search-filter.md) | Search and Filter | Frontend | 3 | Should Have |
| [STORY-012](EPIC-002-document-management/Frontend/STORY-012-metadata-editor.md) | Metadata Editor | Frontend | 3 | Should Have |
| [STORY-013](EPIC-002-document-management/Backend/STORY-013-upload-api.md) | Upload API | Backend | 8 | Must Have |
| [STORY-014](EPIC-002-document-management/Backend/STORY-014-list-api.md) | List API | Backend | 5 | Must Have |
| [STORY-015](EPIC-002-document-management/Backend/STORY-015-update-api.md) | Update API | Backend | 3 | Should Have |
| [STORY-016](EPIC-002-document-management/Backend/STORY-016-folder-api.md) | Folder API | Backend | 5 | Should Have |
| [STORY-017](EPIC-002-document-management/Backend/STORY-017-archive-api.md) | Archive API | Backend | 3 | Should Have |

---

### EPIC-003: Signing Workflows (37 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-018](EPIC-003-signing-workflows/Frontend/STORY-018-workflow-selector.md) | Workflow Selector | Frontend | 3 | Must Have |
| [STORY-019](EPIC-003-signing-workflows/Frontend/STORY-019-signer-management.md) | Signer Management | Frontend | 5 | Must Have |
| [STORY-020](EPIC-003-signing-workflows/Frontend/STORY-020-field-placement.md) | Field Placement | Frontend | 8 | Must Have |
| [STORY-021](EPIC-003-signing-workflows/Frontend/STORY-021-workflow-review.md) | Workflow Review | Frontend | 3 | Must Have |
| [STORY-022](EPIC-003-signing-workflows/Backend/STORY-022-workflow-api.md) | Workflow API | Backend | 5 | Must Have |
| [STORY-023](EPIC-003-signing-workflows/Backend/STORY-023-signer-api.md) | Signer API | Backend | 3 | Must Have |
| [STORY-024](EPIC-003-signing-workflows/Backend/STORY-024-fields-api.md) | Fields API | Backend | 5 | Must Have |
| [STORY-025](EPIC-003-signing-workflows/Backend/STORY-025-initiate-api.md) | Initiate API | Backend | 5 | Must Have |

---

### EPIC-004: Signature Application (29 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-026](EPIC-004-signature-application/Frontend/STORY-026-signing-page.md) | Signing Page | Frontend | 5 | Must Have |
| [STORY-027](EPIC-004-signature-application/Frontend/STORY-027-draw-signature.md) | Draw Signature | Frontend | 5 | Must Have |
| [STORY-028](EPIC-004-signature-application/Frontend/STORY-028-upload-signature.md) | Upload Signature | Frontend | 3 | Must Have |
| [STORY-029](EPIC-004-signature-application/Frontend/STORY-029-type-signature.md) | Type Signature | Frontend | 3 | Must Have |
| [STORY-030](EPIC-004-signature-application/Frontend/STORY-030-reject-modal.md) | Reject Modal | Frontend | 2 | Must Have |
| [STORY-031](EPIC-004-signature-application/Backend/STORY-031-apply-signature-api.md) | Apply Signature API | Backend | 5 | Must Have |
| [STORY-032](EPIC-004-signature-application/Backend/STORY-032-reject-api.md) | Reject API | Backend | 3 | Must Have |
| [STORY-033](EPIC-004-signature-application/Backend/STORY-033-token-validation.md) | Token Validation | Backend | 3 | Must Have |

---

### EPIC-005: Email Notifications (18 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-034](EPIC-005-email-notifications/Backend/STORY-034-invitation-emails.md) | Invitation Emails | Backend | 5 | Must Have |
| [STORY-035](EPIC-005-email-notifications/Backend/STORY-035-reminder-emails.md) | Reminder Emails | Backend | 3 | Should Have |
| [STORY-036](EPIC-005-email-notifications/Backend/STORY-036-completion-emails.md) | Completion Emails | Backend | 3 | Must Have |
| [STORY-037](EPIC-005-email-notifications/Backend/STORY-037-rejection-emails.md) | Rejection Emails | Backend | 2 | Must Have |
| [STORY-038](EPIC-005-email-notifications/Others/STORY-038-email-templates.md) | Email Templates | Others | 5 | Must Have |

---

### EPIC-006: Dashboard (22 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-039](EPIC-006-dashboard/Frontend/STORY-039-dashboard-layout.md) | Dashboard Layout | Frontend | 5 | Must Have |
| [STORY-040](EPIC-006-dashboard/Frontend/STORY-040-pending-section.md) | Pending Section | Frontend | 3 | Must Have |
| [STORY-041](EPIC-006-dashboard/Frontend/STORY-041-waiting-section.md) | Waiting Section | Frontend | 3 | Must Have |
| [STORY-042](EPIC-006-dashboard/Frontend/STORY-042-completed-drafts.md) | Completed/Drafts | Frontend | 3 | Should Have |
| [STORY-043](EPIC-006-dashboard/Backend/STORY-043-dashboard-api.md) | Dashboard API | Backend | 5 | Must Have |
| [STORY-044](EPIC-006-dashboard/Backend/STORY-044-status-aggregation.md) | Status Aggregation | Backend | 3 | Must Have |

---

### EPIC-007: Profile Management (12 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-045](EPIC-007-profile-management/Frontend/STORY-045-profile-page.md) | Profile Page | Frontend | 3 | Must Have |
| [STORY-046](EPIC-007-profile-management/Frontend/STORY-046-signature-manager.md) | Signature Manager | Frontend | 3 | Must Have |
| [STORY-047](EPIC-007-profile-management/Backend/STORY-047-profile-api.md) | Profile API | Backend | 3 | Must Have |
| [STORY-048](EPIC-007-profile-management/Backend/STORY-048-signature-api.md) | Signature API | Backend | 3 | Must Have |

---

### EPIC-008: Audit Trail (24 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-049](EPIC-008-audit-trail/Frontend/STORY-049-activity-timeline.md) | Activity Timeline | Frontend | 5 | Must Have |
| [STORY-050](EPIC-008-audit-trail/Frontend/STORY-050-audit-export.md) | Audit Export UI | Frontend | 3 | Should Have |
| [STORY-051](EPIC-008-audit-trail/Frontend/STORY-051-admin-activity.md) | Admin Activity | Frontend | 3 | Should Have |
| [STORY-052](EPIC-008-audit-trail/Backend/STORY-052-event-logging.md) | Event Logging | Backend | 5 | Must Have |
| [STORY-053](EPIC-008-audit-trail/Backend/STORY-053-audit-api.md) | Audit API | Backend | 3 | Must Have |
| [STORY-054](EPIC-008-audit-trail/Backend/STORY-054-export-generation.md) | Export Generation | Backend | 5 | Should Have |

---

### EPIC-009: Admin Management (20 pts)
| ID | Title | Role | Points | Priority |
|----|-------|------|--------|----------|
| [STORY-055](EPIC-009-admin-management/Frontend/STORY-055-user-table.md) | User Table | Frontend | 5 | Must Have |
| [STORY-056](EPIC-009-admin-management/Frontend/STORY-056-invite-modal.md) | Invite Modal | Frontend | 3 | Must Have |
| [STORY-057](EPIC-009-admin-management/Frontend/STORY-057-role-assignment.md) | Role Assignment | Frontend | 3 | Must Have |
| [STORY-058](EPIC-009-admin-management/Backend/STORY-058-user-list-api.md) | User List API | Backend | 3 | Must Have |
| [STORY-059](EPIC-009-admin-management/Backend/STORY-059-invitation-api.md) | Invitation API | Backend | 3 | Must Have |
| [STORY-060](EPIC-009-admin-management/Backend/STORY-060-role-api.md) | Role API | Backend | 3 | Must Have |

---

## Summary by Priority

| Priority | Stories | Points |
|----------|---------|--------|
| **Must Have** | 51 | 175 |
| **Should Have** | 9 | 27 |

## Summary by Role

| Role | Stories | Points |
|------|---------|--------|
| **Frontend** | 29 | 99 |
| **Backend** | 30 | 98 |
| **Others** | 1 | 5 |

---

**Generated:** February 5, 2026  
**Source Documents:** EPICs, FSD
