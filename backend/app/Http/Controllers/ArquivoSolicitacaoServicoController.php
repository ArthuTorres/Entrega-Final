<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Helpers\ApiController;
use App\Models\ArquivoSolicitacaoServico;
use Illuminate\Http\Request;

class ArquivoSolicitacaoServicoController extends ApiController
{
    public function __construct(ArquivoSolicitacaoServico $model)
    {
        parent::__construct($model);
    }
}
