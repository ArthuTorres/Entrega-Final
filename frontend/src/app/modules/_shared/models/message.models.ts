import { BaseModel } from "@gimmeapps/gquicklib-angular";

export interface Message extends BaseModel {
    from_id: number,
    from_name: string,
    to_id: number,
    to_name: string,
    message: string
}

export interface Contact {
    contact_id: number,
    contact_name: string,
    last_message: string,
    last_message_date: Date,
    last_message_from_id: number
}