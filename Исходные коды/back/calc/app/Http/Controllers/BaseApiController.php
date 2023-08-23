<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;

use function getenv;
use function response;
use function sprintf;
use function time;

class BaseApiController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(
            [
                'message' => sprintf('Welcome to automatization api v%s', getenv('APP_VERSION')),
                'server_time' => time(),
            ]
        );
    }
}
