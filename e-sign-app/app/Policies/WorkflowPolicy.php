<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Workflow;
use Illuminate\Auth\Access\Response;

class WorkflowPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if ($user->role === 'admin') {
            return true;
        }

        return null;
    }

    public function view(User $user, Workflow $workflow): bool
    {
        return $user->id === $workflow->document->uploader_id;
    }

    public function create(User $user): bool
    {
        return $user->role !== 'viewer';
    }

    public function update(User $user, Workflow $workflow): bool
    {
        return $user->id === $workflow->document->uploader_id;
    }

    public function delete(User $user, Workflow $workflow): bool
    {
        // GIVEN a workflow in progress THEN response returns 422 "Cannot delete active workflow"
        // (This check should be in Controller validation, but Policy can also handle it)
        return $user->id === $workflow->document->uploader_id;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Workflow $workflow): bool
    {
        //
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Workflow $workflow): bool
    {
        //
    }
}
