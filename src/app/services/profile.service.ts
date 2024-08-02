import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { appsettings } from '../components/api/appsetting';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private http = inject(HttpClient);
  private readonly baseUrl: string = appsettings.apiUrl;

  constructor() {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private getUserId(): number {
    const userId = localStorage.getItem('idPersona');
    return userId ? parseInt(userId, 10) : 0;
  }

  getPersonaData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/persona/byid/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getEmpleadoData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/empleado/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getUsuarioData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/usuario/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getDireccionEmpleadoData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/personadomicilio/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getProfileData(): Observable<any> {
    const userId = this.getUserId();

    return forkJoin({
      persona: this.getPersonaData(userId),
      empleado: this.getEmpleadoData(userId),
      usuario: this.getUsuarioData(userId),
      domicilio: this.getDireccionEmpleadoData(userId),
    }).pipe(
      map((response: any) => {
        return {
          usuario: response.usuario.usuario1,
          nombre: response.persona.nombreCompleto,
          rfc: response.persona.rfc,
          curp: response.persona.curp,
          email: response.persona.email,
          estado: response.domicilio.estado,
          municipio: response.domicilio.municipio,
          estatus: response.empleado.estatus,
          folio: response.empleado.folio,
          tipoContratacion: response.empleado.contratacion,
          fechaContratacion: response.empleado.fechaContratacion,
          domicilio: response.domicilio.domicilio,
          cuadrante: response.empleado.idCuadrante,
          puesto: response.empleado.puesto,
          referente: response.persona.referencia,
          imageUrl: response.persona.urlImagen,
        };
      })
    );
  }
}