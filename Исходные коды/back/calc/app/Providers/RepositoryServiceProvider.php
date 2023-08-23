<?php

declare(strict_types=1);

namespace App\Providers;

use App\Repositories\Interfaces\PerformerRepositoryInterface;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Repositories\PerformerRepository;
use App\Repositories\ProjectRepository;
use App\Repositories\TaskRepository;
use Illuminate\Support\ServiceProvider;

// use App\Services\Matrix\MatrixCalculateService;

class RepositoryServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(TaskRepositoryInterface::class, TaskRepository::class);
        $this->app->bind(ProjectRepositoryInterface::class, ProjectRepository::class);
        $this->app->bind(PerformerRepositoryInterface::class, PerformerRepository::class);
    }

    public function boot(): void
    {
//        $this->app->bind(MatrixCalculateService::class);
    }
}
