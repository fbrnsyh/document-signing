# Tasks: Improve Mobile Navigation

## Phase 1: Foundation & Components
- [x] Create `MobileBottomNav` component in `resources/js/Components/` <!-- id: 1 -->
- [x] Implement `MobileNavLink` component for the bottom bar icons/labels <!-- id: 2 -->
- [x] Add necessary Lucide icons to `MobileBottomNav` <!-- id: 3 -->

## Phase 2: Layout Integration
- [x] Update `AuthenticatedLayout.jsx` to include `MobileBottomNav` <!-- id: 4 -->
- [x] Apply conditional visibility (show on mobile, hide on desktop) <!-- id: 5 -->
- [x] Add bottom padding to the main content container in `AuthenticatedLayout` for mobile view <!-- id: 6 -->

## Phase 3: UI Simplification
- [x] Refactor the existing hamburger menu in `AuthenticatedLayout` to only show "secondary" or "overflow" items if necessary <!-- id: 7 -->
- [x] Ensure the top header is compact and clean on mobile <!-- id: 8 -->

## Phase 4: Validation & Polish
- [x] Verify navigation on various screen sizes (Code verified) <!-- id: 9 -->
- [x] Ensure dark mode consistency for the new bottom bar <!-- id: 10 -->
- [x] Confirm "safe area" handling for modern mobile devices <!-- id: 11 -->
