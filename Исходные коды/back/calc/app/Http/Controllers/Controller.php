<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Helpers\ResponseAssistant;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use ValidatesRequests, ResponseAssistant;
}
