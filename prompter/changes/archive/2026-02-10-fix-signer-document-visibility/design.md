# Design: Signer Document Visibility

## Problem Analysis
The current implementation of document access is too restrictive:
1. **Document Ownership Only**: `DocumentController@index` and `DocumentPolicy@view` only consider the `uploader_id`.
2. **One-Time Signing Links**: `ValidateSigningToken` middleware rejects users who have already signed (`status === 'completed'`).
3. **Implicit Linkage**: Signers are added via email, but if a registered user exists with that email, they should automatically have visibility in their dashboard.

## Proposed Changes

### 1. Document Model Enhancements
Add `signers` relationship to `Document.php` through the `Workflow` model to simplify querying.

### 2. Document List & Access
- Modify `DocumentController@index` to query for documents where `uploader_id == user_id` OR there is a signer record with `user_id == user_id`.
- Update `DocumentPolicy@view` to allow access if the user is a signer.
- Update `DocumentPolicy@download` (if separate) or ensure it follows `view`.

### 3. Signing Link Persistence
- Modify `ValidateSigningToken.php` to allow `completed` or `signed` status.
- In `SigningController@index` and `@show`, check if the signer has already signed. If so, display the document in "Read-only" mode and hide the signature tools.

### 4. Sequential Workflow Considerations
In sequential mode, a signer should only see the document if:
- They are the uploader.
- It is their turn (status: `pending` and order is next).
- They have already signed (status: `completed`).
- The entire workflow is completed.

A signer whose turn hasn't come yet should NOT see the document in their list to avoid confusion or premature viewing (depending on project requirements, but standard sequential flow usually works this way).

## Data Flow
1. User logs in.
2. `DocumentController@index` fetches:
   - Documents they uploaded.
   - Documents where they are a signer AND (it's their turn OR they already signed).
3. User clicks "View".
4. `DocumentPolicy` checks `uploader_id` or `signers` list.
5. `DocumentShow` page renders.

## Alternatives Considered
- **Linking all documents to users in a pivot table**: Overkill for the current requirements where `uploader_id` handles ownership and `Signer` handles participation.
