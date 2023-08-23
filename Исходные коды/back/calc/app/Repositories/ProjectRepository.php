<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Http\Enums\ProjectStatuses;
use App\Models\Project;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use function json_encode;

final class ProjectRepository implements ProjectRepositoryInterface
{
    public function getById(int $projectId): ?Model
    {
        return Project::query()->where('id', '=', $projectId)->first();
    }

    public function editProjectByData(int $projectId, array $data): bool
    {
        return $this->getById($projectId)->update($data);
    }

    public function changeStatus(int $projectId, int $status): bool
    {
        return $this->getById($projectId)->update(['status' => $status]);
    }

    public function getAll(): Collection
    {
        return Project::query()
//            ->where('status', '!=', ProjectStatuses::DELETED)
            ->get(['id', 'title', 'status', 'updated_at']);
    }

    public function getAllDeleted(): Collection
    {
        return Project::query()
            ->where('status', '=', ProjectStatuses::DELETED)
            ->get(['id', 'title', 'status', 'updated_at']);
    }

    public function completeProject(int $projectId, array $result): bool
    {
        return $this
            ->getById($projectId)
            ->update(['status' => ProjectStatuses::FINISHED, 'result' => json_encode($result)]);
    }

    public function createProject(array $data): Model
    {
        return Project::query()->create($data);
    }
}
