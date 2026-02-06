# EPIC-001: User Authentication System

## Epic Summary
**Epic ID:** EPIC-001  
**Epic Title:** User Authentication System  
**Epic Description:** Enable secure user access through registration, login, password recovery, and session management.

---

## Story Index by Role

### Frontend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-001 | Registration Form | Must Have | 5 | Not Started | [Link](Frontend/STORY-001-registration-form.md) |
| STORY-002 | Login Form | Must Have | 3 | Not Started | [Link](Frontend/STORY-002-login-form.md) |
| STORY-003 | Password Reset Flow | Must Have | 3 | Not Started | [Link](Frontend/STORY-003-password-reset-flow.md) |
| STORY-004 | Auth Layout & Navigation | Must Have | 2 | Not Started | [Link](Frontend/STORY-004-auth-layout.md) |

### Backend Stories
| Story ID | Title | Priority | Story Points | Status | File |
|----------|-------|----------|--------------|--------|------|
| STORY-005 | Registration API | Must Have | 5 | Not Started | [Link](Backend/STORY-005-registration-api.md) |
| STORY-006 | Login API | Must Have | 5 | Not Started | [Link](Backend/STORY-006-login-api.md) |
| STORY-007 | Password Reset API | Must Have | 5 | Not Started | [Link](Backend/STORY-007-password-reset-api.md) |
| STORY-008 | Email Verification API | Must Have | 3 | Not Started | [Link](Backend/STORY-008-email-verification-api.md) |

---

## Story Dependency Map
```
STORY-004 (Layout) ──► STORY-001, STORY-002, STORY-003
STORY-005 (Register API) ──► STORY-001
STORY-008 (Verify API) ──► STORY-006
STORY-006 (Login API) ──► STORY-002
STORY-007 (Reset API) ──► STORY-003
```

---

## Total Estimates
| Category | Story Points |
|----------|--------------|
| **Frontend** | 13 |
| **Backend** | 18 |
| **Total** | 31 |

### By Priority
- **Must Have:** 31 points (100%)
