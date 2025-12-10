<?php

namespace App\Observers;

use App\Models\Embedding;
use App\Models\Lowongan;
use App\Services\EmbeddingService;

class LowonganObserver
{
    // 'judul', 'deskripsi', 'file', 'link_pendaftaran', 'user_id', 'created_at', 'update_at'
    public function __construct(public EmbeddingService $embedding_service) {}

    public function saved(Lowongan $lowongan)
    {
        $text = implode(' ', [
            $lowongan->judul,
            $lowongan->deskripsi,
            $lowongan->link_pendaftaran,
            $lowongan->created_at ?? ''
        ]);

        $vector = $this->embedding_service->generateEmbedding($text);

        if ($vector) {
            Embedding::updateOrCreate(
                [
                    'table_name' => 'lowongan',
                    'row_id' => $lowongan->id
                ],
                [
                    'vector' => $vector
                ]
            );
        }
    }
}
