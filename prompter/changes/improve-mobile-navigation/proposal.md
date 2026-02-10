# Proposal: Improve Mobile Design and Bottom Bar Navigation

## Why
The current mobile navigation relies on a traditional hamburger menu, which is less efficient and thumb-friendly than modern app-like bottom navigation. As users move towards mobile-first document management, a persistent bottom bar for primary actions (Dashboard, Documents, Profile) will significantly enhance usability and the premium feel of the application.

## What Changes
- **Mobile Navigation Bar**: Introduce a persistent bottom navigation bar on mobile screens.
- **Layout Refinement**: Adjust `AuthenticatedLayout` to handle the new navigation and ensure content is not obscured.
- **Header Simplification**: Clean up the mobile header by removing duplicate navigation links.
- **Iconography**: Use consistent Lucide icons for mobile navigation items.

## Impact
- **Affected Specs**: `mobile-navigation` (new delta).
- **Affected Code**: `AuthenticatedLayout.jsx`, `NavLink.jsx`, `app.css`.
