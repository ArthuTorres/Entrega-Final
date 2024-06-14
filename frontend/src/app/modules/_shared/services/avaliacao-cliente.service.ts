import { Injectable } from "@angular/core";
import { RestService } from "@gimmeapps/gquicklib-angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { AvaliacaoCliente } from "../models/avaliacao-cliente.models";

@Injectable({ 'providedIn': "root" })
export class AvaliacaoClienteService extends RestService<AvaliacaoCliente>{
    protected override api: string = `${environment.baseUrl}/avaliacoes-cliente`;

    constructor(
        httpClient: HttpClient,
    ) {
        super(httpClient)
    }
}