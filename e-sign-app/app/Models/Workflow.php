<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Workflow extends Model
{
    protected $fillable = [
        'document_id',
        'mode',
        'status',
    ];

    public function document()
    {
        return $this->belongsTo(Document::class);
    }

    public function signers()
    {
        return $this->hasMany(Signer::class)->orderBy('order');
    }

    public function fields()
    {
        return $this->hasMany(SignatureField::class);
    }
}
