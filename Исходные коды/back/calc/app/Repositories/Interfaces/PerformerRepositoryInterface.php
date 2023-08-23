<?php

declare(strict_types=1);

namespace App\Repositories\Interfaces;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

interface PerformerRepositoryInterface
{
    public function getPerformersByTaskId(int $taskId): Collection;

    public function getPerformerById(int $performerId): ?Model;

    public function createPerformer(array $data): Model;

    public function editPerformerByData(array $data): int;

    public function deletePerformerById(int $performerId): ?bool;
}
