import { RestService } from "@gimmeapps/gquicklib-angular";
import { SolicitacaoServico } from "../models/solicitacao-servico.models";
import { environment } from "../../../../environments/environment";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({ providedIn: 'root' })
export class SolicitacaoServicoService extends RestService<SolicitacaoServico>{
    protected override api: string = `${environment.baseUrl}/solicitacoes-servico`;

    constructor(
        http: HttpClient
    ) {
        super(http)
    }

    listarTiposEquipamento(): Observable<string[]> {
        return this.http.get<string[]>(`${this.api}/tipos-equipamento`)
    }

    listarMarcas(tipo_equipamento: string): Observable<string[]> {
        let params = new HttpParams();
        params = params.append("tipo_equipamento", tipo_equipamento)

        return this.http.get<string[]>(`${this.api}/marcas`, { params })
    }

    listarModelos(tipo_equipamento: string, marca: string): Observable<string[]> {
        let params = new HttpParams();
        params = params.append("tipo_equipamento", tipo_equipamento)
        params = params.append("marca", marca)
        return this.http.get<string[]>(`${this.api}/modelos`, { params })
    }
}