<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Embedding extends Model
{
    protected $fillable = [
        'table_name',
        'row_id',
        'vector',
    ];

    // pgvector akan simpan ke array float
    protected $casts = [
        'vector' => 'array',
    ];
}