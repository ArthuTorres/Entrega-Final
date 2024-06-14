import { BaseModel } from "@gimmeapps/gquicklib-angular";
import { SolicitacaoServico } from "./solicitacao-servico.models";
import { PrestadorServico } from "./prestador-servico.models";

export interface AvaliacaoPrestador extends BaseModel {
    solicitacao_servico_id: number
    solicitacao_servico: Partial<SolicitacaoServico>

    prestador_servico_id: number
    prestador_servico: Partial<PrestadorServico>

    titulo: string
    mensagem: string
    nota_prestador: number
    nota_sistema: number
}


export function calcularRatingPrestador(avaliacoes: Partial<AvaliacaoPrestador>[]): number {
    try {
        const nota = (avaliacoes.reduce((previous, current) => {
            previous += current.nota_prestador ?? 0
            return previous
        }, 0)) / avaliacoes.length

        if (isNaN(nota))
            return 0

        return nota
    } catch (e) {
        return 0
    }
}