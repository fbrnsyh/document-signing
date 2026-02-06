<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SignatureField extends Model
{
    protected $fillable = [
        'workflow_id',
        'signer_id',
        'page_number',
        'x_position',
        'y_position',
        'width',
        'height',
        'field_type',
        'is_required',
        'status',
        'signed_at',
        'metadata',
    ];

    protected $casts = [
        'signed_at' => 'datetime',
        'metadata' => 'array',
        'is_required' => 'boolean',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function signer()
    {
        return $this->belongsTo(Signer::class);
    }
}
