import { BaseModel } from "@gimmeapps/gquicklib-angular"
import { Endereco } from "./endereco.models"

export interface LoginRequest {
    email: string,
    password: string
}

export interface LoginResponse {
    access_token: string,
    token_type: string,
    expires_in: number,
    user: User
}

export interface User extends BaseModel {
    name: string,
    email: string,
    password: string,
    enderecos?: Partial<Endereco>[]
}