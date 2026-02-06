# STORY-050: Audit Export Interface

**Epic:** EPIC-008 - Audit Trail and Activity Log  
**Role:** Frontend  
**Story Points:** 3  
**Priority:** Should Have

---

## User Story
As a document owner,  
I want to export the audit trail,  
So that I have a record for compliance.

## Description
Implement export buttons on document detail to download audit trail as PDF or CSV.

## Acceptance Criteria
```gherkin
GIVEN I am viewing document activity
WHEN I click "Export PDF"
THEN a PDF audit report is downloaded

GIVEN I click "Export CSV"
WHEN processed
THEN a CSV file with all events is downloaded

GIVEN the PDF export
WHEN generated
THEN it includes document info, all events, and digital certificate
```

## Traceability
- **FSD Reference:** FR-026
- **Epic:** EPIC-008

## Dependencies
- **Depends On:** STORY-049, STORY-054
- **Blocks:** None
