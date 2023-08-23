<?php

declare(strict_types=1);

namespace App\Services\Matrix\ValueObject;

use App\Services\Matrix\Enum\CharacteristicMatrixType;
use App\Services\Matrix\Enum\CoefficientList;
use App\Services\Matrix\Extremum\MatrixBuilder;

final class MatrixObject
{
    protected const COEFFICIENTS_CHAR = 'coefficients_char';
    protected const PERFORMERS_CHAR   = 'performers_char';
    protected const TASK_CHAR         = 'task_char';
    protected const SIZE_MATRIX       = 'size_matrix';

    protected array $input;

    protected function __construct(array $input)
    {
        $this->input = $input;
    }

    public static function fromArray(array $input): self
    {
        return new self($input);
    }

    public function toExtremumMatrixBuilder(): MatrixBuilder
    {
        return MatrixBuilder::make(
            $this->getCostMatrix(),
            $this->getTimeMatrix(),
            $this->getCompetenceMatrix(),
            $this->getRiskMatrix(),
        );
    }

    public function getTimeMatrix(): array
    {
        return $this->getPerformers()[CharacteristicMatrixType::TIME_MATRIX];
    }

    public function getRiskMatrix(): array
    {
        return $this->getPerformers()[CharacteristicMatrixType::RISK_MATRIX];
    }

    public function getCompetenceMatrix(): array
    {
        return $this->getPerformers()[CharacteristicMatrixType::COMPETENCE_MATRIX];
    }

    public function getCostMatrix(): array
    {
        return $this->getPerformers()[CharacteristicMatrixType::COST_MATRIX];
    }

    public function getCountPerformers(): float
    {
        return $this->getSizeMatrix()['M'];
    }

    public function getCountTasks(): float
    {
        return $this->getSizeMatrix()['N'];
    }

    public function getCoefficientP(): float
    {
        return $this->getCoefficients()[CoefficientList::COEFFICIENT_P];
    }

    public function getCoefficientT(): float
    {
        return $this->getCoefficients()[CoefficientList::COEFFICIENT_T];
    }

    public function getCoefficientE(): float
    {
        return $this->getCoefficients()[CoefficientList::COEFFICIENT_E];
    }

    public function getCoefficientR(): float
    {
        return $this->getCoefficients()[CoefficientList::COEFFICIENT_R];
    }

    public function getCoefficients(): array
    {
        return $this->input[self::COEFFICIENTS_CHAR];
    }

    public function getSizeMatrix(): array
    {
        return $this->input[self::SIZE_MATRIX];
    }

    public function getPerformers(): array
    {
        return $this->input[self::PERFORMERS_CHAR];
    }

    public function getTasks(): array
    {
        return $this->input[self::TASK_CHAR];
    }

    public function getCostTask(): array
    {
        return $this->getTasks()[0];
    }

    public function getTimeTask(): array
    {
        return $this->getTasks()[1];
    }

    public function getCompetenceTask(): array
    {
        return $this->getTasks()[2];
    }

    public function getRiskTask(): array
    {
        return $this->getTasks()[3];
    }
}
