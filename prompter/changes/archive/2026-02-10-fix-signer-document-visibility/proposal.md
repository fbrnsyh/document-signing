# Proposal: Fix Signer Document Visibility

## Why
Fix the issue where signers cannot view their document after they have signed it. This applies to both parallel and sequential signing modes. Currently, signers who are registered users cannot see these documents in their list, and the signing link becomes inaccessible once used.

## Reach
- `DocumentController`: Update index to include documents where the user is a participant.
- `DocumentPolicy`: Update view policy to allow signers.
- `Document` model: Add relationship to signers.
- `ValidateSigningToken` middleware: Allow completed signers to view the document (read-only).
- `SigningController`: Handle read-only view for completed signers.

## Success Criteria
- Signers who are registered users can see documents they have signed (or are pending to sign) in their document list.
- Signers can still access the signing link after signing to view the document (as read-only).
- Sequential logic is preserved (signers can't see/sign until it's their turn, but can see it after they've signed).

## User Review Required
> [!IMPORTANT]
> Should signers be able to see the document *before* it's their turn in a sequential workflow? Usually, they should only see it when they are invited to sign.
