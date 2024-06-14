<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Helpers\ApiController;
use App\Models\AvaliacaoPrestador;

class AvaliacaoPrestadorController extends ApiController
{
    public function __construct(AvaliacaoPrestador $model)
    {
        parent::__construct($model);
    }
}
