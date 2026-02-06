<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class SigningController extends Controller
{
    protected $pdfService;
    protected $auditService;

    public function __construct(\App\Services\PDFService $pdfService, \App\Services\AuditService $auditService)
    {
        $this->pdfService = $pdfService;
        $this->auditService = $auditService;
    }

    /**
     * Render the signing page.
     */
    public function index(Request $request, string $token)
    {
        if (!\Illuminate\Support\Facades\Auth::check()) {
            return redirect()->route('login', ['redirect' => url()->current()]);
        }

        $signer = $request->get('signer_signer');
        $workflow = $request->get('signer_workflow');
        $workflow->load('document');

        return \Inertia\Inertia::render('Sign/Index', [
            'token' => $token,
            'signer' => $signer,
            'workflow' => $workflow,
        ]);
    }

    /**
     * Show the signing page data.
     */
    public function show(Request $request)
    {
        $signer = $request->get('signer_signer');
        $workflow = $request->get('signer_workflow');
        $document = $workflow->document;

        // Load fields for this signer
        $fields = \App\Models\SignatureField::where('workflow_id', $workflow->id)
            ->where('signer_id', $signer->id)
            ->get();

        return response()->json([
            'signer' => $signer,
            'workflow' => $workflow,
            'document' => [
                'id' => $document->id,
                'title' => $document->title,
                'file_url' => route('api.sign.document', ['token' => $request->route('token')]),
            ],
            'fields' => $fields,
        ]);
    }

    /**
     * Apply signature to a specific field.
     */
    public function applySignature(Request $request, string $token, \App\Models\SignatureField $field)
    {
        $signer = $request->get('signer_signer');
        $workflow = $request->get('signer_workflow');

        $request->validate([
            'signature' => 'required|string', // base64 PNG
        ]);

        if ($field->signer_id !== $signer->id) {
            return response()->json(['message' => 'Unauthorized field.'], 403);
        }

        if ($field->status === 'completed') {
            return response()->json(['message' => 'Field already signed.'], 409);
        }

        // Apply signature to PDF
        $this->pdfService->applySignature($workflow->document, $field, $request->signature);

        $field->update([
            'status' => 'completed',
            'signed_at' => now(),
            'metadata' => array_merge($field->metadata ?? [], ['signature_data' => 'applied'])
        ]);

        // Log document signing
        $this->auditService->logDocumentSign($workflow->document_id, auth()->id(), $request);

        // Check if all fields for this signer are complete
        $remainingFields = \App\Models\SignatureField::where('signer_id', $signer->id)
            ->where('status', 'pending')
            ->count();

        if ($remainingFields === 0) {
            $signer->update([
                'status' => 'completed',
                'signed_at' => now(),
            ]);

            // Check if all signers are complete
            $remainingSigners = \App\Models\Signer::where('workflow_id', $workflow->id)
                ->where('status', '!=', 'completed')
                ->count();

            if ($remainingSigners === 0) {
                $workflow->update(['status' => 'completed']);
                $workflow->document->update(['status' => 'completed', 'completed_at' => now()]);
            } else {
                // If sequential, notify next signer
                if ($workflow->mode === 'sequential') {
                    $this->notifyNextSigner($workflow, $signer);
                }
            }
        }

        return response()->json(['message' => 'Signature applied successfully.', 'field' => $field]);
    }

    /**
     * Reject the document.
     */
    public function reject(Request $request)
    {
        $signer = $request->get('signer_signer');
        $workflow = $request->get('signer_workflow');

        $request->validate([
            'reason' => 'required|string|min:10',
        ]);

        $signer->update([
            'status' => 'rejected',
            'rejection_reason' => $request->reason,
        ]);

        $workflow->update(['status' => 'cancelled']);
        $workflow->document->update(['status' => 'cancelled']);

        $this->auditService->logDocumentReject($workflow->document_id, auth()->id(), $request, $request->reason);

        // Notify all parties (will implement with events/mailables)
        // event(new DocumentRejected($workflow, $signer, $request->reason));

        return response()->json(['message' => 'Document rejected successfully.']);
    }

    /**
     * Notify the next signer in a sequential workflow.
     */
    protected function notifyNextSigner(\App\Models\Workflow $workflow, \App\Models\Signer $currentSigner)
    {
        // Find the next signer in the sequence
        $nextSigner = \App\Models\Signer::where('workflow_id', $workflow->id)
            ->where('order', '>', $currentSigner->order)
            ->where('status', 'pending')
            ->orderBy('order')
            ->first();

        if ($nextSigner) {
            // Generate a signing token for the next signer
            $signingService = new \App\Services\SigningService();
            $token = $signingService->generateToken($nextSigner);

            // Log the notification (in a real implementation, you would send an email/notification here)
            $this->auditService->logDocumentSign(
                $workflow->document_id,
                auth()->id(),
                request(),
                "Notified next signer: {$nextSigner->email} (Token: {$token})"
            );
        }
    }

    /**
     * Stream the document for signing.
     */
    public function streamDocument(Request $request)
    {
        $workflow = $request->get('signer_workflow');

        // Check if file exists
        if (!\Illuminate\Support\Facades\Storage::exists($workflow->document->file_path)) {
            return response()->json(['message' => 'Document file not found.'], 404);
        }

        return \Illuminate\Support\Facades\Storage::download(
            $workflow->document->file_path,
            $workflow->document->original_filename,
            ['Content-Type' => 'application/pdf']
        );
    }
}
