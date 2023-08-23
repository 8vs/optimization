<?php

declare(strict_types=1);

namespace App\Services\Matrix\Extremum;

use function call_user_func_array;
use function max;
use function min;

final class Matrix
{
    protected array $matrix;

    public function __construct(array $matrix)
    {
        $this->matrix = $matrix;
    }

    public static function make(array $matrix): self
    {
        return new self($matrix);
    }

    /**
     * Получаем текущую матрицу
     */
    public function get(): ?array
    {
        return $this->matrix;
    }

    public function getBetweenMaximumAndMinimum(): float
    {
        return $this->getMax() - $this->getMin();
    }

    public function getMin(): float
    {
        return $this->getMinFromMultiArray($this->matrix);
    }

    public function getMax(): float
    {
        return $this->getMaxFromMultiArray($this->matrix);
    }

    private function getMaxFromMultiArray(array $matrix): float
    {
        return $this->getExtremumFromMultiArray('max', $matrix);
    }

    private function getMinFromMultiArray(array $matrix): float
    {
        return $this->getExtremumFromMultiArray('min', $matrix);
    }

    private function getExtremumFromMultiArray(string $extremumType, array $matrix): float
    {
        /** @uses array_merge() */
        $valuesMatrix = call_user_func_array('array_merge', $matrix);

        return $extremumType === 'max' ? max($valuesMatrix) : min($valuesMatrix);
    }
}
