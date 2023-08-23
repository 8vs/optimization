<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Task;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

final class TaskRepository implements TaskRepositoryInterface
{
    public function getTasksByProjectId(int $projectId): Collection
    {
        return Task::query()->where('project_id', '=', $projectId)->get();
    }

    public function getTaskById(int $taskId): ?Model
    {
        return Task::query()->where('id', '=', $taskId)->first();
    }

    public function createTask(array $data): Model
    {
        return Task::query()->create($data);
    }

    public function editTaskByData(array $data): int
    {
        return Task::query()->update($data);
    }

    public function deleteTaskById(int $taskId): ?bool
    {
        return Task::query()->where('id', '=', $taskId)->first()->delete();
    }
}
