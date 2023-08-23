<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface ProjectRepositoryInterface
{
    public function editProjectByData(int $projectId, array $data): bool;

    public function getById(int $projectId): ?Model;

    public function changeStatus(int $projectId, int $status): bool;

    public function completeProject(int $projectId, array $result): bool;

    public function getAllDeleted(): Collection;

    public function getAll(): Collection;

    public function createProject(array $data): Model;
}
