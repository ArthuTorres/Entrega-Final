import { RestService } from "@gimmeapps/gquicklib-angular";
import { ArquivoSolicitacaoServico } from "../models/solicitacao-servico.models";
import { environment } from "../../../../environments/environment";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class ArquivoSolicitacaoServicoService extends RestService<ArquivoSolicitacaoServico>{
    protected override api: string = `${environment.baseUrl}/arquivos-solicitacoes-servico`;

    constructor(
        http: HttpClient
    ) {
        super(http)
    }
}