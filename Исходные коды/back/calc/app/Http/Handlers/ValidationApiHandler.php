<?php

declare(strict_types=1);

namespace App\Http\Handlers;

use App\Http\Enums\ResponseStatuses;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;

use function response;

class ValidationApiHandler
{
    public static function make(ValidationException $e): JsonResponse
    {
        $data = [
            'status' => ResponseStatuses::FAIL,
            'details' => $e->getMessage(),
        ];

        return response()->json($data, Response::HTTP_BAD_REQUEST);
    }
}
