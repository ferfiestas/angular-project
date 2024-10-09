import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { appsettings } from '../components/api/appsetting';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl: string = appsettings.apiUrl;
  private userIp: string = '';

  constructor(private http: HttpClient) {}

  async getPublicIp(): Promise<{ ip: string } | undefined> {
    try {
      return await this.http.get<{ ip: string }>('https://api.ipify.org?format=json').toPromise();
    } catch (error) {
      console.error('Error al obtener la IP pública:', error);
      return { ip: '0.0.0.0' };
    }
  }

  setUserIp(ip: string) {
    this.userIp = ip;
  }

  saveAttendanceRecord(): Observable<any> {
    const url = `${ this.apiUrl }/api/asistencia`;
    const idEmpleado = localStorage.getItem('idEmpleado');
    const token = localStorage.getItem('token');

    const record = {
      idEmpleado: idEmpleado,
      ip: this.userIp
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Incluir el token en las cabeceras
      'Content-Type': 'application/json'
    });

    return this.http.post(url, record, { headers, responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}\nServer Message: ${this.getServerMessage(error)}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

  private getServerMessage(error: HttpErrorResponse): string {
    try {
      return error.error ? JSON.stringify(error.error) : 'No message from server';
    } catch (e) {
      return 'Error parsing server message';
    }
  }
}