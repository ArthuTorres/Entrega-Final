<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AvaliacaoPrestador extends BaseModel
{
    use HasFactory;

    public $fillable = [
        "solicitacao_servico_id",
        "prestador_servico_id",
        "titulo",
        "mensagem",
        "nota_prestador",
        "nota_sistema"
    ];

    public function solicitacao_servico(){
        return $this->belongsTo(SolicitacaoServico::class);
    }

    public function prestadorServico(){
        return $this->belongsTo(PrestadorServico::class);
    }
}
