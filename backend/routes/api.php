<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\LowonganController;
use App\Http\Controllers\BeritaAlumniController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use App\Http\Controllers\DosenController;
use App\Http\Controllers\ChatbotController;
use App\Http\Controllers\ChatbotInfoController;


// AUTH
Route::post('/login', [AuthController::class, 'login']); // Login 
Route::post('/google-login', [AuthController::class, 'googleLogin']); // Google Login
// Route::post('/register', [AuthController::class, 'register']); // Register is disabled


Route::get('/files/{folder}/{filename}', function ($folder, $filename) {
    $path = storage_path("app/public/{$folder}/{$filename}");

    if (!file_exists($path)) {
        return response()->json(['message' => 'File tidak ditemukan'], 404);
    }

    return response()->file($path, [
        'Access-Control-Allow-Origin' => '*',
        'Content-Type' => mime_content_type($path),
    ]);
});

// PENGUMUMAN/Lowongan/berita-alumni 
// API untuk Search ( GET /pengumuman?search=apasaja )/ (GET /lowongan?search=apasaja)
// API untuk pagination (GET /pengumuman?per_page=10&page=1)

// Ian/Jauza kalo mau nampilin 3 data terakhir bisa pake GET /pengumuman?per_page=3, udah tak buat fileter latest sbg default
// Atau mau tak buatin api khusus buat nampilin 3 data terakhir biar gampang juga bisa bilang ae

/* 
default per_page = 10
Api untuk pagination contoh misal : pengen 10 pengumuman pertama = GET /api/pengumuman?per_page=10&page=1 tanpa ?per_page=1 juga bisa nanti ikut default
*/

// API UNTUK FILTER TANGGAL/MENGURUTKAN DATA

// Format tanggal YYYY-MM-DD kalo mau ganti bilang ae 

// Contoh filter tanggal GET /api/lowongan?from_date=2024-12-01&to_date=2025-01-31
// Contoh filter Urutan data dari oldest kalau mau latest sudah secara default GET /api/lowongan?sort_by=oldest

// Contoh API LENGKAP SEMUA FILTER 
// GET /api/berita-alumni?search=wisuda&from_date=2025-01-01&to_date=2025-03-31&per_page=5&sort_by=oldest

//BUAT BERITA ALUMNI SAMA PERSIS KAYA PENGUMUMAN/LOWONGAN

Route::get('/pengumuman', [PengumumanController::class, 'index']);
Route::get('/pengumuman/{id}', [PengumumanController::class, 'show']);
Route::get('/lowongan', [LowonganController::class, 'index']);
Route::get('/lowongan/{id}', [LowonganController::class, 'show']);
Route::get('/berita-alumni', [BeritaAlumniController::class, 'index']);
Route::get('/berita-alumni/{id}', [BeritaAlumniController::class, 'show']);
Route::get('/dosen', [DosenController::class, 'index']);
Route::get('/dosen/{id}', [DosenController::class, 'show']);

// Chatbot API
Route::get('/test', [ChatbotController::class, 'testConnection']);
Route::post('/chat', [ChatbotController::class, 'chat']);
Route::get('/chat/stream', [ChatbotController::class, 'chatStream']);
Route::get('/history', [ChatbotController::class, 'getHistory']);
Route::get('/chatbot/info', [ChatbotInfoController::class, 'getInfo']);
Route::get('/chatbot/welcome', [ChatbotInfoController::class, 'getWelcomeMessage']);
Route::get('/test/openrouter', [ChatbotController::class, 'testOpenRouter']);
Route::get('/test/hf', [ChatbotController::class, 'testEmbedding']);
Route::get('/test/db', [ChatbotController::class, 'testDatabase']);


// Hanya bisa diakses setelah login
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']); // Logout 
    Route::get('/me', [AuthController::class, 'me']); //untuk test data user yang sedang login

    // Hanya admin yang bisa buat/edit/hapus pengumuman/lowongan/berita alumni
    Route::middleware('superadmin')->group(function () {
        Route::get('/admin', [AuthController::class, 'indexAdmin']); // Register 
        Route::get('/admin/{id}', [AuthController::class, 'showAdmin']); // Register 
        Route::post('/admin', [AuthController::class, 'registerAdmin']); // Register 
        Route::post('/admin/{id}', [AuthController::class, 'updateAdmin']); // Register 
        Route::delete('/admin/{id}', [AuthController::class, 'destroyAdmin']); // Register 
    });

    Route::middleware('admin')->group(function () {
        Route::post('/pengumuman', [PengumumanController::class, 'store']);
        Route::post('/pengumuman/{id}', [PengumumanController::class, 'update']);
        Route::delete('/pengumuman/{id}', [PengumumanController::class, 'destroy']);
        Route::post('/lowongan', [LowonganController::class, 'store']);
        Route::post('/lowongan/{id}', [LowonganController::class, 'update']);
        Route::delete('/lowongan/{id}', [LowonganController::class, 'destroy']);
        Route::post('/berita-alumni', [BeritaAlumniController::class, 'store']);
        Route::post('/berita-alumni/{id}', [BeritaAlumniController::class, 'update']);
        Route::delete('/berita-alumni/{id}', [BeritaAlumniController::class, 'destroy']);
        Route::post('/dosen', [DosenController::class, 'store']);
        Route::post('/dosen/{id}', [DosenController::class, 'update']);
        Route::delete('/dosen/{id}', [DosenController::class, 'destroy']);
    });
});
