# Proposal: Add Upload Document CTA on Dashboard

## Why

The current dashboard provides a great overview of pending actions and document statuses, but it lacks a direct entry point for the primary user action: uploading a new document. Adding a prominent Call to Action (CTA) button on the dashboard will improve user experience by reducing clicks and making the core functionality more accessible.

## What

- Add a "Upload Document" button to the Dashboard header.
- Ensure the button aligns with the existing "SignFlow" design system (glassmorphism, bold typography).
- Link the button to the document upload route (`documents.create`).

## Impact

- **UX**: Faster access to document upload.
- **Visuals**: Maintains the premium aesthetic of the revamped dashboard.

## Technical Details

- Modify `e-sign-app/resources/js/Pages/Dashboard.jsx`.
- Use the `Plus` or `Upload` icon from `lucide-react`.
- Apply Tailwind classes that match the existing dashboard buttons (e.g., `rounded-xl`, `font-black`, primary colors).
