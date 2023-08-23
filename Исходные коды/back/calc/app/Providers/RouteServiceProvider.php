<?php

declare(strict_types=1);

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Routing\RouteRegistrar;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

use function base_path;

final class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        RateLimiter::for(
            'api',
            static fn (Request $request): Limit => Limit::perMinute(60)->by($request->ip())
        );

        $this->routes(
            static fn (): RouteRegistrar => Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'))
        );
    }
}
