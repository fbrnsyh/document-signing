# STORY-031: Signature Application API

**Epic:** EPIC-004 - Signature Application  
**Role:** Backend  
**Story Points:** 5  
**Priority:** Must Have

---

## User Story
As the system,  
I want to receive and apply signatures to documents,  
So that signed documents are created.

## Description
Implement signature application API that receives signature image, applies to PDF at field position, updates field status, and checks workflow completion.

## Acceptance Criteria
```gherkin
GIVEN a valid signing token and signature data
WHEN POST /api/sign/{token}/fields/{field_id}
THEN signature is applied and field marked complete

GIVEN all signer's fields complete
WHEN last field is signed
THEN signer status is updated to "completed"

GIVEN all signers complete (parallel)
WHEN last signer finishes
THEN workflow status becomes "completed"

GIVEN sequential workflow
WHEN signer completes
THEN next signer is notified
```

## Technical Notes
- Receive signature as base64 PNG
- Use PDF library to overlay at coordinates
- Calculate position from percentage + page size
- Queue email for next signer (sequential)

## Traceability
- **FSD Reference:** FR-016, FR-017, FR-018
- **Epic:** EPIC-004

## Dependencies
- **Depends On:** STORY-024, STORY-033
- **Blocks:** STORY-026
