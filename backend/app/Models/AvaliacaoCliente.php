<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvaliacaoCliente extends BaseModel
{
    use HasFactory;

    public $fillable = [
        "solicitacao_servico_id",
        "cliente_id",
        "titulo",
        "mensagem",
        "nota_cliente",
        "nota_sistema"
    ];

    public function solicitacao_servico(){
        return $this->belongsTo(SolicitacaoServico::class);
    }

    public function cliente(){
        return $this->belongsTo(Cliente::class);
    }
}
