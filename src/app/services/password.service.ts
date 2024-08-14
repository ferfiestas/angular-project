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
    const idUsuario = localStorage.getItem('idUsuario');
    const idRol = localStorage.getItem('userRole');
    const usuario1 = localStorage.getItem('usuario1');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = {
      idUsuario,
      idRol,
      usuario1,
      password
    };

    return this.http.put(url, body, { headers });
  }

  defaultPasswordReset(): Observable<any> {
    const url = `${ this.apiUrl }/api/usuario/putpass`;
    const token = localStorage.getItem('token');
    const idUsuario = localStorage.getItem('idPerUsuario');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const body = {
      idUsuario
    };

    return this.http.put(url, body, { headers });
  }

}
