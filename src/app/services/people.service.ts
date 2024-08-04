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
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    })
  };

  private dependenciaList: any[] = [];
  private estudioList: any[] = [];
  private estadosList: any[] = [];
  private municipiosList: any[] = [];

  constructor(private http: HttpClient) {
    this.loadDependencias();
    this.loadEstudios();
    this.loadEstados();
    this.loadMunicipios();
  }

  private loadDependencias(): void {
    this.http.get<any[]>(`${this.apiUrl}/dependencia`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadDependencias', []))
    ).subscribe(dependencias => this.dependenciaList = dependencias);
  }

  private loadEstudios(): void {
    this.http.get<any[]>(`${this.apiUrl}/estudio`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadEstudios', []))
    ).subscribe(gradoEstudio => this.estudioList = gradoEstudio);
  }

  private loadEstados(): void {
    this.http.get<any[]>(`${this.apiUrl}/estado`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadEstados', []))
    ).subscribe(estado => this.estadosList = estado);
  }

  private loadMunicipios(): void {
    this.http.get<any[]>(`${this.apiUrl}/municipio`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadMunicipios', []))
    ).subscribe(municipio => this.municipiosList = municipio);
  }

  // Métodos públicos para obtener las listas de dependencias y estudios
  getDependencias(): Observable<any[]> {
    return of(this.dependenciaList);
  }

  getEstudios(): Observable<any[]> {
    return of(this.estudioList);
  }

  getEstados(): Observable<any[]> {
    return of(this.estadosList);
  }

  getMunicipios(): Observable<any[]> {
    return of(this.municipiosList);
  }

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
      map((persona: any) => {
        const dependencia = this.dependenciaList.find(d => d.descripcion === persona.dependencia);
        const gradoEstudio = this.estudioList.find(e => e.descripcion === persona.gradoEstudio);
        return {
          ...persona,
          idDependencia: dependencia ? dependencia.idDependencia : null,
          idEstudio: gradoEstudio ? gradoEstudio.idEstudio : null
        };
      }),
      catchError(this.handleError<any>('getPersonById', {}))
    );
  }

  getPersonalInfo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/persona/byid/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getPersonalInfo', {}))
    );
  }

  getPersonAddressById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/personadomicilio/${id}`, this.httpOptions).pipe(
      map((personadomicilio: any) => {
        const estado = this.estadosList.find(e => e.descripcion === personadomicilio.estado);
        const municipio = this.municipiosList.find(m => m.nombre === personadomicilio.municipio);
        return {
          ...personadomicilio,
          idEstado: estado ? estado.idEstado : null,
          idMunicipio: municipio ? municipio.idMunicipio : null
        };
      }),
      catchError(this.handleError<any>('getPersonAddressById', {}))
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

  updatePersonalInfo(data: any): Observable<any> {
    console.log('data:', data);  // Verifica el contenido de data

    const updateData = {
      idPersona: data.idPersona,
      nombreCompleto: data.nombreCompleto,
      rfc: data.rfc,
      curp: data.curp,
      referencia: data.referencia,
      telefono: data.telefono,
      telEmergencia: data.telEmergencia,
      email: data.email,
      idDependencia: data.idDependencia,
      idEstudio: data.idEstudio,
      estudio: data.estudio,
      urlImagen: data.urlImagen
    };

    // Imprime el objeto updateData en la consola para verificar su contenido
    console.log('updateData:', updateData);

    return this.http.put(`${this.apiUrl}/persona`, updateData, this.httpOptions).pipe(
      catchError(this.handleError<any>('updatePersonalInfo'))
    );
  }

  updatePersonalAddress(data: any): Observable<any> {
    console.log('data:', data);  // Verifica el contenido de PersonalAddress

    const updatePerAddData = {
      idPersonaDomicilio: data.idPersonaDomicilio,
      idPersona: data.idPersona,
      idEstado: data.idEstado,
      idMunicipio: data.idMunicipio,
      domicilio: data.domicilio
    };

    // Imprime el objeto updatePerAddData en la consola para verificar su contenido
    console.log('updatePerAddData:', updatePerAddData);

    return this.http.put(`${this.apiUrl}/PersonaDomicilio`, updatePerAddData, this.httpOptions).pipe(
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