<?php

declare(strict_types=1);

namespace App\Helpers;

use App\Http\Enums\ResponseStatuses;
use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

use function response;

trait ResponseAssistant
{
    protected function createResponseFail(string $message, array $append = []): JsonResponse
    {
        $content = [
            'status' => ResponseStatuses::FAIL,
            'error' => $message,
        ];

        if (!empty($append)) {
            $content['details'] = $append;
        }

        return $this->sendResponse($content, Response::HTTP_BAD_REQUEST);
    }

    public function createResponseSuccess(array $data): JsonResponse
    {
        $content = [
            'status' => ResponseStatuses::SUCCESS,
            'result' => $data,
        ];

        return $this->sendResponse($content, Response::HTTP_OK);
    }

    private function sendResponse(array $content, int $status): JsonResponse
    {
        return response()->json($content, $status);
    }
}
