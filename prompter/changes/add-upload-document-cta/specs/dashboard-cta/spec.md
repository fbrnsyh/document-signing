# dashboard-cta Specification Delta

## ADDED Requirements

### Requirement: Dashboard Primary Action CTA
The Dashboard MUST provide a clear and prominent Call to Action (CTA) for users to upload a new document, ensuring it is the most visible secondary action after reading the welcome message.

#### Scenario: User wants to upload a document from the dashboard
- **GIVEN** I am on the Dashboard page
- **WHEN** I look at the header section
- **THEN** I MUST see an "UPLOAD DOCUMENT" (or similar) button
- **AND** the button MUST be styled as a primary action (using `bg-primary`)
- **AND** clicking the button MUST navigate me to the document upload page (`/documents/upload`)
