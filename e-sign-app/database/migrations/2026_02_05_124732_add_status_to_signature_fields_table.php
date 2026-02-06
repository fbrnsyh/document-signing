<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('signature_fields', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('is_required');
            $table->timestamp('signed_at')->nullable()->after('status');
            $table->json('metadata')->nullable()->after('signed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('signature_fields', function (Blueprint $table) {
            $table->dropColumn(['status', 'signed_at', 'metadata']);
        });
    }
};
