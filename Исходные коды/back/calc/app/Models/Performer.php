<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use function is_array;
use function is_string;
use function json_decode;

class Performer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'characteristic',
        'task_id',
    ];

    protected $casts = [
        'characteristic' => 'array',
    ];

    public $timestamps = true;

    public function getName(): string
    {
        return (string)$this->getAttribute('name');
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
