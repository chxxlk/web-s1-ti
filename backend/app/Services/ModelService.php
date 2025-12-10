<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class ModelService
{
    private $apiKey;
    private $model;
    private $baseUrl;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->model = config('services.openrouter.model');
        $this->baseUrl = config('services.openrouter.base_url');

        if (!isset($this->apiKey) || !isset($this->baseUrl) || !isset($this->model)) {
            Log::warning(throw new \Exception('Missing OpenRouter API key, base URL, or model name.'));
        }
    }

    /**
     * Streaming version: mengirim potongan teks lewat callback.
     * 
     * @param string $prompt
     * @param callable $onChunk menerima satu string (potongan teks)
     * @return void
     * @throws \Exception
     */
    public function generateStreamedResponse(string $prompt, callable $onChunk): void
    {
        try {
            $response = Http::timeout(120)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                    'HTTP-Referer' => env('APP_URL'),
                    'X-Title' => 'S1 TI Chatbot',
                    'X-Accel-Buffering: no'
                ])
                ->withOptions([
                    'stream' => true,
                ])
                ->post($this->baseUrl . '/chat/completions', [
                    'model' => $this->model,
                    'messages' => [
                        [
                            'role' => 'system',
                            'content' => 'Anda adalah Mr. Wacana, asisten virtual dari Program Studi Teknologi Informasi UKSW (Universitas Kristen Satya Wacana). Jawablah dengan sopan dan informatif dalam Bahasa Indonesia.', 
                        ],
                        [
                            'role' => 'user',
                            'content' => $prompt
                        ]
                    ],
                    'temperature' => 0.5,
                    'stream' => true
                ]);

            $stream = $response->toPsrResponse()->getBody();
            $buffer = '';

            while (!$stream->eof()) {
                $chunk = $stream->read(1024);
                $buffer .= $chunk;

                while (($pos = strpos($buffer, "\n")) !== false) {
                    $line = substr($buffer, 0, $pos);
                    $buffer = substr($buffer, $pos + 1);
                    $line = trim($line);
                    if ($line === '' || strpos($line, ':') === 0) {
                        continue;
                    }
                    if (str_starts_with($line, 'data: ')) {
                        $json = substr($line, strlen('data: '));
                        if ($json === '[DONE]') {
                            // selesai
                            break 2;
                        }
                        $data = json_decode($json, true);
                        if (isset($data['choices'][0]['delta']['content'])) {
                            $onChunk($data['choices'][0]['delta']['content']);
                        }
                    }
                }
            }
        } catch (\Exception $e) {
            Log::error('OpenRouter Service Error: ' . $e->getMessage());
            // Lanjut lempar agar upper layer tahu
            throw new \Exception('Terjadi kesalahan: ' . $e->getMessage());
        }

    }

    /**
     * (Opsional) Versi “non-streaming” atau untuk fallback,
     * jika kamu ingin mendukung keduanya.
     */
    public function generateResponseOnce(string $prompt): string
    {
        $response = Http::timeout(120)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
                'HTTP-Referer' => env('APP_URL'),
                'X-Title' => 'S1 TI Chatbot'
            ])
            ->post($this->baseUrl . '/chat/completions', [
                'model' => $this->model,
                'messages' => [
                    [
                        'role' => 'system',
                        'content' => 'Anda adalah Mr.Wacana, asisten virtual dari Program Studi Teknologi Informasi UKSW (Universitas Kristen Satya Wacana). Jawablah dengan sopan dan informatif dalam Bahasa Indonesia.'
                    ],
                    [
                        'role' => 'user',
                        'content' => $prompt
                    ]
                ],
                'temperature' => 0.7,
                'stream' => false
            ]);

        if ($response->failed()) {
            Log::error('OpenRouter API Error (non-stream): ' . $response->body());
            throw new \Exception('Gagal mendapatkan respons non-stream');
        }
        $data = $response->json();
        if (isset($data['choices'][0]['message']['content'])) {
            return $data['choices'][0]['message']['content'];
        }
        Log::error('OpenRouter non-stream response format: ' . json_encode($data));
        throw new \Exception('Format respons tidak sesuai (non-stream)');
    }
}
