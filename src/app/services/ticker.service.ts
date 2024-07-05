import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TickerService {
  private apiUrl = 'https://6687f9330bc7155dc019f9d1.mockapi.io/api/sep/messages';


  constructor(private http: HttpClient) {}

  getMessages(): Observable<{ id: number; message: string }[]> {
    return this.http.get<{ id: number; message: string }[]>(this.apiUrl);
  }

  createMessage(message: string): Observable<{ id: number; message: string }> {
    return this.http.post<{ id: number; message: string }>(this.apiUrl, { message });
  }

  updateMessage(id: number, message: string): Observable<{ id: number; message: string }> {
    return this.http.put<{ id: number; message: string }>(`${this.apiUrl}/${id}`, { message });
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
