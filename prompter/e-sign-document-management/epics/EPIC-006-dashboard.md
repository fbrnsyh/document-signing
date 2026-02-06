# EPIC-006: Dashboard and Document Status

## Business Value Statement
Provide users with an at-a-glance view of all documents requiring action, enabling quick prioritization and efficient workflow management through a centralized dashboard.

## Description
This EPIC covers the main dashboard displaying documents organized by action status: pending signature, waiting on others, recently completed, and drafts. Includes quick actions and real-time status updates.

## Source Traceability

| Document | Reference | Section |
|----------|-----------|---------|
| FSD | FR-020 | Waiting for Signature View |
| FSD | FR-021 | Waiting on Others View |
| FSD | FR-022 | Recently Completed View |
| FSD | FR-023 | Drafts View |
| PRD | US-028 to US-032 | Dashboard User Stories |
| Wireframes | Dashboard | Main Screen |

## Scope Definition

| In Scope | Out of Scope |
|----------|--------------|
| Waiting for Signature section | Analytics/reporting widgets |
| Waiting on Others section | Custom dashboard layouts |
| Recently Completed section | Dashboard sharing |
| Drafts section | Mobile native app dashboard |
| Quick actions (sign, remind, view) | Bulk actions on dashboard |
| Document status progress bars | Calendar view of deadlines |
| Real-time updates (Phase 2) | Notification center panel |

## High-Level Acceptance Criteria

- [ ] Dashboard shows 4 sections: My Signatures, Waiting on Others, Completed, Drafts
- [ ] "Waiting for Signature" shows documents pending user's signature
- [ ] "Waiting on Others" shows owner's documents pending other signers
- [ ] Progress indicator shows X/Y signers completed
- [ ] Recently Completed shows last 10 completed documents
- [ ] Drafts section shows in-progress workflows not yet sent
- [ ] Quick actions available per document card
- [ ] Dashboard loads in under 2 seconds

## Dependencies

- **Prerequisite EPICs:** EPIC-001, EPIC-002, EPIC-003, EPIC-004
- **External Dependencies:** None
- **Technical Prerequisites:** Efficient query optimization

## Complexity Assessment

- **Size:** M
- **Technical Complexity:** Medium
- **Integration Complexity:** Low
- **Estimated Story Count:** 8-12

## Risks & Assumptions

**Assumptions:**
- Four-section layout covers primary user needs
- 10 recent documents is sufficient for quick reference
- Real-time updates can be added in Phase 2

**Risks:**
- Query performance with large document counts
- UI responsiveness on mobile devices

## Related EPICs

- **Depends On:** EPIC-001, EPIC-002, EPIC-003, EPIC-004
- **Blocks:** None
- **Related:** EPIC-008 (Audit Trail)
