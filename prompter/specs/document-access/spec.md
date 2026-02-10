# document-access Specification

## Purpose
Define access control rules for documents, specifically for signers in various workflow modes.
## Requirements

### Requirement: Document Listing for Signers
The system MUST include documents where the user is a `signer` in the main document list, in addition to documents they uploaded.

#### Scenario: Verify signers see documents in their list
**Given** I am logged in as separate User B
**And** User A has sent me a document to sign
**When** I view my dashboard / document list
**Then** I should see the document sent by User A
**And** the status should reflect my signing status (e.g., "Pending" or "Signed")

### Requirement: Signing Link Persistence
The system MUST allow a signing link/token to be valid for viewing the document even after the signature has been applied, rendering it in a read-only mode.

#### Scenario: Accessing signed document via link
**Given** I have already signed a document via a unique link
**When** I click the same link again
**Then** I should see the document content in a read-only view
**And** I should NOT be able to apply changes or sign again
**And** I should see a message indicating I have already signed

### Requirement: Sequential Access Control
In sequential signing workflows, signers MUST only have access to view the document when it is their turn or after they have signed.

#### Scenario: Premature access in sequential workflow
**Given** a sequential workflow with Signer 1 -> Signer 2  
**And** Signer 1 has NOT signed yet  
**When** Signer 2 logs in to view their documents  
**Then** Signer 2 should NOT see the document in their list  
**And** Signer 2 should NOT be able to view the document content via direct link

#### Scenario: Post-signing access in sequential workflow
**Given** a sequential workflow with Signer 1 -> Signer 2  
**And** Signer 1 has signed  
**When** Signer 1 logs in  
**Then** Signer 1 should see the document in their list as "Signed"  
**And** Signer 1 can view the document content

