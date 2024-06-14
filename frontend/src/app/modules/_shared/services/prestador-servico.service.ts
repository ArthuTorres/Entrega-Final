import { Injectable } from "@angular/core";
import { RestService } from "@gimmeapps/gquicklib-angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { UserService } from "./user.service";
import { firstValueFrom } from "rxjs";
import { AuthService } from "./auth.service";
import { PrestadorServico } from "../models/prestador-servico.models";

@Injectable({ 'providedIn': "root" })
export class PrestadorServicoService extends RestService<PrestadorServico>{
    protected override api: string = `${environment.baseUrl}/prestadores-servico`;

    constructor(
        httpClient: HttpClient,
        private usuarioService: UserService,
        private authService: AuthService,
    ) {
        super(httpClient)
    }

    public async signup(prestadorServico: Partial<PrestadorServico>) {
        if (!prestadorServico.user)
            throw new Error("User não informado");

        const usuario = await this.usuarioService.signup(prestadorServico.user);
        const payload: Partial<PrestadorServico> = {
            user_id: usuario.id
        }

        await firstValueFrom(this.http.post<PrestadorServico>(`${this.api}/signup`, payload))
        if (prestadorServico.user.email && prestadorServico.user.password)
            await firstValueFrom(this.authService.login({ email: prestadorServico.user.email, password: prestadorServico.user.password }))
    }
}