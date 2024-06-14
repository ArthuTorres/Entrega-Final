import { BaseModel } from "@gimmeapps/gquicklib-angular";

export interface Notificacao extends BaseModel {
    user_id: number
    titulo: string
    url: string
    lido: boolean
}