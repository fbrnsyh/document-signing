<?php

namespace App\Http\Controllers;

use App\Models\Workflow;
use App\Models\Signer;
use App\Models\SignatureField;
use App\Models\Document;
use App\Services\AuditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class WorkflowController extends Controller
{
    protected $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'document_id' => 'required|exists:documents,id',
            'mode' => ['required', Rule::in(['direct', 'sequential', 'parallel'])],
        ]);

        $document = Document::findOrFail($validated['document_id']);
        $this->authorize('update', $document);

        // Check if workflow already exists for this document
        if ($document->workflow()->exists()) {
            return response()->json(['message' => 'Workflow already exists for this document'], 422);
        }

        $workflow = $document->workflow()->create([
            'mode' => $validated['mode'],
            'status' => 'draft',
        ]);

        // If direct mode, automatically add the owner as the first signer
        if ($validated['mode'] === 'direct') {
            $user = auth()->user();
            $workflow->signers()->create([
                'user_id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'order' => 1,
                'status' => 'pending',
            ]);
        }

        return response()->json($workflow->load('signers'), 201);
    }

    public function show(Workflow $workflow)
    {
        $this->authorize('view', $workflow);
        return $workflow->load(['signers', 'fields']);
    }

    public function update(Request $request, Workflow $workflow)
    {
        $this->authorize('update', $workflow);

        $validated = $request->validate([
            'mode' => [Rule::in(['direct', 'sequential', 'parallel'])],
        ]);

        $workflow->update($validated);

        // If switched to direct mode and no signers exist, add the owner
        if ($workflow->mode === 'direct' && $workflow->signers()->count() === 0) {
            $user = auth()->user();
            $workflow->signers()->create([
                'user_id' => $user->id,
                'email' => $user->email,
                'name' => $user->name,
                'order' => 1,
                'status' => 'pending',
            ]);
        }

        return response()->json($workflow->load('signers'));
    }

    public function destroy(Workflow $workflow)
    {
        $this->authorize('delete', $workflow);

        if ($workflow->status !== 'draft') {
            return response()->json(['message' => 'Cannot delete active workflow'], 422);
        }

        $workflow->delete();

        return response()->json(null, 204);
    }

    public function addSigner(Request $request, Workflow $workflow)
    {
        $this->authorize('update', $workflow);

        if ($workflow->signers()->count() >= 10) {
            return response()->json(['message' => 'Maximum 10 signers'], 422);
        }

        $validated = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $order = $workflow->signers()->max('order') + 1;

        $signer = $workflow->signers()->create(array_merge($validated, [
            'order' => $order,
            'status' => 'pending',
        ]));

        return response()->json($signer, 201);
    }

    public function removeSigner(Workflow $workflow, Signer $signer)
    {
        $this->authorize('update', $workflow);

        if ($signer->workflow_id !== $workflow->id) {
            abort(404);
        }

        $signer->delete();

        return response()->json(null, 204);
    }

    public function reorderSigners(Request $request, Workflow $workflow)
    {
        $this->authorize('update', $workflow);

        $validated = $request->validate([
            'orders' => 'required|array',
            'orders.*.id' => 'required|exists:signers,id',
            'orders.*.order' => 'required|integer',
        ]);

        foreach ($validated['orders'] as $item) {
            $workflow->signers()->where('id', $item['id'])->update(['order' => $item['order']]);
        }

        return response()->json(['message' => 'Signer order updated']);
    }

    public function addField(Request $request, Workflow $workflow)
    {
        $this->authorize('update', $workflow);

        $validated = $request->validate([
            'signer_id' => 'required',
            'page_number' => 'required|integer|min:1',
            'x_position' => 'required|numeric|between:0,100',
            'y_position' => 'required|numeric|between:0,100',
            'width' => 'required|numeric|min:0',
            'height' => 'required|numeric|min:0',
            'field_type' => ['required', Rule::in(['signature', 'initial', 'date', 'text'])],
            'is_required' => 'boolean',
        ]);

        // Handle special case for self-sign (signer_id = 0)
        if ($validated['signer_id'] == 0) {
            // For direct mode, self-sign means the owner is signing
            if ($workflow->mode === 'direct') {
                $ownerSigner = $workflow->signers()->first();
                if ($ownerSigner) {
                    $validated['signer_id'] = $ownerSigner->id;
                } else {
                    return response()->json(['message' => 'No signer found for self-sign'], 422);
                }
            } else {
                return response()->json(['message' => 'Self-sign is only available in direct mode'], 422);
            }
        }

        $signer = Signer::findOrFail($validated['signer_id']);
        if ($signer->workflow_id !== $workflow->id) {
            return response()->json(['message' => 'Signer does not belong to this workflow'], 422);
        }

        $field = $workflow->fields()->create($validated);

        return response()->json($field, 201);
    }

    public function updateField(Request $request, Workflow $workflow, SignatureField $field)
    {
        $this->authorize('update', $workflow);

        if ($field->workflow_id !== $workflow->id) {
            abort(404);
        }

        $validated = $request->validate([
            'x_position' => 'numeric|between:0,100',
            'y_position' => 'numeric|between:0,100',
            'width' => 'numeric|min:0',
            'height' => 'numeric|min:0',
            'is_required' => 'boolean',
            'signer_id' => 'nullable',
        ]);

        // Handle special case for self-sign (signer_id = 0)
        if (isset($validated['signer_id'])) {
            if ($validated['signer_id'] == "0") {
                // For direct mode, self-sign means the owner is signing
                if ($workflow->mode === 'direct') {
                    $ownerSigner = $workflow->signers()->first();
                    if ($ownerSigner) {
                        $validated['signer_id'] = $ownerSigner->id;
                    } else {
                        // If no signer exists, don't update signer_id
                        unset($validated['signer_id']);
                    }
                } else {
                    // For non-direct modes, we can't use self-sign
                    unset($validated['signer_id']);
                }
            } else {
                // Validate that the signer exists and belongs to this workflow
                $signer = Signer::find($validated['signer_id']);
                if (!$signer || $signer->workflow_id !== $workflow->id) {
                    // Return an error response instead of silently unsetting the signer_id
                    return response()->json([
                        'message' => 'The selected signer does not belong to this workflow',
                        'errors' => [
                            'signer_id' => ['The selected signer is invalid']
                        ]
                    ], 422);
                }
            }
        }

        // Only update the fields that were provided in the request
        // This prevents nulling out fields that weren't included in the update
        $field->update($validated);

        // Return the updated field with all its properties
        // Load the signer relationship to ensure it's included in the response
        return response()->json($field->fresh()->load('signer'));
    }

    public function removeField(Workflow $workflow, SignatureField $field)
    {
        $this->authorize('update', $workflow);

        if ($field->workflow_id !== $workflow->id) {
            abort(404);
        }

        $field->delete();

        return response()->json(null, 204);
    }

    public function initiate(Workflow $workflow, \App\Services\SigningService $signingService)
    {
        $this->authorize('update', $workflow);

        if ($workflow->status !== 'draft') {
            return response()->json(['message' => 'Workflow already initiated'], 422);
        }

        // Validation for non-direct
        if ($workflow->mode !== 'direct') {
            if ($workflow->signers()->count() === 0) {
                return response()->json(['message' => 'At least one signer required'], 422);
            }

            // All signers must have at least one field
            $signersWithoutFields = $workflow->signers()
                ->whereDoesntHave('fields')
                ->count();

            if ($signersWithoutFields > 0) {
                return response()->json(['message' => 'All signers must have fields'], 422);
            }
        } else {
            // Direct mode: Owner must have at least one field
            if ($workflow->fields()->count() === 0) {
                return response()->json(['message' => 'At least one signature field required'], 422);
            }
        }

        $workflow->update(['status' => 'pending']);

        // Update document status too
        $workflow->document->update(['status' => 'pending']);

        // Log workflow creation
        $signers = $workflow->signers->toArray();
        $this->auditService->logWorkflowCreated(
            $workflow->document_id,
            auth()->id(),
            request(),
            $signers
        );

        $responseData = [
            'message' => 'Workflow initiated',
            'status' => 'pending'
        ];

        // If direct mode, provide the signing URL for immediate redirection
        if ($workflow->mode === 'direct') {
            $signer = $workflow->signers()->first();
            if ($signer) {
                $token = $signingService->generateToken($signer);
                $responseData['redirect_url'] = "/sign/{$token}";
            }
        }

        return response()->json($responseData);
    }
}
