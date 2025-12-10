<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*', 'files/*'],
    'allowed_methods' => ['*'], // Bisa diganti dengan ['GET', 'POST', 'PUT', 'DELETE'] jika perlu
    'allowed_origins' => ['*',], // Local Hostnya di ganti ya 
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => ['Content-Disposition'], // Untuk fiel bisa diakses langsung
    'max_age' => 0,
    'supports_credentials' => true, // Biarkan true jika pakai authentication seperti Sanctum
];
