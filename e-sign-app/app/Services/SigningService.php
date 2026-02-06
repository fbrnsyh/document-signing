<?php

namespace App\Services;

use App\Models\Signer;
use App\Models\Workflow;
use Illuminate\Support\Facades\Config;

class SigningService
{
    /**
     * Generate a signing token for a signer.
     */
    public function generateToken(Signer $signer, int $hours = 24): string
    {
        $payload = [
            'workflow_id' => $signer->workflow_id,
            'signer_id' => $signer->id,
            'expires_at' => now()->addHours($hours)->timestamp,
        ];

        $data = base64_encode(json_encode($payload));
        $signature = hash_hmac('sha256', $data, Config::get('app.key'));

        return $data . '.' . $signature;
    }

    /**
     * Validate and decode a signing token.
     */
    public function validateToken(string $token): ?array
    {
        $parts = explode('.', $token);

        if (count($parts) !== 2) {
            return null;
        }

        [$data, $signature] = $parts;

        // Verify signature
        $expectedSignature = hash_hmac('sha256', $data, Config::get('app.key'));
        if (!hash_equals($expectedSignature, $signature)) {
            return null;
        }

        $payload = json_decode(base64_decode($data), true);

        if (!$payload || !isset($payload['expires_at'], $payload['workflow_id'], $payload['signer_id'])) {
            return null;
        }

        return $payload;
    }
}
