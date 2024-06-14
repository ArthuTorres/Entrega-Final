<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PropostaServico extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        "solicitacao_servico_id",
        "prestador_servico_id",
        "descricao_proposta",
        "valor_servico",
        "prazo",
        "status"
    ];

    public $belongsTo = ["solicitacao_servico", "prestador_servico"];
    public function solicitacao_servico()
    {
        return $this->belongsTo(SolicitacaoServico::class);
    }

    public function prestador_servico()
    {
        return $this->belongsTo(PrestadorServico::class);
    }

    public function afterSave()
    {
        $prestador = PrestadorServico::find($this->prestador_servico_id);
        $solicitacao = SolicitacaoServico::find($this->solicitacao_servico_id);
        $cliente = Cliente::find($solicitacao->cliente_id);

        if($this->status == 0){ //criada
            Notification::create([
                "user_id" => $cliente->user_id,
                "titulo" => "Você recebeu uma proposta!",
                "url" => "/clientes/solicitacao-servico/".$solicitacao->id,
                "lido" => false,
            ]);
        }

        if($this->status == 1){ //aprovada
            Notification::create([
                "user_id" => $prestador->user_id,
                "titulo" => "Sua proposta foi aprovada!",
                "url" => "/prestadores/elaborar-proposta/".$solicitacao->id,
                "lido" => false,
            ]);
        }

        if($this->status == 2){ //reprovada
            Notification::create([
                "user_id" => $prestador->user_id,
                "titulo" => "Sua proposta foi reprovada!",
                "url" => "/prestadores/elaborar-proposta/".$solicitacao->id,
                "lido" => false,
            ]);
        }
    }
}
