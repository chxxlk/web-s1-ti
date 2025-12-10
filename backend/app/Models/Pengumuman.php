<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengumuman extends Model
{
    use HasFactory;

    protected $table = 'pengumuman'; 
    protected $fillable = ['judul', 'isi', 'file', 'kategori', 'user_id', 'created_at', 'update_at']; 
    //kalau mau liat urlnya di json reponse
    //protected $appends = ['file_url'];
    
    public function getFileUrlAttribute()
    {
    return $this->file ? asset("storage/{$this->file}") : null;
    }
    // ambil foregin key dari admin id
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}