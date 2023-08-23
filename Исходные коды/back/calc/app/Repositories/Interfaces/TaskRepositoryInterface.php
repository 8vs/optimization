<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface TaskRepositoryInterface
{
    public function getTasksByProjectId(int $projectId): Collection;

    public function editTaskByData(array $data): int;

    public function getTaskById(int $taskId): ?Model;

    public function createTask(array $data): Model;

    public function deleteTaskById(int $taskId): ?bool;
}
