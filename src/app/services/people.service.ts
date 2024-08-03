import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private apiUrl = 'http://209.38.48.98:8080/api';
  private token = localStorage.getItem('token');

  private httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    })
  };

  constructor(private http: HttpClient) {}

  searchPersonByRFC(rfc: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/persona/byrfc/${rfc}`, this.httpOptions).pipe(
      map((response: any) => {
        if (response && response.idPersona) {
          localStorage.setItem('idPersonaUsuario', response.idPersona);
          return response;
        } else {
          return null;
        }
      }),
      catchError(this.handleError<any>('searchPersonByRFC', null))
    );
  }

  getPersonById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/persona/byid/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getPersonById', {}))
    );
  }

  getPersonalInfo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/persona/byid/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getPersonalInfo', {}))
    );
  }

  getPersonalAddress(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/personadomicilio/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getPersonalAddress', {}))
    );
  }

  getWorkInfo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/empleado/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getWorkInfo', {}))
    );
  }

  getWorkAddress(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/trabajodomicilio/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getWorkAddress', {}))
    );
  }

  updatePersonalInfo(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/persona`, data, this.httpOptions).pipe(
      catchError(this.handleError<any>('updatePersonalInfo'))
    );
  }

  updatePersonalAddress(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/personadomicilio/${id}`, data, this.httpOptions).pipe(
      catchError(this.handleError<any>('updatePersonalAddress'))
    );
  }

  updateWorkInfo(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/empleado/${id}`, data, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateWorkInfo'))
    );
  }

  updateWorkAddress(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/trabajodomicilio/${id}`, data, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateWorkAddress'))
    );
  }

  private handleError<T>(_operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}