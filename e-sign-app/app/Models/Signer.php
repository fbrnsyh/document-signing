<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signer extends Model
{
    protected $fillable = [
        'workflow_id',
        'user_id',
        'email',
        'name',
        'order',
        'status',
        'signed_at',
        'rejection_reason',
    ];

    public function workflow()
    {
        return $this->belongsTo(Workflow::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function fields()
    {
        return $this->hasMany(SignatureField::class);
    }
}
