import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TickerService {
  private apiUrl = 'https://your-api-url.com/messages';
  addMessage: any;

  constructor(private http: HttpClient) {}

  getMessages(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }

  createMessage(message: string): Observable<string> {
    return this.http.post<string>(this.apiUrl, { message });
  }

  updateMessage(id: number, message: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/${id}`, { message });
  }

  deleteMessage(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
