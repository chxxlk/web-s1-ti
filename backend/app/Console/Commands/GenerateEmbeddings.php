<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\EmbeddingService;
use App\Models\Embedding;
use Illuminate\Support\Facades\DB;

class GenerateEmbeddings extends Command
{
    protected $signature = 'embeddings:generate';
    protected $description = 'Generate embeddings untuk tabel pengumuman, lowongan, dosen';

    public function handle(EmbeddingService $service)
    {
        $tables = ['pengumuman', 'lowongan', 'dosen'];

        foreach ($tables as $table) {
            $this->info("🔄 Proses tabel: {$table}");

            $rows = DB::table($table)->get();

            foreach ($rows as $row) {
                // Gabung semua kolom jadi string
                $text = implode(' ', array_filter((array)$row));

                // Generate embedding
                $vec = $service->generateEmbedding($text);

                if ($vec) {
                    Embedding::updateOrCreate(
                        ['table_name' => $table, 'row_id' => $row->id],
                        ['vector' => $vec]
                    );
                    $this->info("✔️ Row {$row->id} processed");
                } else {
                    $this->warn("   ⚠️ Row {$row->id} skipped (embedding gagal)");
                }
            }

            $this->info("✅ Selesai: {$table}");
        }

        $this->info("🎉 Semua tabel sudah diproses!");
    }
}
