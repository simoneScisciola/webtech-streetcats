import { Injectable, inject, WritableSignal, computed, effect, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

import { RestBackend } from '#core/services/rest-backend/rest-backend'
import { AuthState, LoginPayload, SignupPayload, AuthResponse } from '#types/auth';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  authState: WritableSignal<AuthState> = signal<AuthState>({
    username: this.getUsername(),
    authToken: this.getAuthToken(), // Get token from localStorage, if there
    isAuthenticated: this.verifyToken(this.getAuthToken()) // Verify token not expired
  })

  private readonly httpRequester = inject(RestBackend);

  username = computed(() => this.authState().username);
  authToken = computed(() => this.authState().authToken);
  isAuthenticated = computed(() => this.authState().isAuthenticated);

  constructor(){
    effect( () => {
      const authToken = this.authState().authToken;
      const username = this.authState().username;

      if (authToken){
        localStorage.setItem("authToken", authToken);
      } else {
        localStorage.removeItem("authToken");
      }

      if (username){
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("username");
      }
    });
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.httpRequester.request("/auth", "POST", payload);
  }

  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.httpRequester.request("/signup", "POST", payload);
  }

  async updateToken(authToken: string) {
    const decodedToken: any = jwtDecode(authToken);
    const username = decodedToken.username;
    this.authState.set({
      username: username,
      authToken: authToken,
      isAuthenticated: this.verifyToken(authToken)
    })
  }

  getAuthToken(){
    return localStorage.getItem("authToken");
  }

  getUsername(){
    return localStorage.getItem("username");
  }

  verifyToken(authToken: string | null): boolean {
    if(authToken !== null){
      try{
        const decodedToken = jwtDecode(authToken);
        const expiration = decodedToken.exp;
        if(expiration === undefined || Date.now() >= expiration * 1000){
          return false; // Expiration not available or in the past
        } else {
          return true; // Token not expired
        }
      } catch(error) {  // Invalid token
        console.error("Error in token verification: ", error);
        return false;
      }
    }
    return false;
  }

  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getAuthToken());
  }

  logout(){
    this.authState.set({
      username: null,
      authToken: null,
      isAuthenticated: false
    });
  }
}