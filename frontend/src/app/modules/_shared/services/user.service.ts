import { Injectable } from "@angular/core";
import { RestService } from "@gimmeapps/gquicklib-angular";
import { User } from "../models/auth.models";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { firstValueFrom } from "rxjs";

@Injectable({ 'providedIn': "root" })
export class UserService extends RestService<User>{
    protected override api: string = `${environment.baseUrl}/usuarios`;

    constructor(httpClient: HttpClient) {
        super(httpClient)
    }

    async signup(user: Partial<User>): Promise<User> {
        return await firstValueFrom(this.http.post<User>(`${this.api}/signup`, user))
    }
}