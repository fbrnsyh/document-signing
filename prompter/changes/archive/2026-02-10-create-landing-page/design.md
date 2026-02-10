# Design: Create Professional Landing Page

## Architecture Overview
The landing page will be a standard Inertia.js React component located at `resources/js/Pages/Welcome.jsx`. It will leverage `shadcn/ui` components and Tailwind CSS for styling.

## Component Structure
The landing page will be decomposed into several sub-components:
- `LandingHeader`: Navigation menu with logo and auth links.
- `LandingHero`: Main headline, value prop, and primary CTA.
- `LandingFeatures`: Grid of key features.
- `LandingWorkflows`: Visual explanation of Direct, Sequential, and Parallel signing.
- `LandingSocialProof`: Simple section for trust (e.g., "Used by 500+ teams").
- `LandingFooter`: Copyright and links.

## Color Palette & Typography
- Follow the existing design system tokens defined in `prompter/e-sign-document-management/design-system.md`.
- Primary Color: Indigo/Blue for trust and professionalism.
- Typography: Inter/System font as defined in `project.md`.

## Data Requirements
- The component will receive `auth` prop from Inertia to determine whether to show "Dashboard" or "Login/Register" buttons.
- Features and Workflow data can be hardcoded in the component for now.

## Trade-offs
- **Single Page vs Multiple Components**: Keeping it in one file (`Welcome.jsx`) initially is simpler for Inertia, but we'll break it into sub-components within the same file or a `Welcome/` folder if it becomes too large.
- **Animations**: Subtle Framer Motion animations to make it feel premium, but keeping it lightweight.
