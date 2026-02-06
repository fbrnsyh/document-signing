<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\UserSignature;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $signature = $user->signature;

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'signature' => $signature ? [
                'id' => $signature->id,
                'signature_path' => $signature->signature_path,
                'signature_type' => $signature->signature_type,
                'signature_url' => Storage::url($signature->signature_path),
            ] : null,
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Save user's signature.
     */
    public function saveSignature(Request $request): RedirectResponse
    {
        $request->validate([
            'signature' => ['required', 'string'],
            'signature_type' => ['required', 'in:drawn,typed,uploaded'],
        ]);

        $user = $request->user();

        // Delete existing signature if any
        if ($user->signature) {
            Storage::delete($user->signature->signature_path);
            $user->signature->delete();
        }

        // Save new signature
        $signatureData = $request->signature;
        $signatureType = $request->signature_type;

        // Generate unique filename
        $filename = 'signatures/' . $user->id . '_' . time() . '.png';

        // For drawn signatures, decode base64 and save
        if ($signatureType === 'drawn') {
            $signatureData = preg_replace('/^data:image\/\w+;base64,/', '', $signatureData);
            $signatureData = base64_decode($signatureData);
            Storage::put($filename, $signatureData);
        } else {
            // For typed/uploaded signatures, handle accordingly
            Storage::put($filename, $signatureData);
        }

        // Create signature record
        UserSignature::create([
            'user_id' => $user->id,
            'signature_path' => $filename,
            'signature_type' => $signatureType,
        ]);

        return Redirect::route('profile.edit')->with('success', 'Signature saved successfully.');
    }

    /**
     * Delete user's signature.
     */
    public function deleteSignature(Request $request): RedirectResponse
    {
        $user = $request->user();
        $signature = $user->signature;

        if ($signature) {
            // Delete file from storage
            Storage::delete($signature->signature_path);

            // Delete database record
            $signature->delete();
        }

        return Redirect::route('profile.edit')->with('success', 'Signature deleted successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
