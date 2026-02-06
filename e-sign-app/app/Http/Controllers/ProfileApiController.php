<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\UserSignature;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class ProfileApiController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        $user = $request->user();
        $signature = $user->signature;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'email_verified_at' => $user->email_verified_at,
            ],
            'signature' => $signature ? [
                'id' => $signature->id,
                'signature_path' => $signature->signature_path,
                'signature_type' => $signature->signature_type,
                'signature_url' => Storage::url($signature->signature_path),
            ] : null,
        ]);
    }

    public function update(ProfileUpdateRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'email_verified_at' => $user->email_verified_at,
            ],
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = $request->user();
        $user->password = Hash::make($request->password);
        $user->save();

        // Invalidate other sessions
        Auth::logoutOtherDevices($request->password);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    public function getSignature(Request $request): JsonResponse
    {
        $user = $request->user();
        $signature = $user->signature;

        if (!$signature) {
            return response()->json([
                'message' => 'No signature found',
            ], 404);
        }

        return response()->json([
            'id' => $signature->id,
            'signature_path' => $signature->signature_path,
            'signature_type' => $signature->signature_type,
            'signature_url' => Storage::url($signature->signature_path),
        ]);
    }

    public function saveSignature(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'signature' => ['required', 'string'],
            'signature_type' => ['required', 'in:drawn,typed,uploaded'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

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
        $signature = UserSignature::create([
            'user_id' => $user->id,
            'signature_path' => $filename,
            'signature_type' => $signatureType,
        ]);

        return response()->json([
            'message' => 'Signature saved successfully',
            'signature' => [
                'id' => $signature->id,
                'signature_path' => $signature->signature_path,
                'signature_type' => $signature->signature_type,
                'signature_url' => Storage::url($signature->signature_path),
            ],
        ]);
    }

    public function deleteSignature(Request $request): JsonResponse
    {
        $user = $request->user();
        $signature = $user->signature;

        if (!$signature) {
            return response()->json([
                'message' => 'No signature found',
            ], 404);
        }

        // Delete file from storage
        Storage::delete($signature->signature_path);

        // Delete database record
        $signature->delete();

        return response()->json([
            'message' => 'Signature deleted successfully',
        ]);
    }
}
