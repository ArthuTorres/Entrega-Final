<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Helpers\ApiController;
use App\Models\SolicitacaoServico;
use Illuminate\Http\Request;

class SolicitacaoServicoController extends ApiController
{
    public function __construct(SolicitacaoServico $model)
    {
        parent::__construct($model);
    }

    public function tiposEquipamento(Request $request)
    {
        $response = $this->model::distinct()->pluck('tipo_equipamento')->toArray();
        return response()->json($response);
    }

    public function marcas(Request $request)
    {
        $query = $this->model::query()->where("tipo_equipamento", $request->input("tipo_equipamento"));
        $response = $query->distinct()->pluck('marca')->toArray();
        return response()->json($response);
    }

    public function modelos(Request $request)
    {
        $query = $this->model::query()->where("tipo_equipamento", $request->input("tipo_equipamento"));

        if ($request->input("marca") != "")
            $query = $this->model::query()->where("marca", $request->input("marca"));

        $response = $query->distinct()->pluck('modelo')->toArray();
        return response()->json($response);
    }
    

    public function apply_includes(Request $request, $query)
    {
        return $query->with(["arquivos", "cliente.user.enderecos", "cliente.avaliacoes_cliente"]);
    }
}
