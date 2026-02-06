<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AuditController extends Controller
{
    public function documentActivity(Request $request, Document $document): JsonResponse
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $user->id !== $document->uploader_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $auditLogs = AuditLog::where('document_id', $document->id)
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->paginate(50);

        return response()->json($auditLogs);
    }

    public function adminActivity(Request $request): JsonResponse
    {
        Log::info('AdminActivity endpoint accessed');
        if (!Auth::check()) {
            Log::error('User not authenticated');
            return response()->json(['error' => 'Unauthorized - Not authenticated'], 401);
        }

        if (Auth::user()->role !== 'admin') {
            Log::error('User is not admin: ' . Auth::user()->role);
            return response()->json(['error' => 'Unauthorized - Not admin'], 403);
        }

        $query = AuditLog::with('user:id,name,email')
            ->orderBy('created_at', 'desc');

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('action')) {
            $query->where('action', $request->input('action'));
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->input('date_from'));
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->input('date_to'));
        }

        $auditLogs = $query->paginate(50);

        return response()->json([
            'data' => $auditLogs->items(),
            'current_page' => $auditLogs->currentPage(),
            'last_page' => $auditLogs->lastPage(),
            'per_page' => $auditLogs->perPage(),
            'total' => $auditLogs->total(),
        ]);
    }

    public function getUsers(): JsonResponse
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $users = \App\Models\User::orderBy('name')->get(['id', 'name']);
        return response()->json($users);
    }

    public function exportDocumentActivity(Request $request, Document $document): StreamedResponse|JsonResponse
    {
        $user = Auth::user();

        if ($user->role !== 'admin' && $user->id !== $document->uploader_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $format = $request->input('format', 'csv');

        if (!in_array($format, ['csv', 'pdf'])) {
            return response()->json(['error' => 'Invalid format'], 400);
        }

        $auditLogs = AuditLog::where('document_id', $document->id)
            ->with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->get();

        if ($format === 'csv') {
            return $this->exportCsv($auditLogs, $document);
        }

        return $this->exportPdf($auditLogs, $document);
    }

    private function exportCsv($auditLogs, Document $document): StreamedResponse
    {
        $filename = "audit_{$document->id}_" . date('Y-m-d') . ".csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        return response()->stream(function () use ($auditLogs) {
            $file = fopen('php://output', 'w');

            fputcsv($file, ['Date', 'User', 'Action', 'IP Address', 'Details']);

            foreach ($auditLogs as $log) {
                $userName = $log->user ? $log->user->name : 'System';
                $details = '';

                if ($log->metadata) {
                    if (isset($log->metadata['document_title'])) {
                        $details = "Title: {$log->metadata['document_title']}";
                    } elseif (isset($log->metadata['reason'])) {
                        $details = "Reason: {$log->metadata['reason']}";
                    } elseif (isset($log->metadata['signers_count'])) {
                        $details = "Signers: {$log->metadata['signers_count']}";
                    }
                }

                fputcsv($file, [
                    $log->created_at,
                    $userName,
                    $log->action,
                    $log->ip_address,
                    $details
                ]);
            }

            fclose($file);
        }, 200, $headers);
    }

    private function exportPdf($auditLogs, Document $document)
    {
        $filename = "audit_{$document->id}_" . date('Y-m-d') . ".pdf";

        $headers = [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        // Generate a hash for verification
        $hash = md5(json_encode($auditLogs) . $document->id . date('Y-m-d H:i:s'));

        return response()->stream(function () use ($auditLogs, $document, $hash) {
            // Create a simple PDF-like output
            // In a production environment, you would use a proper PDF library like DomPDF
            $output = "%PDF-1.4\n";
            $output .= "1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n";
            $output .= "2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n";
            $output .= "3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n/Resources <<\n/Font <<\n/F1 5 0 R\n>>\n>>\n>>\nendobj\n";
            $output .= "4 0 obj\n<<\n/Length " . (strlen($this->getPdfContent($auditLogs, $document, $hash)) + 1) . "\n>>\nstream\n";
            $output .= $this->getPdfContent($auditLogs, $document, $hash);
            $output .= "\nendstream\nendobj\n";
            $output .= "5 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n";
            $output .= "xref\n0 6\n0000000000 65535 f \n";
            $output .= sprintf("%010d 00000 n \n", 1);
            $output .= sprintf("%010d 00000 n \n", 2);
            $output .= sprintf("%010d 00000 n \n", 3);
            $output .= sprintf("%010d 00000 n \n", 4);
            $output .= sprintf("%010d 00000 n \n", 5);
            $output .= "trailer\n<<\n/Size 6\n/Root 1 0 R\n>>\nstartxref\n";
            $output .= "0\n%%EOF\n";

            echo $output;
        }, 200, $headers);
    }

    private function getPdfContent($auditLogs, Document $document, $hash)
    {
        $content = "BT\n/F1 12 Tf\n50 750 Td\n(Audit Trail Report) Tj\nET\n";
        $content .= "BT\n/F1 10 Tf\n50 730 Td\n(Document: " . addslashes($document->title) . ") Tj\nET\n";
        $content .= "BT\n/F1 10 Tf\n50 715 Td\n(Generated: " . date('Y-m-d H:i:s') . ") Tj\nET\n";
        $content .= "BT\n/F1 10 Tf\n50 700 Td\n(Verification Hash: " . substr($hash, 0, 16) . "...) Tj\nET\n";

        $y = 670;
        foreach ($auditLogs as $log) {
            $userName = $log->user ? $log->user->name : 'System';
            $details = '';

            if ($log->metadata) {
                if (isset($log->metadata['document_title'])) {
                    $details = "Title: {$log->metadata['document_title']}";
                } elseif (isset($log->metadata['reason'])) {
                    $details = "Reason: {$log->metadata['reason']}";
                } elseif (isset($log->metadata['signers_count'])) {
                    $details = "Signers: {$log->metadata['signers_count']}";
                }
            }

            $content .= "BT\n/F1 10 Tf\n50 {$y} Td\n(" . date('Y-m-d H:i:s', strtotime($log->created_at)) . " - " . addslashes($userName) . " - " . addslashes(str_replace('_', ' ', $log->action)) . ") Tj\nET\n";
            $y -= 15;

            if ($log->ip_address) {
                $content .= "BT\n/F1 10 Tf\n70 {$y} Td\n(IP: " . $log->ip_address . ") Tj\nET\n";
                $y -= 15;
            }

            if ($details) {
                $content .= "BT\n/F1 10 Tf\n70 {$y} Td\n(" . addslashes($details) . ") Tj\nET\n";
                $y -= 15;
            }

            $y -= 5;

            if ($y < 50) {
                break; // Prevent content from going beyond page
            }
        }

        return $content;
    }
}
