import { BaseModel } from "@gimmeapps/gquicklib-angular";
import { SolicitacaoServico } from "./solicitacao-servico.models";
import { Cliente } from "./cliente.models";

export interface AvaliacaoCliente extends BaseModel {
    solicitacao_servico_id: number
    solicitacao_servico: Partial<SolicitacaoServico>

    cliente_id: number
    cliente: Partial<Cliente>

    titulo: string
    mensagem: string
    nota_cliente: number
    nota_sistema: number
}


export function calcularRatingCliente(avaliacoes: Partial<AvaliacaoCliente>[]): number {
    try {
        const nota = (avaliacoes.reduce((previous, current) => {
            previous += current.nota_cliente ?? 0
            return previous
        }, 0)) / avaliacoes.length

        if (isNaN(nota))
            return 0

        return nota
    } catch (e) {
        return 0
    }
}