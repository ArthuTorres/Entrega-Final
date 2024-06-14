<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SolicitacaoServico extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        "cliente_id",
        "tipo_equipamento",
        "marca",
        "modelo",
        "periodo_preferencial",
        "descricao_problema",
        "status"
    ];

    public $belongsTo = ['cliente'];
    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public $hasMany = ['arquivos', 'propostas'];
    public function arquivos()
    {
        return $this->hasMany(ArquivoSolicitacaoServico::class);
    }

    public function propostas()
    {
        return $this->hasMany(PropostaServico::class);
    }

    public function afterSave()
    {
        $cliente = Cliente::find($this->cliente_id);
        $proposta = PropostaServico::query()
            ->where("solicitacao_servico_id", $this->id)
            ->where("status", 1)
            ->first();
        $prestador_servico = PrestadorServico::find($proposta->prestador_servico_id);

        if ($this->status == 2) { // "Serviço iniciado"
            Notification::create([
                "user_id" => $cliente->user_id,
                "titulo" => "O prestador iniciou o serviço!",
                "url" => "/clientes/solicitacao-servico/" . $this->id,
                "lido" => false,
            ]);
        }

        if ($this->status == 3) { // "Serviço finalizado"
            Notification::create([
                "user_id" => $cliente->user_id,
                "titulo" => "O prestador terminou o serviço!",
                "url" => "/clientes/solicitacao-servico/" . $this->id,
                "lido" => false,
            ]);
        }

        if ($this->status == 4) { // "Concluído"
            Notification::create([
                "user_id" => $prestador_servico->user_id,
                "titulo" => "O cliente encerrou o serviço!",
                "url" => "/prestadores/elaborar-proposta/" . $this->id,
                "lido" => false,
            ]);
        }
    }
}
