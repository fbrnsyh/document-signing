<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Http\Request;

class AuditService
{
    public function logEvent(string $action, ?int $documentId = null, ?int $userId = null, ?Request $request = null, array $metadata = []): void
    {
        $ipAddress = null;
        $userAgent = null;

        if ($request) {
            $ipAddress = $request->ip();
            $userAgent = $request->userAgent();
        }

        AuditLog::create([
            'action' => $action,
            'document_id' => $documentId,
            'user_id' => $userId ?? auth()->id(),
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'metadata' => $metadata,
        ]);
    }

    public function logDocumentUpload(int $documentId, int $userId, Request $request): void
    {
        $this->logEvent(
            'document_uploaded',
            $documentId,
            $userId,
            $request,
            ['document_title' => $request->input('title', 'Untitled')]
        );
    }

    public function logDocumentView(int $documentId, ?int $userId = null, Request $request = null): void
    {
        $this->logEvent('document_viewed', $documentId, $userId, $request);
    }

    public function logDocumentSign(int $documentId, int $userId, Request $request): void
    {
        $this->logEvent('document_signed', $documentId, $userId, $request);
    }

    public function logDocumentReject(int $documentId, int $userId, Request $request, string $reason): void
    {
        $this->logEvent(
            'document_rejected',
            $documentId,
            $userId,
            $request,
            ['reason' => $reason]
        );
    }

    public function logDocumentDelete(int $documentId, int $userId, Request $request): void
    {
        $this->logEvent('document_deleted', $documentId, $userId, $request);
    }

    public function logDocumentArchive(int $documentId, int $userId, Request $request): void
    {
        $this->logEvent('document_archived', $documentId, $userId, $request);
    }

    public function logWorkflowCreated(int $documentId, int $userId, Request $request, array $signers): void
    {
        $this->logEvent(
            'workflow_created',
            $documentId,
            $userId,
            $request,
            ['signers_count' => count($signers)]
        );
    }

    public function logUserLogin(int $userId, Request $request): void
    {
        $this->logEvent('user_login', null, $userId, $request);
    }

    public function logUserLogout(int $userId, Request $request): void
    {
        $this->logEvent('user_logout', null, $userId, $request);
    }
}
