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



// Signing Routes
Route::middleware('signing')->prefix('sign/{token}')->group(function () {
    Route::get('/', [App\Http\Controllers\SigningController::class, 'show']);
    Route::get('/document', [App\Http\Controllers\SigningController::class, 'streamDocument'])->name('api.sign.document');
    Route::post('/fields/{field}', [App\Http\Controllers\SigningController::class, 'applySignature']);
    Route::post('/reject', [App\Http\Controllers\SigningController::class, 'reject']);
});
