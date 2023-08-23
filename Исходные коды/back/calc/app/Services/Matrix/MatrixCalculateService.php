<?php

declare(strict_types=1);

namespace App\Services\Matrix;

use Matrix\Matrix as MatrixHelper;
use App\Services\Matrix\ValueObject\MatrixObject;

use function array_search;
use function min;

final class MatrixCalculateService
{
    protected const MAX_VALUE_COEFFICIENT = 10;

    /**
     * @uses self::getExampleMatrix()
     */
    public function process(array $data): array
    {
        $result = [];
        $matrix = MatrixObject::fromArray($data);

        for ($i = 0; $i < $matrix->getCountPerformers(); $i++) {
            for ($j = 0; $j < $matrix->getCountTasks(); $j++) {
                $result[$i][$j] = (
                    $matrix->getCostTask()[$j] < $matrix->getCostMatrix()[$i][$j]
                    || $matrix->getTimeTask()[$j] < $matrix->getTimeMatrix()[$i][$j]
                    || $matrix->getCompetenceTask()[$j] > $matrix->getCompetenceMatrix()[$i][$j]
                    || $matrix->getRiskTask()[$j] < $matrix->getRiskMatrix()[$i][$j]
                )
                    ? self::MAX_VALUE_COEFFICIENT
                    : $this->calculationViaExtremum($matrix, $i, $j);
            }
        }

        return $result;
    }

    public function findIndexesMinimumValuesByMatrix(array $matrix): array
    {
        $indexes = [];

        $matrixHelper = new MatrixHelper($matrix);
        foreach ($matrixHelper->columns() as $column) {
            if ($column instanceof MatrixHelper) {
                $current = $column->toArray();
                $indexes[] = array_search(min($current), $current);
            }
        }

        return $indexes;
    }

    protected function calculationViaExtremum(MatrixObject $matrix, int $x, int $y): float
    {
        $extremes = $matrix->toExtremumMatrixBuilder();

        return (
                $matrix->getCoefficientP() * (
                    ($extremes->getCost()->get()[$x][$y] - $extremes->getCost()->getMin())
                    / ($extremes->getCost()->getBetweenMaximumAndMinimum())
                )
            )
            +
            (
                $matrix->getCoefficientT() * (
                    ($extremes->getTime()->get()[$x][$y] - $extremes->getTime()->getMin())
                    / ($extremes->getTime()->getBetweenMaximumAndMinimum())
                )
            )
            +
            (
                1 - (
                    $matrix->getCoefficientE() * (
                        ($extremes->getCompetence()->get()[$x][$y] - $extremes->getCompetence()->getMin())
                        / ($extremes->getCompetence()->getBetweenMaximumAndMinimum())
                    )
                )
            )
            +
            (
                $matrix->getCoefficientR()
                * (
                    ($extremes->getRisk()->get()[$x][$y] - $extremes->getRisk()->getMin())
                    / ($extremes->getRisk()->getBetweenMaximumAndMinimum())
                )
            );
    }

    public function getExampleMatrix(): array
    {
        return [
            'coefficients_char' => [
                'P' => 0.4,
                'T' => 0.2,
                'E' => 0.2,
                'R' => 0.2,
            ],
            'size_matrix' => [
                'N' => 3, // количество задач
                'M' => 3, // количество исполнителей
            ],
            // характеристика задач
            // size 4 * N
            'task_char' => [
                [600, 300, 300], // * N
                [5, 3, 4], // * N
                [4, 2, 2], // * N
                [0.1, 0.15, 0.05], // * N
            ],
            // характеристики исполнителей
            'performers_char' => [
                // стоимость
                'cost_matrix' => [
                    [500, 350, 350],
                    [550, 270, 280],
                    [600, 300, 300],
                ],
                // время
                'time_matrix' => [
                    [3, 1.5, 3],
                    [4, 1.7, 2],
                    [4, 1.8, 2],
                ],
                // компетенция
                'competence_matrix' => [
                    [5, 3, 5],
                    [4, 3, 4],
                    [5, 3, 3],
                ],
                // риск невыполнения
                'risk_matrix' => [
                    [0.05, 0.1, 0.05],
                    [0.3, 0.15, 0.1],
                    [0.1, 0.1, 0.05],
                ],
            ]
        ];
    }
}
