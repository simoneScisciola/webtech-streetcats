import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface LoginPayload   { email: string; password: string; }
export interface SignupPayload  { username: string; email: string; password: string; }
export interface AuthResponse   { token: string; user: { id: string; username: string; }; }

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private base = '/api/auth';

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/login`, payload);
  }

  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.base}/signup`, payload);
  }
}