<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Invitation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Database\Eloquent\Builder;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware(function ($request, $next) {
            if (!$request->user()->isAdmin()) {
                return response()->json(['message' => 'Forbidden'], 403);
            }
            return $next($request);
        });
    }

    /**
     * Get list of users with pagination, search, and role filtering
     */
    public function users(Request $request)
    {
        $query = User::query();

        // Search by name or email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        $users = $query->orderBy('created_at', 'desc')
                       ->paginate($request->get('per_page', 10));

        return response()->json($users);
    }

    /**
     * Send invitation to a new user
     */
    public function inviteUser(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => ['required', Rule::in(['admin', 'member', 'viewer'])],
        ]);

        // Check if user already exists
        if (User::where('email', $request->email)->exists()) {
            return response()->json(['message' => 'User already exists'], 422);
        }

        // Check if invitation already exists and not expired
        $existingInvitation = Invitation::where('email', $request->email)
                                        ->where('expires_at', '>', now())
                                        ->first();

        if ($existingInvitation) {
            return response()->json(['message' => 'Invitation already sent'], 422);
        }

        // Create invitation
        $token = Str::random(60);
        $invitation = Invitation::create([
            'email' => $request->email,
            'role' => $request->role,
            'token' => $token,
            'expires_at' => now()->addDays(7),
        ]);

        // TODO: Send invitation email
        // Mail::to($request->email)->send(new UserInvitation($invitation));

        return response()->json([
            'message' => 'Invitation sent successfully',
            'invitation' => $invitation
        ], 201);
    }

    /**
     * Update user role
     */
    public function updateUserRole(Request $request, User $user)
    {
        $request->validate([
            'role' => ['required', Rule::in(['admin', 'member', 'viewer'])],
        ]);

        // Check if trying to demote the last admin
        if ($user->isAdmin() && $request->role !== 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json(['message' => 'Cannot remove last admin'], 422);
            }
        }

        $user->update(['role' => $request->role]);

        return response()->json([
            'message' => 'User role updated successfully',
            'user' => $user
        ]);
    }

    /**
     * Deactivate user
     */
    public function deactivateUser(User $user)
    {
        // Cannot deactivate yourself
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot deactivate yourself'], 422);
        }

        // Cannot deactivate the last admin
        if ($user->isAdmin()) {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json(['message' => 'Cannot deactivate last admin'], 422);
            }
        }

        $user->update(['status' => 'inactive']);

        return response()->json([
            'message' => 'User deactivated successfully',
            'user' => $user
        ]);
    }

    /**
     * Activate user
     */
    public function activateUser(User $user)
    {
        $user->update(['status' => 'active']);

        return response()->json([
            'message' => 'User activated successfully',
            'user' => $user
        ]);
    }

    /**
     * Get invitations list
     */
    public function invitations(Request $request)
    {
        $query = Invitation::query();

        // Search by email
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where('email', 'like', "%{$search}%");
        }

        // Filter by role
        if ($request->has('role') && $request->role) {
            $query->where('role', $request->role);
        }

        $invitations = $query->orderBy('created_at', 'desc')
                            ->paginate($request->get('per_page', 10));

        return response()->json($invitations);
    }

    /**
     * Delete invitation
     */
    public function deleteInvitation(Invitation $invitation)
    {
        $invitation->delete();

        return response()->json(['message' => 'Invitation deleted successfully']);
    }
}
