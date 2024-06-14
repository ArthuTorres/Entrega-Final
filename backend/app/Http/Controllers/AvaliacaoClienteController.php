<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Helpers\ApiController;
use App\Models\AvaliacaoCliente;

class AvaliacaoClienteController extends ApiController
{
    public function __construct(AvaliacaoCliente $model)
    {
        parent::__construct($model);
    }
}
