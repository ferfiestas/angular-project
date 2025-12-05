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

  /** idPersona desde el storage */
  private getUserId(): number {
    const userId = localStorage.getItem('idPersona');
    return userId ? parseInt(userId, 10) : 0;
  }

  /** NUEVO: idEmpleado desde el storage */
  private getEmpleadoId(): number {
    const empleadoId = localStorage.getItem('idEmpleado');
    return empleadoId ? parseInt(empleadoId, 10) : 0;
  }

  getPersonaData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/persona/byid/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  /** Ahora usa por defecto el idEmpleado del storage */
  getEmpleadoData(userId?: number): Observable<any> {
    const id = userId ?? this.getEmpleadoId();
    const url = `${this.baseUrl}/api/empleado/${id}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  /** Ahora usa por defecto el idEmpleado del storage */
  getUsuarioData(userId?: number): Observable<any> {
    const id = userId ?? this.getEmpleadoId();
    const url = `${this.baseUrl}/api/usuario/${id}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getDireccionEmpleadoData(userId: number): Observable<any> {
    const url = `${this.baseUrl}/api/personadomicilio/${userId}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  /** Ahora usa por defecto el idEmpleado del storage */
  getDireccionTrabajoData(userId?: number): Observable<any> {
    const id = userId ?? this.getEmpleadoId();
    const url = `${this.baseUrl}/api/trabajodomicilio/${id}`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  getProfileData(): Observable<any> {
    const userId = this.getUserId();         // idPersona
    const empleadoId = this.getEmpleadoId(); // idEmpleado

    return forkJoin({
      persona: this.getPersonaData(userId),
      empleado: this.getEmpleadoData(empleadoId),
      usuario: this.getUsuarioData(empleadoId),
      domicilio: this.getDireccionEmpleadoData(userId),
      trabajoDomicilio: this.getDireccionTrabajoData(empleadoId),
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
          division: response.trabajoDomicilio.division,
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