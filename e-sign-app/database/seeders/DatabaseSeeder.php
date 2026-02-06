<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin User
        \App\Models\User::updateOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
                'role' => 'admin',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Regular Member 1
        \App\Models\User::updateOrCreate(
            ['email' => 'user@example.com'],
            [
                'name' => 'Test User',
                'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
                'role' => 'member',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Regular Member 2
        \App\Models\User::updateOrCreate(
            ['email' => 'member2@example.com'],
            [
                'name' => 'Member Two',
                'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
                'role' => 'member',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Viewer
        \App\Models\User::updateOrCreate(
            ['email' => 'viewer@example.com'],
            [
                'name' => 'Viewer User',
                'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
                'role' => 'viewer',
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );

        // Extra Users for Workflow Testing (Signers)
        foreach (range(1, 5) as $i) {
            \App\Models\User::updateOrCreate(
                ['email' => "signer{$i}@example.com"],
                [
                    'name' => "Signer One{$i}",
                    'password' => \Illuminate\Support\Facades\Hash::make('Password123!'),
                    'role' => 'member',
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
