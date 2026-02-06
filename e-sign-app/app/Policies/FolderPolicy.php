<?php

namespace App\Policies;

use App\Models\Folder;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class FolderPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Folder $folder): bool
    {
        return $user->id === $folder->user_id || $user->role === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role !== 'viewer';
    }

    public function update(User $user, Folder $folder): bool
    {
        return $user->id === $folder->user_id || $user->role === 'admin';
    }

    public function delete(User $user, Folder $folder): bool
    {
        return $user->id === $folder->user_id || $user->role === 'admin';
    }
}
