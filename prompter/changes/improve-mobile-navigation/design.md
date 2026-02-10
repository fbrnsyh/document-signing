# Design: Mobile-First Bottom Navigation

## Introduction
Modern mobile applications favor bottom navigation bars because they are within easy reach of the user's thumb. Our current implementation uses a traditional top-down hamburger menu, which is less efficient for frequent navigation.

## Architecture
The bottom navigation bar will be integrated into the `AuthenticatedLayout`. It will be conditionally rendered only on small screens (`sm:hidden`).

### Components
1.  **MobileBottomNav**: A fixed-position container at the bottom of the viewport.
2.  **NavButton**: Individual buttons within the bar, featuring an icon and a label.
3.  **Safe Area Handling**: CSS utilities to ensure the bar sits above the home indicator on iOS and Android.

### Layout Changes
- The main scroll area will need a bottom padding (e.g., `pb-20`) on mobile to prevent content from being obscured by the fixed bottom bar.
- The top header will be simplified on mobile, potentially removing the hamburger menu in favor of a simpler "Profile" or "Action" menu if not all items fit in the bottom bar.

### State Management
- Use Inertia's `route().current()` to highlight active buttons in the bottom bar, consistent with existing `NavLink` behavior.

## Visual Design
- **Theme**: Glassmorphic effect (blur + semi-transparent background) to match the "SignFlow" aesthetic.
- **Icons**: Use Lucide-react icons for clear visual representation.
- **Micro-interactions**: Subtle scale or opacity shifts on press/active states.

## Trade-offs
- **Fixed vs. Sticky**: Fixed bottom bar ensures it's always accessible but takes up vertical space. We'll use a standard height (around 64px) which is industry standard.
- **Density**: We'll limit the bottom bar to 4-5 items to avoid crowding.
