<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\FolderController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::get('/api/dashboard', [DashboardController::class, 'api'])->middleware(['auth', 'verified'])->name('dashboard.api');
Route::post('/documents/{document}/reminder', [DashboardController::class, 'sendReminder'])->middleware(['auth', 'verified'])->name('documents.reminder');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Signature routes
    Route::post('/profile/signature', [ProfileController::class, 'saveSignature'])->name('profile.signature.store');
    Route::delete('/profile/signature', [ProfileController::class, 'deleteSignature'])->name('profile.signature.delete');

    Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
    Route::get('/documents/upload', [DocumentController::class, 'create'])->name('documents.create');
    Route::get('/documents/{document}', [DocumentController::class, 'show'])->name('documents.show');
    Route::get('/documents/{document}/workflow', [DocumentController::class, 'workflow'])->name('documents.workflow');
    Route::post('/documents/{document}/archive', [DocumentController::class, 'archive'])->name('documents.archive');
    Route::post('/documents/{document}/restore', [DocumentController::class, 'restore'])->name('documents.restore');
    Route::get('/documents/{document}/download', [DocumentController::class, 'download'])->name('documents.download');

    // Folder routes
    Route::post('/folders', [FolderController::class, 'store'])->name('folders.store');
    Route::put('/folders/{folder}', [FolderController::class, 'update'])->name('folders.update');
    Route::delete('/folders/{folder}', [FolderController::class, 'destroy'])->name('folders.destroy');

    // Admin routes
    Route::get('/admin/activity', function () {
        return Inertia::render('Admin/ActivityLog');
    })->middleware(['auth', 'admin'])->name('admin.activity');

    Route::get('/admin/activity/data', [AuditController::class, 'adminActivity'])->middleware(['auth', 'admin'])->name('admin.activity.data');
    Route::get('/admin/users', [AuditController::class, 'getUsers'])->middleware(['auth', 'admin'])->name('admin.users.list');

    Route::get('/admin/users', function () {
        return Inertia::render('Admin/UserManagement');
    })->middleware(['auth', 'admin'])->name('admin.users');
});

Route::get('/sign/{token}', [App\Http\Controllers\SigningController::class, 'index'])
    ->middleware('signing')
    ->name('sign.index');

// Serve PDF worker file
Route::get('/build/pdf.worker.min.mjs', function() {
    $workerPath = public_path('build/pdf.worker.min.mjs');
    if (file_exists($workerPath)) {
        return response()->file($workerPath, ['Content-Type' => 'application/javascript']);
    }
    // Fallback to CDN if local file doesn't exist
    return redirect('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.624/pdf.worker.min.mjs');
});

require __DIR__.'/auth.php';
