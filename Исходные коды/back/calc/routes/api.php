<?php

declare(strict_types=1);

use App\Http\Controllers\BaseApiController;
use App\Http\Controllers\PerformerController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;

Route::get('/', [BaseApiController::class, 'index']);

Route::prefix('/tasks')->group(static function (): void {
    Route::get('/', [TaskController::class, 'show']);
    Route::post('/add', [TaskController::class, 'add']);
    Route::put('/edit', [TaskController::class, 'edit']);
    Route::put('/delete', [TaskController::class, 'delete']);
});

Route::prefix('/performers')->group(static function (): void {
    Route::get('/', [PerformerController::class, 'show']);
    Route::post('/add', [PerformerController::class, 'add']);
    Route::put('/edit', [PerformerController::class, 'edit']);
    Route::put('/delete', [PerformerController::class, 'delete']);
});

Route::prefix('/projects')->group(static function (): void {
    Route::get('/', [ProjectController::class, 'show']);
    Route::get('/show/deleted', [ProjectController::class, 'showDeleted']);
    Route::get('/view', [ProjectController::class, 'view']);
    Route::post('/add', [ProjectController::class, 'add']);
    Route::put('/edit', [ProjectController::class, 'edit']);
    Route::put('/restore', [ProjectController::class, 'restore']);
    Route::put('/delete', [ProjectController::class, 'delete']);
    Route::post('/complete', [ProjectController::class, 'complete']);
});
