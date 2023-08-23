<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Helpers\ResponseAssistant;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

use function dd;
use function getenv;

class Handler extends ExceptionHandler
{
    use ResponseAssistant;

    public function render($request, Throwable $e): Response
    {
        $message = null;

        if ($e instanceof ValidationException) {
            $message = $e->getMessage();
        }

        if ($e instanceof \Symfony\Component\HttpKernel\Exception\MethodNotAllowedHttpException) {
            $message = 'Invalid HTTP method specified.';
        }

        if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
            $message = 'A non-existent route is specified. Check the router again.';
        }

        if ($message !== null) {
            return $this->createResponseFail($message);
        }


        if (getenv('APP_DEBUG')) {
            dd($e);
        }

        return $this->createResponseFail('Bad Request');
    }
}
