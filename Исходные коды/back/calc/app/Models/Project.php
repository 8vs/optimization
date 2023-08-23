<?php

declare(strict_types=1);

namespace App\Models;

use App\Http\Enums\ProjectStatuses;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use function dd;
use function is_array;
use function is_string;
use function json_decode;

final class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'status',
        'result',
        'characteristic',
    ];

//    protected $casts = [
//        'characteristic' => 'array',
//    ];

    public $timestamps = true;

    public function isFinished(): bool
    {
        return $this->getStatus() === ProjectStatuses::FINISHED && !empty($this->getResult());
    }

    public function getResult(): string
    {
        return (string)$this->getAttributeFromArray('result');
    }

    public function getStatus(): int
    {
        return (int)$this->getAttributeFromArray('status');
    }

    public function getCharacteristic(): array
    {
        $value = $this->getAttribute('characteristic');

        if (is_array($value)) {
            return $value;
        }

        if (is_string($value)) {
            $value = (array)json_decode($value, true) ?? [];
        }

        return $value;
    }
}
