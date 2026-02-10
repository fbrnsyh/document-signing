<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateSigningToken
{
    protected $signingService;

    public function __construct(\App\Services\SigningService $signingService)
    {
        $this->signingService = $signingService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->route('token');

        if (!$token) {
            return response()->json(['message' => 'Signing token is required.'], 400);
        }

        $payload = $this->signingService->validateToken($token);

        if (!$payload) {
            return response()->json(['message' => 'Invalid signing link.'], 403);
        }

        if (now()->timestamp > $payload['expires_at']) {
            return response()->json(['message' => 'Signing link has expired.'], 401);
        }

        $signer = \App\Models\Signer::with('workflow')->find($payload['signer_id']);

        if (!$signer) {
            return response()->json(['message' => 'Signer not found.'], 404);
        }

        if ($signer->workflow->status === 'cancelled') {
            return response()->json(['message' => 'This signing request was cancelled.'], 410);
        }

        $isReadonly = ($signer->status === 'completed' || $signer->status === 'signed');

        if (!$isReadonly) {
            // Check if this is a sequential workflow and enforce signing order
            if ($signer->workflow->mode === 'sequential') {
                // Check if all previous signers have completed their signatures
                $previousSignersIncomplete = \App\Models\Signer::where('workflow_id', $signer->workflow_id)
                    ->where('order', '<', $signer->order)
                    ->where('status', '!=', 'completed')
                    ->where('status', '!=', 'signed')
                    ->exists();

                if ($previousSignersIncomplete) {
                    return response()->json(['message' => 'Previous signers must complete their signatures first.'], 403);
                }
            }
        }

        // Attach signer and workflow to the request for easy access in controllers
        $request->merge([
            'signer_signer' => $signer, 
            'signer_workflow' => $signer->workflow,
            'signer_is_readonly' => $isReadonly
        ]);

        return $next($request);
    }
}
