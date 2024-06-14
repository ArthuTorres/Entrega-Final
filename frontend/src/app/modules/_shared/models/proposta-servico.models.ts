import { BaseModel } from "@gimmeapps/gquicklib-angular";
import { PrestadorServico } from "./prestador-servico.models";
import { SolicitacaoServico } from "./solicitacao-servico.models";

export const statusList = [
    "Em análise",   // 0
    "Aprovada",     // 1
    "Recusada",     // 2
    "Finalizada"    // 3
]

export interface PropostaServico extends BaseModel {
    descricao_proposta?: string | null
    valor_servico?: number | null
    prazo?: string | null
    status?: number | null

    prestador_servico_id?: number | null
    prestador_servico: Partial<PrestadorServico>

    solicitacao_servico_id?: number | null
    solicitacao_servico: Partial<SolicitacaoServico>
}