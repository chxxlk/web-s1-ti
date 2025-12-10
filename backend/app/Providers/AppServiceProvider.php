<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Schema;

use App\Models\Dosen;
use App\Models\Lowongan;
use App\Models\Pengumuman;
use App\Observers\DosenObserver;
use App\Observers\LowonganObserver;
use App\Observers\PengumumanObeserver;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);
        Pengumuman::observe(PengumumanObeserver::class);
        Lowongan::observe(LowonganObserver::class);
        Dosen::observe(DosenObserver::class);
    }
}
