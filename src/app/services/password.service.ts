import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { appsettings } from '../components/api/appsetting';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private apiUrl: string = appsettings.apiUrl;

  constructor(private http: HttpClient) {}

  passwordReset(password: string): Observable<any> {
    const url = `${ this.apiUrl }/api/usuario`;
    const token = localStorage.getItem('token');
    const idEmpleado = localStorage.getItem('idEmpleado');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = {
      password,
      idEmpleado
    };

    return this.http.post(url, body, { headers });
  }
}
