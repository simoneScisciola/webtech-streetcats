import { Injectable, inject } from '@angular/core';
import { HttpRequester } from '#core/services/http-requester/http-requester'
import { Observable } from 'rxjs';

export interface LoginPayload   { email: string; password: string; }
export interface SignupPayload  { username: string; email: string; password: string; }
export interface AuthResponse   { token: string; user: { id: string; username: string; }; }

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly httpRequester = inject(HttpRequester);

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.httpRequester.request("/auth", "POST", payload);
  }

  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.httpRequester.request("/signup", "POST", payload);
  }
}