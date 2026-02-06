<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        if ($event->user instanceof \App\Models\User) {
            \App\Models\AuditLog::create([
                'user_id' => $event->user->id,
                'action' => 'login',
                'ip_address' => request()->ip(),
                'metadata' => [
                    'user_agent' => request()->userAgent(),
                ],
            ]);
        }
    }
}
