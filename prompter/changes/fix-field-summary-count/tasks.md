# Tasks: Fix Field Summary Count Sync

## Implementation

1.  **Sync FieldPlacement with Parent State**
    - [x] Add `onWorkflowUpdate` prop to `FieldPlacement.jsx` <!-- id: 1 -->
    - [x] Call `onWorkflowUpdate` in `handleAddField` after updating local state <!-- id: 2 -->
    - [x] Call `onWorkflowUpdate` in `handleRemoveField` after updating local state <!-- id: 3 -->
    - [x] Update `handleFieldMove` to update local `fields` state and call `onWorkflowUpdate` <!-- id: 4 -->
    - [x] Update `handleSignerChange` to update local `fields` state and call `onWorkflowUpdate` <!-- id: 5 -->
2.  **Pass Update Callback in Workflow**
    - [x] Modify `Workflow.jsx` to pass `onWorkflowUpdate={setWorkflow}` to `FieldPlacement` <!-- id: 6 -->

## Validation

1.  **Manual Verification**
    - [x] Navigate to document workflow <!-- id: 7 -->
    - [x] Add fields in "Placement" step <!-- id: 8 -->
    - [x] Proceed to "Review" step <!-- id: 9 -->
    - [x] Verify "Fields" card displays the correct number of placements and pages <!-- id: 10 -->
    - [x] Go back to "Placement", remove a field, go forward to "Review", and verify count is updated <!-- id: 11 -->
2.  **Automated Validation**
    - [x] Run `prompter validate fix-field-summary-count --strict` <!-- id: 12 -->
