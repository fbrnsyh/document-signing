# Design: State Synchronization for Workflow Fields

## Current Architecture

The `Workflow.jsx` component serves as the orchestrator for the 4-step document workflow:
1. `ModeSelector`
2. `SignerManagement`
3. `FieldPlacement`
4. `ReviewAndSend`

State is maintained in `Workflow.jsx` via the `workflow` state variable.

### Data Flow Problem

Currently:
- `SignerManagement` receives `onWorkflowUpdate` and syncs changes back to the parent.
- `FieldPlacement` receives the `workflow` object but only manages its own local `fields` state for performance and complex interaction reasons (drag and drop). 
- When `FieldPlacement` makes changes (addition, removal, movement), it updates the backend but fails to notify the parent `Workflow.jsx` component.
- When the user transitions to `ReviewAndSend`, the parent's `workflow` state is stale, resulting in "0 fields" being displayed because the `fields` relationship was never updated in the parent state.

## Proposed Solution

Enable two-way synchronization between `FieldPlacement` and `Workflow.jsx`.

### Component Changes

#### `FieldPlacement.jsx`
- Introduce `onWorkflowUpdate` prop.
- Wrap local `fields` updates with a call to `onWorkflowUpdate({ ...workflow, fields: updatedFields })`.
- This ensures that the parent `Workflow.jsx` always has the latest field data.

#### `Workflow.jsx`
- Pass `setWorkflow` to `FieldPlacement`.

### Field Positioning Detail
While the primary goal is fixing the count, the design also includes updating the parent state when fields are moved. This ensures that if the user goes back to the "Signers" step (Step 2) and then forward again, the positions are maintained from the parent state rather than relying on a full page reload or initial stale data.
