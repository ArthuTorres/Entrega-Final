import { Injectable } from "@angular/core";
import { RestService } from "@gimmeapps/gquicklib-angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Contact, Message } from "../models/message.models";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Injectable({ 'providedIn': "root" })
export class MessageService extends RestService<Message> {
    protected override api: string = `${environment.baseUrl}/messages`;

    constructor(
        httpClient: HttpClient,
        private router: Router
    ) {
        super(httpClient)
    }

    getChats(): Observable<Contact[]> {
        return this.http.get<Contact[]>(this.api + `/chats`)
    }

    getMessagesWith(contactId: number): Observable<Message[]> {
        return this.http.get<Message[]>(this.api + `/chats/${contactId}`)
    }

    openMessages(contactId: number) {
        const contactHash = btoa(`${contactId}`)
        this.router.navigate(["/mensagens", contactHash])
    }
}