<?php

declare(strict_types=1);

namespace App\Services\Matrix\Extremum;

final class MatrixBuilder
{
    protected array $cost;
    protected array $time;
    protected array $competence;
    protected array $risk;

    public function __construct(array $cost, array $time, array $competence, array $risk)
    {
        $this->cost = $cost;
        $this->time = $time;
        $this->competence = $competence;
        $this->risk = $risk;
    }

    public static function make(array $cost, array $time, array $competence, array $risk): self
    {
        return new self($cost, $time, $competence, $risk);
    }

    /**
     * Матрица стоимости
     */
    public function getCost(): Matrix
    {
        return Matrix::make($this->cost);
    }

    /**
     * Матрица времени
     */
    public function getTime(): Matrix
    {
        return Matrix::make($this->time);
    }

    /**
     * Матрица компетенции
     */
    public function getCompetence(): Matrix
    {
        return Matrix::make($this->competence);
    }

    /**
     * Матрица риска
     */
    public function getRisk(): Matrix
    {
        return Matrix::make($this->risk);
    }
}

