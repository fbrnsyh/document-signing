# EPIC-009: Admin User Management

## Business Value Statement
Empower administrators to manage team access and permissions, ensuring appropriate document visibility and maintaining organizational security through role-based access control.

## Description
This EPIC covers administrative functionality including user invitation, role assignment (Admin, Member, Viewer), user deactivation, and viewing all organization documents. Admins can manage team composition and access levels.

## Source Traceability

| Document | Reference | Section |
|----------|-----------|---------|
| FSD | FR-028 | User Role Management |
| FSD | FR-029 | Admin Document View |
| FSD | FR-030 | User Invitation |
| PRD | US-042 to US-046 | Admin User Stories |
| Wireframes | Admin Panel | Admin Screens |

## Scope Definition

| In Scope | Out of Scope |
|----------|--------------|
| Invite new users by email | Bulk user import |
| Assign roles: Admin, Member, Viewer | Custom role creation |
| Change user roles | Department/team hierarchy |
| Deactivate user accounts | Permanent user deletion |
| Admin view of all documents | Document reassignment |
| Filter users by role, status | User activity reports |

## High-Level Acceptance Criteria

- [ ] Admin can invite new users by email
- [ ] Invitation sends email with registration link
- [ ] Admin can assign role: Admin, Member, or Viewer
- [ ] Role changes take effect immediately
- [ ] Cannot demote the last Admin user
- [ ] Admin can deactivate accounts (preserves data)
- [ ] Admin can view all organization documents
- [ ] Deactivated users cannot log in
- [ ] User list is searchable and filterable

## Dependencies

- **Prerequisite EPICs:** EPIC-001 (Authentication), EPIC-005 (Notifications)
- **External Dependencies:** None
- **Technical Prerequisites:** Role-based access control middleware

## Complexity Assessment

- **Size:** M
- **Technical Complexity:** Medium
- **Integration Complexity:** Low
- **Estimated Story Count:** 8-12

## Risks & Assumptions

**Assumptions:**
- Three-tier role system is sufficient for small teams
- Single organization per installation (no multi-tenancy)
- First registered user becomes Admin

**Risks:**
- Role permission edge cases may cause access issues
- Deactivating users with pending workflows may create orphans

## Related EPICs

- **Depends On:** EPIC-001, EPIC-005
- **Blocks:** None
- **Related:** EPIC-008 (admin audit viewing)
