import { Injectable, inject, WritableSignal, computed, effect, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";

import { RestBackend } from '#core/services/rest-backend/rest-backend'
import { AuthState, LoginPayload, SignupPayload, AuthResponse } from '#types/auth';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  // Dependency Injection
  
  private readonly restBackend = inject(RestBackend);

  // State

  // Signal
  authState: WritableSignal<AuthState> = signal<AuthState>({
    authToken: this.getAuthToken(), // Get token from localStorage, if there
    isAuthenticated: this.verifyToken(this.getAuthToken()), // Verify token not expired
    user: this.getUser() // Get user from localStorage, if there
  })

  // Computed signals
  authToken = computed(() => this.authState().authToken);
  isAuthenticated = computed(() => this.authState().isAuthenticated);
  user = computed(() => this.authState().user);
  username = computed(() => this.authState().user?.username ?? null);
  avatarUrl = computed(() => this.authState().user?.avatarUrl ?? "assets/auth/default-user.svg");

  constructor(){
    // Saves everything on localStorage whenever authState changes
    effect( () => {
      const authToken = this.authState().authToken;
      const user = this.authState().user;

      if (authToken){
        localStorage.setItem("authToken", authToken);
      } else {
        localStorage.removeItem("authToken");
      }

      if (user){
        localStorage.setItem("user", JSON.stringify(user));
      } else {
        localStorage.removeItem("user");
      }
    });
  }

  // Methods

  // Login function
  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.restBackend.request<AuthResponse>("/auth", "POST", payload)
      .pipe(
        // On every Observer emit:
        tap((response) => {
          this.updateAuthResponse(response); // Update Auth state
        }),
      );
  }

  // Signup function
  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.restBackend.request<AuthResponse>("/signup", "POST", payload)
      .pipe(
        // On every Observer emit:
        tap((response) => {
          this.updateAuthResponse(response); // Update Auth state
        }),
      );
  }

  // Logout function
  logout(){
    this.authState.set({
      user: null,
      authToken: null,
      isAuthenticated: false
    });
  }

  // Update state after login or signup
  updateAuthResponse(authResponse: AuthResponse) {
    this.authState.set({
      user: authResponse.user,
      authToken: authResponse.authToken,
      isAuthenticated: this.verifyToken(authResponse.authToken)
    })
  }

  // Check if token is valid
  verifyToken(authToken: string | null): boolean {

    // No token available
    if (!authToken)
      return false;
    
    try {
      // Get expiration from JWT
      const decodedToken = jwtDecode(authToken);
      const expiration = decodedToken.exp;

      if(!expiration || Date.now() >= expiration * 1000){
        return false; // Expiration not available or in the past
      } else {
        return true; // Token not expired
      }
    } catch(error) {  // Invalid token
      console.error("Invalid token: ", error);
      return false;
    }
  
  }

  // Verify user authentication
  isUserAuthenticated(): boolean {
    return this.verifyToken(this.getAuthToken());
  }

  // Get auth token
  getAuthToken(){
    return localStorage.getItem("authToken");
  }

  // Get user
  getUser(){
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
}