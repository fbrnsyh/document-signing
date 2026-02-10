<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $fillable = [
        'uploader_id',
        'folder_id',
        'title',
        'tags',
        'original_filename',
        'file_path',
        'file_size',
        'status',
        'signing_mode',
        'completed_at',
        'archived_at',
    ];

    protected $casts = [
        'tags' => 'json',
        'completed_at' => 'datetime',
        'archived_at' => 'datetime',
    ];

    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploader_id');
    }

    public function folder()
    {
        return $this->belongsTo(Folder::class);
    }

    public function workflow()
    {
        return $this->hasOne(Workflow::class);
    }

    public function signers()
    {
        return $this->hasManyThrough(Signer::class, Workflow::class);
    }
}
