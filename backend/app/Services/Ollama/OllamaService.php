<?php

namespace App\Services\Ollama;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OllamaService
{
    private $baseUrl;
    private $model;

    public function __construct()
    {
        $this->baseUrl = env('OLLAMA_BASE_URL');
        $this->model = env('OLLAMA_MODEL');
    }

    public function generateResponse($prompt)
    {
        Log::info('Kirim prompt ke Ollama', [
            'model' => $this->model,
            'prompt_preview' => substr($prompt, 0, 200) . '...' // biar log gak kepanjangan
        ]);

        try {
            $response = Http::timeout(120)
                ->post($this->baseUrl . "/api/generate", [
                    'model' => $this->model,
                    'prompt' => "Anda adalah Chris, asisten virtual dari Program Studi Teknologi Informasi UKSW. "
                        . "Jawablah dengan sopan dan informatif dalam Bahasa Indonesia.\n\n"
                        . "User: " . $prompt,
                    'temperature' => 0.7,
                    'stream' => false
                ]);

            Log::info('Response dari Ollama', [
                'status' => $response->status(),
                'body'   => $response->body()
            ]);

            if ($response->failed()) {
                Log::error('Ollama API Error: ' . $response->body());
                throw new \Exception('Gagal mendapatkan respons dari Model: ' . $response->status());
            }

            $data = $response->json();

            // ✅ Format khas Ollama
            if (isset($data['response'])) {
                return $data['response'];
            }

            // ✅ Fallback kalau suatu hari Ollama support format OpenAI
            if (isset($data['choices'][0]['message']['content'])) {
                return $data['choices'][0]['message']['content'];
            }

            Log::error($this->model . ' Response format tidak dikenali: ' . json_encode($data));
            throw new \Exception('Format respons tidak sesuai dari ' . $this->model);
        } catch (\Exception $e) {
            Log::error('Ollama Service Error: ' . $e->getMessage());
            throw new \Exception('Terjadi kesalahan: ' . $e->getMessage());
        }
    }
}
