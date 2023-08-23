<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Performer;
use App\Repositories\Interfaces\PerformerRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

final class PerformerRepository implements PerformerRepositoryInterface
{
    public function getPerformersByTaskId(int $taskId): Collection
    {
        return Performer::query()->where('task_id', '=', $taskId)->get();
    }

    public function getPerformerById(int $performerId): ?Model
    {
        return Performer::query()->where('id', '=', $performerId)->first();
    }

    public function createPerformer(array $data): Model
    {
        return Performer::query()->create($data);
    }

    public function editPerformerByData(array $data): int
    {
        return Performer::query()->update($data);
    }

    public function deletePerformerById(int $performerId): ?bool
    {
        return Performer::query()->where('id', '=', $performerId)->first()->delete();
    }
}
