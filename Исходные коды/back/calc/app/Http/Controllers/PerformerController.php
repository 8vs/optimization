<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Repositories\Interfaces\PerformerRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class PerformerController extends Controller
{
    private PerformerRepositoryInterface $performerRepository;

    public function __construct(PerformerRepositoryInterface $performerRepository)
    {
        $this->performerRepository = $performerRepository;
    }

    public function show(Request $request): JsonResponse
    {
        $data = $request->validate([
            'task_id' => 'required|integer|exists:App\Models\Task,id'
        ]);

        $taskId = (int)$data['task_id'];
        $performers = $this->performerRepository->getPerformersByTaskId($taskId);

        return $this->createResponseSuccess($performers->toArray());
    }

    public function add(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => 'required|string',
            'task_id' => 'required|integer|exists:App\Models\Task,id',
            'characteristic' => 'required|json',
        ]);

        $performer = $this->performerRepository->createPerformer($data);

        return $this->createResponseSuccess($performer->toArray());
    }

    public function edit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Performer,id',
            'task_id' => 'integer|exists:App\Models\Task,id',
            'characteristic' => 'json',
        ]);

        $performerId = $data['id'];
        unset($data['id']);
        $updated = $this->performerRepository->editPerformerByData($data);

        if (!$updated) {
            return $this->createResponseFail('Failed update with data', $data);
        }

        $performer = $this->performerRepository->getPerformerById($performerId);

        return $this->createResponseSuccess($performer->toArray());
    }

    public function delete(Request $request): Response
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Performer,id',
        ]);

        $deleted = $this->performerRepository->deletePerformerById($data['id']);

        if (!$deleted) {
            return $this->createResponseFail('The performer has not been deleted', $data);
        }

        return $this->createResponseSuccess([]);
    }
}
