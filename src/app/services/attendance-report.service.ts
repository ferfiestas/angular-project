import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private readonly apiUrl = 'https://auditoriainterna.xyz/api/repasistencia';
  private readonly personaUrl = 'https://auditoriainterna.xyz/api/persona';
  private token = localStorage.getItem('token');

  constructor(private http: HttpClient) {}

  getPersonas(): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get(this.personaUrl, { headers });
  }

  postConsulta(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.post(this.apiUrl, data, { headers });
  }
}