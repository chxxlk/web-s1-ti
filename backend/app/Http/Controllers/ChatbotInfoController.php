<?php

namespace App\Http\Controllers;
use App\Services\RagService;
use Illuminate\Http\Request;

class ChatbotInfoController extends Controller
{
    protected $ragService;

    /**
     * Construct a new ChatbotInfoController instance.
     *
     * @param RagService $ragService
     */
    public function __construct(RagService $ragService) // UPDATE TYPE HINT
    {
        $this->ragService = $ragService;
    }

    /**
     * Get the chatbot info.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getInfo()
    {
        try {
            $info = $this->ragService->getChatbotInfo();

            return response()->json([
                'success' => true,
                'data' => $info,
                'message' => 'Informasi chatbot berhasil diambil'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Gagal mengambil informasi chatbot: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the welcome message.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getWelcomeMessage()
    {
        $info = $this->ragService->getChatbotInfo();

        $welcomeMessage = "Halo! 👋 Saya {$info['name']}, {$info['role']} dari {$info['department']} di {$info['university']}. ";
        $welcomeMessage .= "Saya siap membantu Anda dengan informasi seputar program studi Teknik Informatika. Ada yang bisa saya bantu?";

        return response()->json([
            'success' => true,
            'data' => [
                'message' => $welcomeMessage,
                'identity' => $info
            ]
        ]);
    }
}
