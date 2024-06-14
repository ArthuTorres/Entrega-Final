<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Helpers\ApiController;
use App\Models\PropostaServico;
use Illuminate\Http\Request;

class PropostaController extends ApiController
{
    public function __construct(PropostaServico $model)
    {
        parent::__construct($model);
    }

    public function apply_includes(Request $request, $query)
    {
        return $query->with(["solicitacao_servico.cliente.user", "prestador_servico.user", "prestador_servico.avaliacoes"]);
    }
}
