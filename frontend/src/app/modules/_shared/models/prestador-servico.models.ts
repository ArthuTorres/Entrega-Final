import { BaseModel } from "@gimmeapps/gquicklib-angular";
import { User } from "./auth.models";
import { AvaliacaoPrestador } from "./avaliacao-prestador.models";

export interface PrestadorServico extends BaseModel {
    user_id: number
    user: Partial<User>

    avaliacoes: Partial<AvaliacaoPrestador>[]
}