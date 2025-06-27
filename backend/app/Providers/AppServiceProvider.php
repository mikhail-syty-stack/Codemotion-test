<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\OfferService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(OfferService::class, function ($app) {
            return new OfferService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
