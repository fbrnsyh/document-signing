# Tasks: Fix Field Drag Position

- [x] Update field styling in `FieldPlacement.jsx` <!-- id: 7 -->
    - [x] Remove or refine `transition-all` class to prevent interference with drag-and-drop. <!-- id: 8 -->
- [x] Update `onDragEnd` logic in `FieldPlacement.jsx` <!-- id: 0 -->
    - [x] Target field container using `.closest('.drag-field')`. <!-- id: 11 -->
    - [x] Implement absolute coordinate measurement with immediate DOM updates. <!-- id: 12 -->
    - [x] Add `animate={{ x: 0, y: 0 }}` to reset transforms after every drag. <!-- id: 13 -->
    - [x] Sync local `fields` state with parent `workflow.fields`. <!-- id: 14 -->
    - [x] Implement optimistic updates in `handleFieldMove`. <!-- id: 9 -->
    - [x] Move CSS transitions to inner elements. <!-- id: 10 -->
- [x] Final Validation <!-- id: 3 -->
    - [x] Verify no horizontal "jump" during vertical drags. <!-- id: 15 -->
    - [x] Verify no "cumulative offset" on second drag. <!-- id: 16 -->
    - [x] Verify that positions persist correctly. <!-- id: 6 -->
