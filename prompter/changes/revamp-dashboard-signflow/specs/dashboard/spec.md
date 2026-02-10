# Capability: Dashboard Refinement

## MODIFIED Requirements

### Requirement: Dashboard Layout
The dashboard SHALL organize documents into four distinct sections and provide topline metrics using a high-fidelity, glassmorphic design system ("SignFlow").

#### Scenario: User views the refined dashboard
- **WHEN** I load the dashboard
- **THEN** I see a mesh gradient background (multi-tone indigo/purple/white)
- **AND** I see four summary cards with glassmorphic effects (background blur) for metrics
- **AND** the document list cards use semi-transparent white backgrounds with lift-on-hover animations
- **AND** progress bars for documents awaiting others use blue-to-purple gradients.

### Requirement: Document Action Visuals
The dashboard MUST provide clear, high-contrast action buttons for documents, following the SignFlow button patterns.

#### Scenario: User interacts with a pending document
- **WHEN** I hover over a document card in "Waiting for Your Signature"
- **THEN** it scales slightly (1.01x) and its shadow deepens
- **AND** the "Sign Now" button remains highly visible with a distinct shadow matching its brand color.
