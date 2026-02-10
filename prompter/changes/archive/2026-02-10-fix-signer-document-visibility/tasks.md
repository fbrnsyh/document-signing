# Tasks: Fix Signer Document Visibility

- [x] **Infrastructure & Models**
    - [x] Add `signers` through relationship to `Document` model. <!-- id: 0 -->
    - [x] Ensure `Signer` model has `user_id` correctly handled (verify in `WorkflowController`). <!-- id: 1 -->

- [x] **Backend Authorization**
    - [x] Update `DocumentPolicy@view` to allow signers. <!-- id: 2 -->
    - [x] Update `DocumentController@index` to include documents where user is a signer. <!-- id: 3 -->
    - [x] Filter index to only show documents if it's the signer's turn or they have already signed (for sequential). <!-- id: 4 -->

- [x] **Signing Link Persistence**
    - [x] Modify `ValidateSigningToken` middleware to allow completed signers. <!-- id: 5 -->
    - [x] Update `SigningController` to pass `is_readonly` flag to frontend if signer already signed. <!-- id: 6 -->

- [x] **Frontend Updates**
    - [x] Update `Sign/Index.jsx` to handle read-only state. <!-- id: 7 -->
    - [x] Update Document Index UI to show "Signed" or "Waiting for others" status for signer documents. <!-- id: 8 -->

- [x] **Validation**
    - [x] Test parallel signing: Signer A signs, check if Signer A can still see the document. <!-- id: 9 -->
    - [x] Test sequential signing: Signer 1 signs, check if Signer 1 can still see while Signer 2 is pending. <!-- id: 10 -->
    - [x] Test sequential signing: Check that Signer 2 CANNOT see the document before Signer 1 signs. <!-- id: 11 -->
