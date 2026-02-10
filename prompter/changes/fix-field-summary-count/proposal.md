# Proposal: Fix Field Summary Count Sync

## Why

The field summary in the "Review & Send" step of the document workflow currently displays "0 fields" even after fields have been added in the "Placement" step. This happens because the `FieldPlacement.jsx` component manages the field tokens in its local state and does not synchronize them back to the parent `Workflow.jsx` component's `workflow` state. Consequently, when the user proceeds to the "Review" step, the `ReviewAndSend.jsx` component receives a stale `workflow` object that does not contain the newly added fields.

## How

1.  **Modify `FieldPlacement.jsx`**:
    *   Add an `onWorkflowUpdate` prop to allow synchronization with the parent state.
    *   Call `onWorkflowUpdate` whenever fields are added, removed, or updated.
    *   Update `handleFieldMove` and `handleSignerChange` to also update the local `fields` state to ensure UI consistency and provide the most up-to-date data to the parent.
2.  **Modify `Workflow.jsx`**:
    *   Pass the `setWorkflow` state setter to the `FieldPlacement` component via the new `onWorkflowUpdate` prop.
3.  **Modify `ReviewAndSend.jsx`**:
    *   Ensure the component correctly handles the `fields` array from the `workflow` prop (already implemented, but we verify it works with the synced state).

## Risk

- **Low**: This change primarily involves synchronizing existing state between components. Ensuring that `onWorkflowUpdate` is called correctly will maintain consistency without breaking existing functionality.
- **Performance**: Frequent state updates to the parent component could cause re-renders, but since field placement is a user-driven interaction with relatively few fields (usually < 20), this is not expected to be a performance bottleneck.
