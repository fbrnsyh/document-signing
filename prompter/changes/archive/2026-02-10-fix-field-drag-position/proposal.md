# Proposal: Fix Field Drag Position

## Why

The current drag-and-drop implementation for fields in the document workflow has a positioning bug. When a field is dragged and dropped, its final position is not exactly where it was released. This is likely due to using `e.target` instead of `e.currentTarget` in the `onDragEnd` event handler, which causes incorrect coordinate calculations if the user clicks on a child element of the field (like an icon or text). Additionally, the use of `getBoundingClientRect()` might be affected by the element's transform during the drag.

## What

- Update the `onDragEnd` logic in `FieldPlacement.jsx` to use more reliable coordinate calculation.
- Prefer `e.currentTarget` or `info` from Framer Motion to ensure we are calculating the position of the field container itself.
- Ensure the coordinate calculation accounts for the scroll position of the parent container if necessary (though `getBoundingClientRect` is relative to viewport, so as long as both are measured, it should be fine).
- Clamp the final position to ensure fields stay within the document boundaries.

## How

1. Modify `FieldPlacement.jsx`'s `onDragEnd` handler.
2. Replace `e.target.getBoundingClientRect()` with `e.currentTarget.getBoundingClientRect()`.
3. Optionally use `info.point` and `info.offset` for even more precise control if `e.currentTarget` is not sufficient.
4. Verify the drag constraints and clamping logic.

## What Changes

### field-drag-fix (CREATE)

- Standardizes field drag-and-drop logic in `FieldPlacement.jsx`.
- Implements absolute coordinate measurement relative to the canvas.
- Adds transform reset logic using Framer Motion's `animate` prop to prevent cumulative offsets.
- Adds immediate DOM updates to prevent visual jumps upon drag release.
- Enhances state synchronization between local component state and parent workflow.
