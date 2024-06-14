import { Injectable } from "@angular/core";
import { RestService } from "@gimmeapps/gquicklib-angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Cliente } from "../models/cliente.models";
import { UserService } from "./user.service";
import { firstValueFrom } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable({ 'providedIn': "root" })
export class ClienteService extends RestService<Cliente>{
    protected override api: string = `${environment.baseUrl}/clientes`;

    constructor(
        httpClient: HttpClient,
        private usuarioService: UserService,
        private authService: AuthService,
    ) {
        super(httpClient)
    }

    public async signup(cliente: Partial<Cliente>) {
        if (!cliente.user)
            throw new Error("User não informado");

        const usuario = await this.usuarioService.signup(cliente.user);
        const payload: Partial<Cliente> = {
            user_id: usuario.id
        }

        await firstValueFrom(this.http.post<Cliente>(`${this.api}/signup`, payload))
        if (cliente.user.email && cliente.user.password)
            await firstValueFrom(this.authService.login({ email: cliente.user.email, password: cliente.user.password }))
    }
}