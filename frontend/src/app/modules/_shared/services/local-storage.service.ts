import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    retrieve(key: string) {
        const enc = localStorage.getItem(btoa(key))
        if (!enc)
            return undefined

        return atob(enc)
    }

    store(key: string, value: string) {
        const enc = localStorage.setItem(btoa(key), btoa(value))
    }
}