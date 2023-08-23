<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use function dd;
use function is_array;
use function is_string;
use function json_decode;

final class Task extends Model
{
    use HasFactory;

    protected $fillable = [
        'characteristic',
        'project_id',
        'name',
    ];

    protected $casts = [
        'characteristic' => 'array',
    ];

    public $timestamps = true;

    public function getName(): string
    {
        return (string)$this->getAttribute('name');
    }

    public function getId(): int
    {
        return (int)$this->getAttributeFromArray('id');
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
