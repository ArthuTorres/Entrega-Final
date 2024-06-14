import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private pendingRequestsCount = 0;
    private pendingRequestsCountSubject = new BehaviorSubject<number>(0);

    constructor(
        private router: Router,
        private authService: AuthService,
        private spinnerService: NgxSpinnerService,
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        console.log(request.url, !request.url.includes("messages/chats"))
        const showSpinner = !request.url.includes("messages/chats")

        if (showSpinner) {
            this.pendingRequestsCount++;
            this.pendingRequestsCountSubject.next(this.pendingRequestsCount);

            if (this.pendingRequestsCount === 1)
                this.spinnerService.show()
        }

        // Clona a requisição e adiciona o token ao cabeçalho de autorização
        const clonedRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.authService.token}`,
            },
        });

        // Intercepta a requisição e trata possíveis erros
        return next.handle(clonedRequest).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    // Lógica adicional após uma resposta bem-sucedida (opcional)
                }
            }),
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // this.uiService.error(
                    //     'Sua sessão expirou, faça login novamente',
                    //     error
                    // );
                    this.authService.logout();
                }
                return throwError(() => new Error(error.message));
            }),
            finalize(() => {
                if (showSpinner) {
                    this.pendingRequestsCount--;
                    this.pendingRequestsCountSubject.next(this.pendingRequestsCount);

                    if (this.pendingRequestsCount === 0)
                        this.spinnerService.hide();
                }
            })
        );
    }

    getPendingRequestsCount(): Observable<number> {
        return this.pendingRequestsCountSubject.asObservable();
    }
}
