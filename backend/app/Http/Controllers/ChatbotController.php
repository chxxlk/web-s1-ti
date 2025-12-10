<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\StreamedResponse;
use App\Services\RagService;

class ChatbotController extends Controller
{
    public function chatStream(Request $request)
    {
        if ($request->isMethod('OPTIONS')) {
            return response('', 200, [
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
            ]);
        }

        $request->validate([
            'message' => 'required|string',
            'session_id' => 'nullable|string'
        ]);

        $message = $request->input('message');
        $sessionId = $request->input('session_id', 'default');

        $response = new StreamedResponse(
            function () use ($message, $sessionId) {
                $ragService = app(\App\Services\RagService::class);
                $accumulated = '';

                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();


                $ragService->queryWithContextStream($message, function ($chunk) use (&$accumulated) {
                    echo "data: " . json_encode(['chunk' => $chunk]) . "\n\n";
                    if (ob_get_level() > 0) {
                        ob_flush();
                    }
                    flush();
                    $accumulated .= $chunk;
                });

                echo "data: " . json_encode(['done' => true]) . "\n\n";
                if (ob_get_level() > 0) {
                    ob_flush();
                }
                flush();

                try {
                    DB::table('chat_history')->insert([
                        'user_message' => $message,
                        'bot_response' => $accumulated,
                        'session_id' => $sessionId,
                        'source' => 'rag',
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                } catch (\Throwable $e) {
                    Log::error("Gagal menyimpan histori chat: " . $e->getMessage());
                }
            },
            200,
            [
                'Content-Type' => 'text/event-stream',
                'Cache-Control' => 'no-cache',
                'Connection' => 'keep-alive',
                'X-Accel-Buffering' => 'no',

                // header CORS di sini
                'Access-Control-Allow-Origin' => '*',
                'Access-Control-Allow-Methods' => 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers' => 'Content-Type, Authorization, X-Requested-With',
            ]
        );

        return $response;
    }


    public function chat(Request $request)
    {
        if ($request->isMethod('OPTIONS')) {
            return $this->addCorsHeaders(response()->json([]));
        }

        $request->validate([
            'message' => 'required|string',
            'session_id' => 'nullable|string'
        ]);

        $message = $request->input('message');
        $sessionId = $request->input('session_id', 'default');

        try {
            $ragService = app(RagService::class);
            $full = '';
            $ragService->queryWithContextStream($message, function ($chunk) use (&$full) {
                $full .= $chunk;
            });
            $this->saveToHistory($message, $full, $sessionId, 'rag');

            return $this->addCorsHeaders(response()->json([
                'success' => true,
                'response' => $full,
                'source' => 'rag',
                'session_id' => $sessionId
            ], 200));
        } catch (\Exception $e) {
            Log::error('Chat error: ' . $e->getMessage());
            return $this->addCorsHeaders(response()->json([
                'success' => false,
                'error' => 'Chat error: ' . $e->getMessage()
            ], 500));
        }
    }

    private function addCorsHeaders($response)
    {
        return $response
            ->header('Access-Control-Allow-Origin', '*')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            ->header('Access-Control-Allow-Credentials', 'true');
    }

    private function saveToHistory($userMessage, $botResponse, $sessionId, $source)
    {
        DB::table('chat_history')->insert([
            'user_message' => $userMessage,
            'bot_response' => $botResponse,
            'session_id' => $sessionId,
            'source' => $source,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }

    public function getHistory(Request $request)
    {
        $sessionId = $request->input('session_id', 'default');

        $history = DB::table('chat_history')
            ->where('session_id', $sessionId)
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json($history);
    }

    public function testConnection()
    {
        return response()->json([
            'message' => 'Backend Laravel is working!',
            'timestamp' => now()
        ]);
    }

    public function testDatabase()
    {
        try {
            DB::connection()->getPdo();
            $pengumumanCount = DB::table('pengumuman')->count();

            return response()->json([
                'message' => 'Database connection successful',
                'pengumuman_count' => $pengumumanCount,
                'database' => DB::connection()->getDatabaseName()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Database connection failed: ' . $e->getMessage()
            ], 500);
        }
    }


    public function testOpenRouter(Request $request)
    {
        try {
            $openRouterService = new \App\Services\ModelService();
            $testResponse = $openRouterService->generateResponseOnce('Halo, perkenalkan dirimu!');

            return response()->json([
                'success' => true,
                'test_response' => $testResponse,
                'message' => 'OpenRouter connection successful'
            ], 200, [], JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'message' => 'OpenRouter connection failed'
            ], 500, [], JSON_PRETTY_PRINT);
        }
    }

    public function testEmbedding(Request $request)
    {
        try {
            $embedingService = new \App\Services\EmbeddingService();
            $testResponse = $embedingService->generateEmbedding('Halo');

            return response()->json([
                'success' => true,
                'test_response' => substr(json_encode($testResponse), 0, 100) . '...',
                'message' => 'Huggingface connection successful'
            ], 200, [], JSON_PRETTY_PRINT);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'message' => 'Embedding connection failed'
            ], 500, [], JSON_PRETTY_PRINT);
        }
    }
}
