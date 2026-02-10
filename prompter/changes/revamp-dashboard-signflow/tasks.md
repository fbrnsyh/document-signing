# Tasks: Revamp Dashboard Page using SignFlow Style

- [x] **Infrastructure & Layout**
    - [x] Update `AuthenticatedLayout.jsx` to apply the glassmorphic header style.
    - [x] Update `Dashboard.jsx` main container to use the SignFlow mesh gradient background.

- [x] **Stat Cards Revamp**
    - [x] Implement new `StatCard` using the glassmorphic container (`bg-white/70 backdrop-blur-sm`).
    - [x] Refine stat iconography and typography (bold counts, muted uppercase labels).

- [x] **Section & Card Revamp**
    - [x] Refactor `SectionHeader` with cleaner SignFlow alignment.
    - [x] Revamp `PendingSignatureCard` with glass background, lift animations, and refined shadows.
    - [x] Revamp `WaitingOnOthersCard` incorporating the glass progress bar and blue-purple gradient.
    - [x] Revamp `CompletedDocumentCard` and `DraftDocumentCard` for visual consistency.
    - [x] Update `EmptyState` with a more integrated glassmorphic dashed border.

- [x] **Animations & Polish**
    - [x] Add `framer-motion` entrance animations (staggered fade-in).
    - [x] Ensure dark mode compatibility for all semi-transparent layers.
    - [x] Verify padding and spacing (increase to "premium" levels).

- [x] **Verification**
    - [x] Manually verify glass effects on desktop and mobile.
    - [x] Check accessibility (contrast on semi-transparent backgrounds).
    - [x] Verify hover interactions feel smooth and consistent.

