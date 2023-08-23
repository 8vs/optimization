<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Enums\ProjectStatuses;
use App\Models\Performer;
use App\Models\Project;
use App\Models\Task;
use App\Repositories\Interfaces\PerformerRepositoryInterface;
use App\Repositories\Interfaces\ProjectRepositoryInterface;
use App\Repositories\Interfaces\TaskRepositoryInterface;
use App\Services\Matrix\Generator\MatrixGenerator;
use App\Services\Matrix\MatrixCalculateService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use function count;
use function is_string;
use function json_decode;
use function sprintf;

final class ProjectController extends Controller
{
    private ProjectRepositoryInterface $projectRepository;
    private TaskRepositoryInterface $taskRepository;
    private PerformerRepositoryInterface $performerRepository;
    private MatrixCalculateService $matrixCalculateService;

    public function __construct(
        ProjectRepositoryInterface   $projectRepository,
        TaskRepositoryInterface      $taskRepository,
        PerformerRepositoryInterface $performerRepository,
        MatrixCalculateService       $matrixCalculateService
    )
    {
        $this->projectRepository = $projectRepository;
        $this->taskRepository = $taskRepository;
        $this->performerRepository = $performerRepository;
        $this->matrixCalculateService = $matrixCalculateService;
    }

    public function view(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Project,id',
        ]);

        $projectId = (int)$data['id'];
        $project = $this->projectRepository->getById($projectId)->toArray();

        $final = [];
        if (!empty($project['result']) && $project['status'] === ProjectStatuses::FINISHED) {
            $result = json_decode($project['result'], true);
            $project['result'] = $result;
            $final = $this->matrixCalculateService->findIndexesMinimumValuesByMatrix($result);
        }

        $characteristic = $project['characteristic'];
        if (!empty($characteristic) && is_string($characteristic)) {
            $project['characteristic'] = json_decode($characteristic, true);
        }

        $tasks = $this->taskRepository->getTasksByProjectId($projectId);

        $performers = [];
        $links = [];
        /** @var Task $task */
        foreach ($tasks as $id => $task) {
            $taskPerformers = $this->performerRepository->getPerformersByTaskId($task->getId());
            /** @var Performer $performer */
            foreach ($taskPerformers as $performer) {
                $performers[$id][] = sprintf(
                    'Для задачи "%s" подходит исполнитель "%s"',
                    $task->getName(),
                    $performer->getName()
                );
            }

            $links[] = $task->toArray() + ['performers' => $taskPerformers->toArray()];
        }

        $optimizationResult = [];
        for ($z = 0; $z < count($final); $z++) {
            for ($i = $z; $i < count($performers); $i++) {
                $optimizationResult[$i] = $performers[$i][$z];
            }
        }

        $appends = !empty($final)
            ? [
                'idx' => $final,
                'performers' => $optimizationResult,
            ]
            : [];

        $project['links'] = $links;
        $appends['canComplete'] = $project['status'] === ProjectStatuses::STARTED
            && (static function () use ($links): bool {
                if (empty($links)) {
                    return false;
                }

                $currentCountPerformers = 0;
                foreach ($links as $task) {
                    if (empty($task['performers'])) {
                        return false;
                    }

                    $countPerformersTask = count($task['performers']);
                    if (!$currentCountPerformers) {
                        $currentCountPerformers = $countPerformersTask;
                    }

                    if ($currentCountPerformers !== $countPerformersTask) {
                        return false;
                    }
                }

                return true;
            })();

        return $this->createResponseSuccess($project + $appends);
    }

    public function show(): JsonResponse
    {
        $projects = $this->projectRepository->getAll();

        return $this->createResponseSuccess($projects->toArray());
    }

    public function showDeleted(): JsonResponse
    {
        $projects = $this->projectRepository->getAllDeleted();

        return $this->createResponseSuccess($projects->toArray());
    }

    public function add(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|min:5',
            'characteristic' => 'required|json',
        ]);

        $project = $this->projectRepository->createProject($data);

        return $this->createResponseSuccess($project->toArray());
    }

    public function edit(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Project,id',
            'title' => 'string|min:5',
            'characteristic' => 'json',
        ]);

        $projectId = $data['id'];
        unset($data['id']);
        $updated = $this->projectRepository->editProjectByData($projectId, $data);

        if (!$updated) {
            return $this->createResponseFail('Failed update with data', $data);
        }

        $project = $this->projectRepository->getById($projectId);

        return $this->createResponseSuccess($project->toArray());
    }

    public function delete(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Project,id',
        ]);

        $projectId = (int)$data['id'];

        /** @var Project $project */
        $project = $this->projectRepository->getById($projectId);
        if ($project->isFinished()) {
            return $this->createResponseFail('You cannot delete a completed project');
        }

        if ($project->getStatus() === ProjectStatuses::DELETED) {
            return $this->createResponseFail('The project has already been deleted.');
        }

        $updateDeleted = $this->projectRepository->changeStatus($projectId, ProjectStatuses::DELETED);

        if (!$updateDeleted) {
            return $this->createResponseFail('The project was not deleted.');
        }

        return $this->createResponseSuccess([]);
    }

    public function restore(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Project,id',
        ]);

        $projectId = (int)$data['id'];

        /** @var Project $project */
        $project = $this->projectRepository->getById($projectId);
        if ($project->isFinished()) {
            return $this->createResponseFail('You cannot restore a completed project');
        }

        if ($project->getStatus() === ProjectStatuses::STARTED) {
            return $this->createResponseFail('The project has already been restore.');
        }

        $updateDeleted = $this->projectRepository->changeStatus($projectId, ProjectStatuses::STARTED);
        if (!$updateDeleted) {
            return $this->createResponseFail('The project was not deleted.');
        }

        return $this->createResponseSuccess([]);
    }

    public function complete(Request $request): JsonResponse
    {
        $data = $request->validate([
            'id' => 'required|integer|exists:App\Models\Project,id',
        ]);

        $projectId = (int)$data['id'];
        /** @var Project $project */
        $project = $this->projectRepository->getById($projectId);
        if ($project->isFinished()) {
            return $this->createResponseFail('You cannot finished a completed project');
        }

        $tasks = $this->taskRepository->getTasksByProjectId($projectId);

        $performers = [];
        /** @var Task $task */
        foreach ($tasks as $task) {
            $taskPerformers = $this->performerRepository->getPerformersByTaskId($task->getId());
            foreach ($taskPerformers as $performer) {
                $performers[$task->getId()][] = $performer->getCharacteristic();
            }
        }

        $projectMatrix = (new MatrixGenerator($project, $tasks, $performers))->toArray();
        $calculationResult = $this->matrixCalculateService->process($projectMatrix);

        try {
            $completed = $this->projectRepository->completeProject($projectId, $calculationResult);
        } catch (Exception) {
            $completed = false;
        }

        if (!$completed) {
            return $this->createResponseFail(
                'It was not possible to make calculations and complete the project.'
            );
        }

        $actuallyProject = $this->projectRepository->getById($projectId)->toArray();

        return $this->createResponseSuccess($actuallyProject);
    }
}
