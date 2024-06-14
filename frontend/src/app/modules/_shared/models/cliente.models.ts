import { BaseModel } from "@gimmeapps/gquicklib-angular";
import { User } from "./auth.models";
import { AvaliacaoCliente } from "./avaliacao-cliente.models";

export interface Cliente extends BaseModel {
    user_id: number
    user: Partial<User>
    avaliacoes_cliente: Partial<AvaliacaoCliente>[];
}