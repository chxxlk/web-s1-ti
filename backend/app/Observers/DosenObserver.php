<?php

namespace App\Observers;

use App\Models\Dosen;
use App\Models\Embedding;
use App\Services\EmbeddingService;

class DosenObserver
{
    public function __construct(public EmbeddingService $embedding_service)
    {
        
    }
    
    public function saved(Dosen $dosen)
    {
        $text = implode(' '. [
            // 'nama_lengkap', 'keahlian_rekognisi', 'email', 'external_link', 'photo'
            $dosen->nama_lengkap,
            $dosen->keahlian_rekognisi,
            $dosen->email,
            $dosen->external_link ?? ''
        ]);

        $vector = $this->embedding_service->generateEmbedding($text);

        if ($vector) {
            Embedding::updateOrCreate(
              [
                'table_name' => 'dosen',
                'row_id' => $dosen->id
              ],
              [
                'vector' => $vector
              ]
            );
        }
    }
}
