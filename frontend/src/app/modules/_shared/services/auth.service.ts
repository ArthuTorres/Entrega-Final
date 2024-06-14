import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { BehaviorSubject, Observable, firstValueFrom, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, User } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $userData: Observable<User | null>;
  private _userdata: BehaviorSubject<User | null>;

  $token: Observable<string | null>;
  private _token: BehaviorSubject<string | null>;

  private readonly api = `${environment.baseUrl}/auth`;

  constructor(private http: HttpClient, private router: Router) {
    this._userdata = new BehaviorSubject<User | null>(this.userData);
    this.$userData = this._userdata.asObservable();

    this._token = new BehaviorSubject<string | null>(this.token);
    this.$token = this._token.asObservable();
  }

  public login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.api + "/login", request).pipe(
      tap((response) => {
        this.token = response.access_token;
        this.userData = response.user;
        this.router.navigate(['/']);
      })
    );
  }

  async updateUserdata() {
    return firstValueFrom(this.http.post<User>(this.api + '/me', {}).pipe(
      tap(response => {
        this.userData = response
      })
    ))
  }

  public logout() {
    localStorage.clear();

    this._userdata.next(null);
    this._token.next(null);

    this.router.navigate(['/auth/login']);
  }

  public isAuthenticated() {
    return !!this.token;
  }

  public get token(): string | null {
    return localStorage.getItem('access-token');
  }

  private set token(value: string) {
    localStorage.setItem('access-token', value);
    this._token.next(value);
  }

  public get userData(): User | null {
    const b64 = localStorage.getItem('profile');
    if (!b64)
      return null;

    const user = <User>JSON.parse(atob(b64));
    return user;
  }

  public set userData(value: User) {
    const json = JSON.stringify(value);
    const encoded = btoa(json);

    localStorage.setItem("profile", encoded)
    this._userdata.next(value);
  }
}

