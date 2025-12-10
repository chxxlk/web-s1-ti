<?php

namespace App\Observers;

use App\Models\Embedding;
use App\Models\Pengumuman;
use App\Services\EmbeddingService;

class PengumumanObeserver
{
    public function __construct(public EmbeddingService $embeddingService)
    {
        
    }

    public function saved(Pengumuman $pengumuman)
    {
        $text = implode(' ', [
            $pengumuman->judul,
            $pengumuman->isi,
            $pengumuman->kategori ?? ''
        ]);

        $vector = $this->embeddingService->generateEmbedding($text);

        if ($vector) {
            Embedding::updateOrCreate(
              [
                'table_name' => 'pengumuman',
                'row_id' => $pengumuman->id
              ],
              [
                'vector' => $vector
              ]
            );
        }
    }
}
