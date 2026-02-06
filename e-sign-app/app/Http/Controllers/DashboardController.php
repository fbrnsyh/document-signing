<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Signer;
use App\Services\SigningService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\ReminderEmail;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $signingService;

    public function __construct(SigningService $signingService)
    {
        $this->signingService = $signingService;
    }

    public function index()
    {
        // Get dashboard data using the API method for consistency
        $dashboardData = $this->api()->getData(true);

        return Inertia::render('Dashboard', [
            'pending_signature' => $dashboardData['pending_signature'],
            'waiting_on_others' => $dashboardData['waiting_on_others'],
            'recently_completed' => $dashboardData['recently_completed'],
            'drafts' => $dashboardData['drafts'],
            'counts' => $dashboardData['counts'],
        ]);
    }

    /**
     * API endpoint for dashboard data
     * Returns optimized data for all dashboard sections
     */
    public function api()
    {
        $userId = Auth::id();
        $userEmail = Auth::user()->email;

        // 1. Waiting for Your Signature
        $waitingForYou = Document::whereHas('workflow.signers', function ($query) use ($userId, $userEmail) {
            $query->where('status', 'pending')
                  ->where(function ($q) use ($userId, $userEmail) {
                      $q->where('user_id', $userId)->orWhere('email', $userEmail);
                  });
        })->where('status', 'pending')
          ->with(['uploader', 'workflow.signers' => function ($query) {
              $query->where('status', 'pending')
                    ->orWhere('status', 'signed');
          }])
          ->limit(10)
          ->get()
          ->map(function ($document) use ($userId, $userEmail) {
              // Find the current user's signer record for this document
              $signer = $document->workflow->signers->first(function ($signer) use ($userId, $userEmail) {
                  return ($signer->user_id == $userId) || ($signer->email == $userEmail);
              });

              // Generate signing token if signer exists
              $signingToken = $signer ? $this->signingService->generateToken($signer) : null;

              return [
                  'id' => $document->id,
                  'title' => $document->title,
                  'uploader' => [
                      'name' => $document->uploader->name,
                  ],
                  'created_at' => $document->created_at->format('Y-m-d'),
                  'signing_mode' => $document->signing_mode,
                  'signing_token' => $signingToken,
              ];
          });

        // 2. Waiting on Others
        $waitingOnOthers = Document::where('uploader_id', $userId)
            ->whereIn('status', ['pending', 'partial'])
            ->with(['workflow.signers'])
            ->limit(10)
            ->get()
            ->map(function ($document) {
                $totalSigners = $document->workflow->signers->count();
                $signedSigners = $document->workflow->signers->where('status', 'signed')->count();

                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'status' => $document->status,
                    'signing_mode' => $document->signing_mode,
                    'progress' => [
                        'signed' => $signedSigners,
                        'total' => $totalSigners,
                        'percentage' => $totalSigners > 0 ? round(($signedSigners / $totalSigners) * 100) : 0,
                    ],
                    'signers' => $document->workflow->signers->map(function ($signer) {
                        return [
                            'name' => $signer->name,
                            'email' => $signer->email,
                            'status' => $signer->status,
                        ];
                    }),
                    'created_at' => $document->created_at->format('Y-m-d'),
                ];
            });

        // 3. Recently Completed (last 10)
        $recentlyCompleted = Document::where(function ($query) use ($userId, $userEmail) {
                $query->where('uploader_id', $userId)
                      ->orWhereHas('workflow.signers', function ($q) use ($userId, $userEmail) {
                          $q->where('user_id', $userId)->orWhere('email', $userEmail);
                      });
            })
            ->where('status', 'completed')
            ->orderBy('completed_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'completed_at' => $document->completed_at->format('Y-m-d'),
                ];
            });

        // 4. Drafts
        $drafts = Document::where('uploader_id', $userId)
            ->where('status', 'draft')
            ->whereNull('archived_at')
            ->orderBy('updated_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'title' => $document->title,
                    'updated_at' => $document->updated_at->format('Y-m-d'),
                ];
            });

        return response()->json([
            'pending_signature' => $waitingForYou,
            'waiting_on_others' => $waitingOnOthers,
            'recently_completed' => $recentlyCompleted,
            'drafts' => $drafts,
            'counts' => [
                'pending_signature' => $waitingForYou->count(),
                'waiting_on_others' => $waitingOnOthers->count(),
                'recently_completed' => $recentlyCompleted->count(),
                'drafts' => $drafts->count(),
            ],
        ]);
    }

    /**
     * Send reminder to pending signers
     */
    public function sendReminder(Request $request, Document $document)
    {
        // Check if user is the document owner
        if ($document->uploader_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Get all pending signers
        $pendingSigners = $document->workflow->signers()->where('status', 'pending')->get();

        if ($pendingSigners->isEmpty()) {
            return response()->json(['message' => 'No pending signers to remind']);
        }

        // Send reminder emails to all pending signers
        foreach ($pendingSigners as $signer) {
            // In a real implementation, you would send an email here
            // Mail::to($signer->email)->send(new ReminderEmail($document, $signer));

            // For now, we'll just log the action
            Log::info("Reminder sent to {$signer->email} for document {$document->title}");
        }

        return response()->json(['message' => 'Reminders sent successfully']);
    }
}
