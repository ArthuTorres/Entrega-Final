import { Injectable } from "@angular/core";
import { RestService } from "@gimmeapps/gquicklib-angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { AvaliacaoPrestador } from "../models/avaliacao-prestador.models";

@Injectable({ 'providedIn': "root" })
export class AvaliacaoPrestadorService extends RestService<AvaliacaoPrestador>{
    protected override api: string = `${environment.baseUrl}/avaliacoes-prestador`;

    constructor(
        httpClient: HttpClient,
    ) {
        super(httpClient)
    }
}