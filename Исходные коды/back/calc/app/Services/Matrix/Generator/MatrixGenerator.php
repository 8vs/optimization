<?php

declare(strict_types=1);

namespace App\Services\Matrix\Generator;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Contracts\Support\Arrayable;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

use function count;
use function reset;

class MatrixGenerator implements Arrayable
{
    private array $performers;

    /**
     * @var Collection<Task>
     */
    private Collection $tasks;
    /** @var Project */
    private Model $project;

    public function __construct(
        Model $project,
        Collection $tasks,
        array $performers
    ) {
        $this->project = $project;
        $this->tasks = $tasks;
        $this->performers = $performers;
    }

    protected function getSizeMatrix(): array
    {
        return [
            'N' => $this->tasks->count(),
            'M' => count(reset($this->performers)) // у всех задач равное кол-во исполнителей
        ];
    }

    protected function getTaskChar(): array
    {
        $p = $t = $e = $r = [];
        foreach ($this->tasks as $task) {
            $chars = $task->getCharacteristic();
            $p[] = $chars[0];
            $t[] = $chars[1];
            $e[] = $chars[2];
            $r[] = $chars[3];
        }

        return [$p, $t, $e, $r];
    }

    protected function getPerformersChar(): array
    {
        $result = [];
        foreach ($this->performers as $performer) {
            foreach ($performer as $k => $item) {
                $result['cost_matrix'][$k][] = $item[0];
                $result['time_matrix'][$k][] = $item[1];
                $result['competence_matrix'][$k][] = $item[2];
                $result['risk_matrix'][$k][] = $item[3];
            }
        }

        return $result;
    }

    protected function getCoefficientsChar(): array
    {
        return $this->project->getCharacteristic();
    }

    public function toArray(): array
    {
        return [
            'size_matrix' => $this->getSizeMatrix(),
            'coefficients_char' => $this->getCoefficientsChar(),
            'task_char' => $this->getTaskChar(),
            'performers_char' => $this->getPerformersChar(),
        ];
    }
}
