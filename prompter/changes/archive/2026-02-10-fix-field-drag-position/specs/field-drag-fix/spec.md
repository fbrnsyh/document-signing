# Specification: Field Drag Positioning

## ADDED Requirements

### Requirement: [REQ-PLACE-001] Precise Field Positioning
The application MUST allow users to precisely position signature and other fields on the document via drag-and-drop.

#### Scenario: Accurate Field Drop Position
- GIVEN a user is in the "Placement" step of a document workflow
- AND a field is already present on the page
- WHEN the user drags the field to a new location
- AND releases the drag
- THEN the field MUST remain at the exact position (top-left coordinate) where it was released relative to the document content
- AND the position MUST be persisted correctly to the backend.

#### Scenario: Dragging via Child Elements
- GIVEN a user is dragging a field
- WHEN the user initiates the drag by clicking on a child element (e.g., the field type icon or label)
- THEN the field container MUST move correctly as a single unit
- AND when released, the final position MUST be calculated based on the field container's coordinates, not the child element's coordinates.
