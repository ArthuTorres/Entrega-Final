import { BaseModel } from "@gimmeapps/gquicklib-angular";
import { Cliente } from "./cliente.models";

export const statusList = [
    "Avaliando propostas",  // 0
    "Proposta selecionada", // 1
    "Serviço iniciado",     // 2
    "Serviço finalizado",   // 3
    "Concluído",            // 4
    "Cancelado"             // 5
]

export interface SolicitacaoServico extends BaseModel {
    cliente_id?: number
    cliente?: Cliente

    tipo_equipamento: string
    marca: string
    modelo: string
    periodo_preferencial: number
    descricao_problema: string
    status: number

    arquivos: Partial<ArquivoSolicitacaoServico>[]
}

export interface ArquivoSolicitacaoServico extends BaseModel {
    solicitacao_servico_id?: number
    solicitacao_servico?: SolicitacaoServico

    arquivo: string
}