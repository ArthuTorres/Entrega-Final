import { BaseModel } from "@gimmeapps/gquicklib-angular";

export interface EnderecoViaCep {
    logradouro: string
    complemento: string
    bairro: string
    localidade: string
    uf: string
    cep: string
    ddd: number
    gia: string
    ibge: string
    siafi: string
}

export interface Endereco extends BaseModel {
    user_id: number
    cep: string
    logradouro: string
    numero: string
    bairro: string
    cidade: string
    estado: string
}