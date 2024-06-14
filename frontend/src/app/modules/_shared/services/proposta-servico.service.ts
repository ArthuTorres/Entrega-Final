import { RestService } from "@gimmeapps/gquicklib-angular";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { PropostaServico } from "../models/proposta-servico.models";

@Injectable({ providedIn: 'root' })
export class PropostaServicoService extends RestService<PropostaServico>{
    protected override api: string = `${environment.baseUrl}/propostas`;

    constructor(
        http: HttpClient
    ) {
        super(http)
    }
}