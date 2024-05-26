import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API_URL } from './../core/configs/app-config';

@Injectable({
    providedIn: 'root',
})

export class ApiService {
    constructor(
      private http: HttpClient,
      @Inject(API_URL) private apiUrl: string,
    ) {}
  
    // Access Permissions
    getClients(): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}task1?`);
    }
}