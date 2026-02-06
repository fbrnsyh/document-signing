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
        Schema::create('signature_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('workflow_id')->constrained()->onDelete('cascade');
            $table->foreignId('signer_id')->constrained()->onDelete('cascade');
            $table->integer('page_number');
            $table->decimal('x_position', 5, 2);
            $table->decimal('y_position', 5, 2);
            $table->decimal('width', 5, 2);
            $table->decimal('height', 5, 2);
            $table->enum('field_type', ['signature', 'initial', 'date', 'text']);
            $table->boolean('is_required')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('signature_fields');
    }
};
