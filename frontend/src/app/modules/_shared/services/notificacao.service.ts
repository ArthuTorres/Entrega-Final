import { Injectable } from "@angular/core";
import { RestService } from "@gimmeapps/gquicklib-angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Notificacao } from "../models/notificacao.model";

@Injectable({ 'providedIn': "root" })
export class NotificacaoService extends RestService<Notificacao>{
    protected override api: string = `${environment.baseUrl}/notificacoes`;

    constructor(httpClient: HttpClient) {
        super(httpClient)
    }
}