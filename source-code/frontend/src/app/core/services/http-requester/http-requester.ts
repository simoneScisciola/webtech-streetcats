import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Config } from '#core/services/config/config';

/**
 * Handles HTTP requests toward server.
 */
@Injectable({
  providedIn: 'root',
})
export class HttpRequester {
  private readonly http = inject(HttpClient);
  private readonly config = inject(Config);

  private readonly baseUrl = `http://${this.config.get('BACKEND_ADDRESS')}:${this.config.get('BACKEND_PORT')}`;

  /**
   * Generic HTTP request function.
   * @param endpoint relative path (e.g. '/resource/:id')
   * @param method GET | POST | PUT | DELETE
   * @param body optional payload
   * @param headers optional extra headers
   * @returns Response Observable
   */
  request<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body: any = null,
    headers: Record<string, string> = {}
  ): Observable<T> {
    
    const url = `${this.baseUrl}${endpoint}`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...headers,
      }),
      body: body ? JSON.stringify(body) : null, // Body is available only in POST/PUT/DELETE
    };

    return this.http.request<T>(method, url, httpOptions);
  }
}