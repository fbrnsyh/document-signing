# Design: Field Drag Position Fix

## Problem Analysis

In `FieldPlacement.jsx`, the `onDragEnd` handler calculates the new position of a field after it has been dragged.

```javascript
onDragEnd={(e, info) => {
    if (!pageRef.current || !canvasRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const elementRect = e.target.getBoundingClientRect();

    const relativeX = elementRect.left - canvasRect.left;
    const relativeY = elementRect.top - canvasRect.top;

    let newX = (relativeX / canvasRect.width) * 100;
    let newY = (relativeY / canvasRect.height) * 100;
    // ...
}}
```

### Issues:
1. **`e.target` vs `e.currentTarget`**: `e.target` refers to the specific element that received the event (e.g., an icon inside the field). `e.currentTarget` refers to the element the event listener is attached to (the `motion.div` field container). If a child is clicked, `elementRect` will be the child's bounding box, leading to incorrect offsets.
2. **Transform Sync**: Framer Motion updates the element's position using CSS transforms during drag. `getBoundingClientRect()` returns the post-transform position, which is what we want, but we must ensure we're measuring the correct element.

3. **CSS Transitions**: The field has a `transition-all` class. If this transition is active during or immediately after the drag, it might cause visual "jumps" as the element moves from its post-drag position (set by transforms) to its new position (set by `left`/`top` percentages). It's better to disable transitions while dragging or ensure they don't affect `left`/`top` during the sync.

## Proposed Solution

### 1. Use `e.currentTarget`
Change `e.target` to `e.currentTarget` to always measure the field container's rect.

```javascript
const elementRect = e.currentTarget.getBoundingClientRect();
```

### 2. Disable Transitions During Drag
Ensure that CSS transitions do not interfere with the Framer Motion drag or the subsequent position update. We can remove `transition-all` or make it more specific (e.g., `transition-colors`).

### 2. Precise Point Calculation (Alternative)
Framer Motion's `info` object provides `point` (absolute mouse position) and `offset` (relative movement). However, calculating the top-left of the field from the mouse point requires knowing the initial offset of the mouse within the field.

Using `e.currentTarget.getBoundingClientRect()` is the most straightforward fix for the `e.target` issue.

## Validation Plan

- Drag fields by different parts (icon, text, empty space).
- Verify that the field stays exactly where it was dropped relative to the PDF content.
- Verify that clamping prevents fields from being moved outside the document boundaries.
