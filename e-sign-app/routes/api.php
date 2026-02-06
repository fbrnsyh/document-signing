<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\FolderController;
use App\Http\Controllers\WorkflowController;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Profile Management
    Route::get('/profile', [App\Http\Controllers\ProfileApiController::class, 'show']);
    Route::patch('/profile', [App\Http\Controllers\ProfileApiController::class, 'update']);
    Route::patch('/profile/password', [App\Http\Controllers\ProfileApiController::class, 'updatePassword']);

    // Signature Management
    Route::get('/profile/signature', [App\Http\Controllers\ProfileApiController::class, 'getSignature']);
    Route::post('/profile/signature', [App\Http\Controllers\ProfileApiController::class, 'saveSignature']);
    Route::delete('/profile/signature', [App\Http\Controllers\ProfileApiController::class, 'deleteSignature']);

    Route::get('/documents', [DocumentController::class, 'index']);
    Route::post('/documents/upload', [DocumentController::class, 'store']);
    Route::get('/documents/{document}', [DocumentController::class, 'show']);
    Route::patch('/documents/{document}', [DocumentController::class, 'update']);
    Route::post('/documents/{document}/archive', [DocumentController::class, 'archive']);
    Route::post('/documents/{document}/restore', [DocumentController::class, 'restore']);
    Route::get('/documents/{document}/download', [DocumentController::class, 'download']);

    Route::apiResource('folders', FolderController::class);

    // Workflows
    Route::post('/workflows', [WorkflowController::class, 'store']);
    Route::get('/workflows/{workflow}', [WorkflowController::class, 'show']);
    Route::patch('/workflows/{workflow}', [WorkflowController::class, 'update']);
    Route::delete('/workflows/{workflow}', [WorkflowController::class, 'destroy']);
    Route::post('/workflows/{workflow}/initiate', [WorkflowController::class, 'initiate']);

    // Signers
    Route::post('/workflows/{workflow}/signers', [WorkflowController::class, 'addSigner']);
    Route::delete('/workflows/{workflow}/signers/{signer}', [WorkflowController::class, 'removeSigner']);
    Route::patch('/workflows/{workflow}/signers/reorder', [WorkflowController::class, 'reorderSigners']);

    // Fields
    Route::post('/workflows/{workflow}/fields', [WorkflowController::class, 'addField']);
    Route::patch('/workflows/{workflow}/fields/{field}', [WorkflowController::class, 'updateField']);
    Route::delete('/workflows/{workflow}/fields/{field}', [WorkflowController::class, 'removeField']);

    // Audit Trail
    Route::get('/documents/{document}/activity', [AuditController::class, 'documentActivity']);
    Route::get('/documents/{document}/activity/export', [AuditController::class, 'exportDocumentActivity']);
    Route::get('/admin/activity', [AuditController::class, 'adminActivity']);

    // Admin Management
    Route::prefix('admin')->group(function () {
        Route::get('/users', [AdminController::class, 'users']);
        Route::patch('/users/{user}/role', [AdminController::class, 'updateUserRole']);
        Route::patch('/users/{user}/deactivate', [AdminController::class, 'deactivateUser']);
        Route::patch('/users/{user}/activate', [AdminController::class, 'activateUser']);
        Route::post('/invitations', [AdminController::class, 'inviteUser']);
        Route::get('/invitations', [AdminController::class, 'invitations']);
        Route::delete('/invitations/{invitation}', [AdminController::class, 'deleteInvitation']);
    });
});

// Signing Routes
Route::middleware('signing')->prefix('sign/{token}')->group(function () {
    Route::get('/', [App\Http\Controllers\SigningController::class, 'show']);
    Route::get('/document', [App\Http\Controllers\SigningController::class, 'streamDocument'])->name('api.sign.document');
    Route::post('/fields/{field}', [App\Http\Controllers\SigningController::class, 'applySignature']);
    Route::post('/reject', [App\Http\Controllers\SigningController::class, 'reject']);
});
