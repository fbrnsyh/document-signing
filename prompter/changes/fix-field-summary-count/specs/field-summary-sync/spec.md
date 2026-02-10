# Specification: Field Summary Sync

## ADDED Requirements

### Requirement: [REQ-SYNC-001] Workflow Summary Accuracy
The workflow review step MUST display an accurate summary of all configurations made in previous steps.

#### Scenario: Accurate Field Count in Review
- GIVEN a user is in the "Placement" step of a document workflow
- AND the user has added 3 signature fields across 2 pages
- WHEN the user proceeds to the "Review" step
- THEN the "Fields" summary card must display "3 placement(s)"
- AND it must display "Across 2 pages"
- AND if a field is subsequently removed, the summary must reflect the updated count upon returning to the review step.
