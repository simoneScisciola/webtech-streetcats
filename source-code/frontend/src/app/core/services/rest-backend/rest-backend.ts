import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Config } from '#core/services/config/config';

/**
 * Handles HTTP requests toward Rest Server.
 */
@Injectable({
  providedIn: 'root',
})
export class RestBackend {

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
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    body: any = null,
    params: Record<string, any> | null = null,
    headers: Record<string, string> = {}
  ): Observable<T> {

    const url = `${this.baseUrl}${endpoint}`;

    // Parse params
    let httpParams = new HttpParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === undefined) {
          return;
        }

        if (Array.isArray(value)) {
          // Support array params (a=[1, 2, 3...] becomes ?a=1&a=2&a=3...)
          value.forEach(v => {
            httpParams = httpParams.append(key, String(v));
          });
        } else {
          // Single param
          httpParams = httpParams.append(key, String(value));
        }
      });
    }

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        ...headers,
      }),
      params: httpParams,
      body: body ?? null, // Body is available only in POST/PUT/PATCH
    };

    return this.http.request<T>(method, url, httpOptions);
  }

}