import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { appsettings } from '../components/api/appsetting';

@Injectable({
  providedIn: 'root',
})
export class TickerService {
  private apiUrl: string = appsettings.apiUrl;


  constructor(private http: HttpClient) {}

  getMessages(): Observable<{ idTicker: number; descripcion: string }[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<{ idTicker: number; descripcion: string }[]>(`${this.apiUrl}/api/ticker`, { headers });
  }

  createMessage(descripcion: string): Observable<{ idTicker: number; descripcion: string }> {
    return this.http.post<{ idTicker: number; descripcion: string }>(this.apiUrl, { descripcion });
  }

  updateMessage(idTicker: number, descripcion: string): Observable<{ idTicker: number; descripcion: string }> {
    return this.http.put<{ idTicker: number; descripcion: string }>(`${this.apiUrl}/${idTicker}`, { descripcion });
  }

  deleteMessage(idTicker: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idTicker}`);
  }
}
