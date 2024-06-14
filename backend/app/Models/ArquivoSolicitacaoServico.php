<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ArquivoSolicitacaoServico extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        "solicitacao_servico_id",
        "arquivo"
    ];

    public $belongsTo = ['solicitacao_servico'];
    public function solicitacao_servico()
    {
        return $this->belongsTo(SolicitacaoServico::class);
    }
}
