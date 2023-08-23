<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Repositories\Interfaces\TaskRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class TaskController extends Controller
{
    private TaskRepositoryInterface $taskRepository;

    public function __construct(TaskRepositoryInterface $taskRepository)
    {
        $this->taskRepository = $taskRepository;
    }

    public function show(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|integer|exists:App\Models\Project,id'
        ]);

        $projectId = (int)$data['project_id'];
        $tasks = $this->taskRepository->getTasksByProjectId($projectId);

        return $this->createResponseSuccess($tasks->toArray());
    }

    public function add(Request $request): JsonResponse
    {
        $data = $request->validate([
            'project_id' => 'required|integer|exists:App\Models\Project,id',
            'characteristic' => 'required|json',
            'name' => 'required|string'
        ]);

        $task = $this->taskRepository->createTask($data);

        return $this->createResponseSuccess($task->toArray());
    }

    public function edit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Task,id',
            'project_id' => 'integer|exists:App\Models\Project,id',
            'characteristic' => 'json',
        ]);

        $taskId = $data['id'];
        unset($data['id']);
        $updated = $this->taskRepository->editTaskByData($data);

        if (!$updated) {
            return $this->createResponseFail('Failed update with data', $data);
        }

        $task = $this->taskRepository->getTaskById($taskId);

        return $this->createResponseSuccess($task->toArray());
    }

    public function delete(Request $request): Response
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Task,id',
        ]);

        // todo: сделать невозможность удаление задачи, если она из завершенного проекта

        $deleted = $this->taskRepository->deleteTaskById($data['id']);

        if (!$deleted) {
            return $this->createResponseFail('The task has not been deleted', $data);
        }

        return $this->createResponseSuccess([]);
    }
}
