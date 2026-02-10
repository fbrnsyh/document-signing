<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Document;
use App\Models\AuditLog;
use App\Models\Folder;
use App\Services\AuditService;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class DocumentController extends Controller
{
    protected $auditService;

    public function __construct(AuditService $auditService)
    {
        $this->auditService = $auditService;
    }

    public function index(Request $request)
    {
        $userId = Auth::id();
        $userEmail = Auth::user()->email;

        $query = Document::where(function ($q) use ($userId, $userEmail) {
            // 1. User is the uploader
            $q->where('uploader_id', $userId)
              // 2. User is a participant (signer)
              ->orWhereHas('workflow.signers', function ($sq) use ($userId, $userEmail) {
                  $sq->where(function ($q2) use ($userId, $userEmail) {
                      $q2->where('user_id', $userId)->orWhere('email', $userEmail);
                  })
                  ->where(function ($q3) {
                      // Already signed
                      $q3->whereNotNull('signed_at')
                         ->orWhereIn('status', ['signed', 'completed'])
                         // OR it's an active parallel/direct workflow
                         ->orWhereHas('workflow', function ($wq) {
                             $wq->whereIn('mode', ['parallel', 'direct'])
                                ->where('status', 'pending');
                         })
                         // OR it's their turn in a sequential workflow
                         ->orWhere(function ($q4) {
                             $q4->where('status', 'pending')
                                ->whereHas('workflow', function ($wq) {
                                    $wq->where('mode', 'sequential')
                                       ->where('status', 'pending');
                                })
                                ->whereRaw('`order` = (SELECT MIN(`s2`.`order`) FROM `signers` AS `s2` WHERE `s2`.`workflow_id` = `signers`.`workflow_id` AND `s2`.`status` = "pending")');
                         });
                  });
              });
        });

        if ($request->boolean('include_archived')) {
            // Show everything
        } else {
            $query->whereNull('archived_at');
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('folder_id')) {
            $query->where('folder_id', $request->folder_id);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('original_filename', 'like', "%{$search}%");
            });
        }

        $documents = $query->with(['uploader', 'workflow.signers'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $documents->getCollection()->transform(function ($doc) use ($userId, $userEmail) {
            $isOwner = $doc->uploader_id === $userId;
            $mySigner = $doc->workflow?->signers->first(function ($s) use ($userId, $userEmail) {
                return ($s->user_id !== null && $s->user_id === $userId) || ($s->email === $userEmail);
            });

            $doc->is_owner = $isOwner;
            if ($mySigner) {
                $doc->my_status = $mySigner->status;
                // Add a flag if it's their turn
                if ($doc->workflow?->mode === 'sequential') {
                    $nextSigner = $doc->workflow->signers->where('status', 'pending')->sortBy('order')->first();
                    $doc->is_my_turn = $nextSigner && $nextSigner->id === $mySigner->id;
                } else {
                    $doc->is_my_turn = $mySigner->status === 'pending';
                }
            }
            return $doc;
        });

        if ($request->wantsJson()) {
            return response()->json($documents);
        }

        $folders = Folder::where('user_id', Auth::id())->whereNull('parent_id')->with('children')->get();

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'folders' => $folders,
            'filters' => $request->only(['search', 'status', 'include_archived', 'folder_id'])
        ]);
    }

    public function create(Request $request)
    {
        $folders = Folder::where('user_id', Auth::id())->whereNull('parent_id')->with('children')->get();

        return Inertia::render('Documents/Upload', [
            'folders' => $folders,
            'selectedFolderId' => $request->folder_id,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:pdf,docx,png,jpg,jpeg|max:25600',
            'title' => 'nullable|string|max:255',
            'folder_id' => 'nullable|exists:folders,id',
        ]);

        $file = $request->file('file');
        $originalName = $file->getClientOriginalName();
        $title = $request->title ?: pathinfo($originalName, PATHINFO_FILENAME);

        $path = $file->store('documents');

        $document = Document::create([
            'uploader_id' => Auth::id(),
            'title' => $title,
            'original_filename' => $originalName,
            'file_path' => $path,
            'file_size' => $file->getSize(),
            'status' => 'draft',
            'folder_id' => $request->folder_id,
        ]);

        $this->auditService->logDocumentUpload($document->id, Auth::id(), $request);

        $redirectParams = [];
        if ($request->folder_id) {
            $redirectParams['folder_id'] = $request->folder_id;
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Document uploaded successfully',
                'document' => $document,
                'redirect' => route('documents.index', $redirectParams)
            ]);
        }

        return redirect()->route('documents.index', $redirectParams)->with('success', 'Document uploaded successfully');
    }

    public function show(Document $document)
    {
        $this->authorize('view', $document);

        $document->load(['workflow.signers', 'workflow.fields']);

        // Log document view
        $this->auditService->logDocumentView($document->id, Auth::id(), request());

        if (request()->wantsJson()) {
            return response()->json($document);
        }

        return Inertia::render('Documents/Show', [
            'document' => $document
        ]);
    }

    public function update(Request $request, Document $document)
    {
        $this->authorize('update', $document);

        $request->validate([
            'title' => 'sometimes|string|max:200',
            'tags' => 'sometimes|array|max:10',
            'tags.*' => 'string|max:50',
        ]);

        $document->update($request->only(['title', 'tags']));

        AuditLog::create([
            'user_id' => Auth::id(),
            'action' => 'updated',
            'ip_address' => $request->ip(),
            'metadata' => [
                'document_id' => $document->id,
                'changes' => $request->only(['title', 'tags']),
            ],
        ]);

        return back()->with('status', 'Document updated successfully');
    }

    public function archive(Document $document)
    {
        $this->authorize('update', $document);

        if ($document->status !== 'completed' && $document->status !== 'cancelled' && $document->status !== 'draft') {
             return back()->withErrors(['status' => 'Only completed, cancelled, or draft documents can be archived']);
        }

        $document->update(['archived_at' => now()]);

        $this->auditService->logDocumentArchive($document->id, Auth::id(), request());

        return back()->with('status', 'Document archived successfully');
    }

    public function restore(Document $document)
    {
        $this->authorize('update', $document);

        $document->update(['archived_at' => null]);

        $this->auditService->logEvent('document_restored', $document->id, Auth::id(), request());

        return back()->with('status', 'Document restored successfully');
    }

    public function download(Document $document)
    {
        $this->authorize('view', $document);

        $this->auditService->logEvent('document_downloaded', $document->id, Auth::id(), request());

        return Storage::download($document->file_path, $document->original_filename);
    }

    public function workflow(Document $document)
    {
        $this->authorize('update', $document);
        $document->load(['workflow.signers', 'workflow.fields']);

        return Inertia::render('Documents/Workflow', [
            'document' => $document
        ]);
    }
}
