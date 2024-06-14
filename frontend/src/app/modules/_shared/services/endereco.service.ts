import { Injectable } from "@angular/core";
import { RestService } from "@gimmeapps/gquicklib-angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Endereco } from "../models/endereco.models";
import { Observable, map } from "rxjs";

@Injectable({ 'providedIn': "root" })
export class EnderecoService extends RestService<Endereco>{
    protected override api: string = `${environment.baseUrl}/enderecos`;

    constructor(httpClient: HttpClient) {
        super(httpClient)
    }

    public buscarCep(cep: string): Observable<Partial<Endereco>> {
        return this.http.get<Partial<Endereco>>(`${this.api}/busca-cep/${cep}`).pipe(map((result: any) => {
            if (result.erro)
                throw new Error('Cep desconhecido')

            return {
                cep: cep,
                logradouro: result.logradouro,
                bairro: result.bairro,
                cidade: result.localidade,
                estado: result.uf
            }
        }))
    }
}