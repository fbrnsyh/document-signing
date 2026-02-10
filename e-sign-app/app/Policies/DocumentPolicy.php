<?php

namespace App\Policies;

use App\Models\Document;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DocumentPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'admin') {
            return true;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Document $document): bool
    {
        if ($user->id === $document->uploader_id) {
            return true;
        }

        $signer = $document->signers()->where(function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->orWhere('email', $user->email);
        })->first();

        if (!$signer) {
            return false;
        }

        // If they already signed, they can always view it
        if ($signer->signed_at !== null || $signer->status === 'signed' || $signer->status === 'completed') {
            return true;
        }

        // If it's their turn, they can view it
        $workflow = $document->workflow;
        if (!$workflow) {
            return false;
        }

        if ($workflow->mode === 'parallel' || $workflow->mode === 'direct') {
            return $workflow->status !== 'draft';
        }

        if ($workflow->mode === 'sequential') {
            $nextSigner = $workflow->signers()
                ->where('status', 'pending')
                ->orderBy('order')
                ->first();
            
            return $nextSigner && $nextSigner->id === $signer->id;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->role !== 'viewer';
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Document $document): bool
    {
        return $user->id === $document->uploader_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Document $document): bool
    {
        return $user->id === $document->uploader_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Document $document): bool
    {
        return $user->id === $document->uploader_id;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Document $document): bool
    {
        return $user->id === $document->uploader_id;
    }
}
