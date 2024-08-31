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

  getDireccionTrabajoData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/trabajodomicilio/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getProfileData(): Observable<any> {
    const userId = this.getUserId();

    return forkJoin({
      persona: this.getPersonaData(userId),
      empleado: this.getEmpleadoData(userId),
      usuario: this.getUsuarioData(userId),
      domicilio: this.getDireccionEmpleadoData(userId),
      trabajoDomicilio: this.getDireccionTrabajoData(userId),
    }).pipe(
      map((response: any) => {
        return {
          usuario: response.usuario.usuario1,
          nombre: response.persona.nombreCompleto,
          rfc: response.persona.rfc,
          curp: response.persona.curp,
          email: response.persona.email,
          gradoEstudio: response.persona.gradoEstudio,
          municipio: response.domicilio.municipio,
          telefono: response.persona.telefono,
          telEmergencia: response.persona.telEmergencia,
          dependencia: response.persona.dependencia,
          tipoContratacion: response.empleado.contratacion,
          fechaContratacion: response.empleado.fechaContratacion,
          domicilio: response.domicilio.domicilio,
          cuadrante: response.trabajoDomicilio.cuadrante,
          puesto: response.empleado.puesto,
          area: response.empleado.areaDescripcion,
          municipioTrabajo: response.trabajoDomicilio.municipio,
          referente: response.persona.referencia,
          imageUrl: response.persona.urlImagen,
        };
      })
    );
  }
}