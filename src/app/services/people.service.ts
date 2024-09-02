import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { appsettings } from '../components/api/appsetting';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private apiUrl: string = appsettings.apiUrl;
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
  private contratosList: any[] = [];
  private areasList: any[] = [];
  private puestosList: any[] = [];
  private cuadrantesList: any[] = [];
  private divisionesList: any[] = [];

  constructor(private http: HttpClient) {
    this.loadDependencias();
    this.loadEstudios();
    this.loadEstados();
    this.loadMunicipios();
    this.loadContrataciones();
    this.loadAreas();
    this.loadPuestos();
    this.loadCuadrantes();
    this.loadDivisiones();
  }

  private loadDependencias(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/dependencia`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadDependencias', []))
    ).subscribe(dependencias => this.dependenciaList = dependencias);
  }

  private loadEstudios(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/estudio`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadEstudios', []))
    ).subscribe(gradoEstudio => this.estudioList = gradoEstudio);
  }

  private loadEstados(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/estado`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadEstados', []))
    ).subscribe(estado => this.estadosList = estado);
  }

  private loadMunicipios(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/municipio`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadMunicipios', []))
    ).subscribe(municipio => this.municipiosList = municipio);
  }


  private loadContrataciones(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/tipocontratacione`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadContrataciones', []))
    ).subscribe(contratacion => this.contratosList = contratacion);
  }

  private loadAreas(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/area`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadAreas', []))
    ).subscribe(areaClave => this.areasList = areaClave);
  }

  private loadPuestos(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/puesto`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadPuestos', []))
    ).subscribe(puesto => this.puestosList = puesto);
  }

  private loadCuadrantes(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/cuadrante`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadCuadrantes', []))
    ).subscribe(cuadrante => this.cuadrantesList = cuadrante);
  }

  private loadDivisiones(): void {
    this.http.get<any[]>(`${this.apiUrl}/api/divisione`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('loadDivisiones', []))
    ).subscribe(division => this.divisionesList = division);
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

  getContratos(): Observable<any[]> {
    return of(this.contratosList);
  }

  getAreas(): Observable<any[]> {
    return of(this.areasList);
  }

  getPuestos(): Observable<any[]> {
    return of(this.puestosList);
  }

  getCuadrantes(): Observable<any[]> {
    return of(this.cuadrantesList);
  }

  getDivisiones(): Observable<any[]> {
    return of(this.divisionesList);
  }

  searchPersonByRFC(rfc: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/persona/byrfc/${rfc}`, this.httpOptions).pipe(
      map((response: any) => {
        if (response && response[0]?.idPersona) {
          localStorage.setItem('idPersonaUsuario', response[0].idPersona);
          localStorage.setItem('idPerUsuario', response[0].idUsuario);
          return response;
        } else {
          return null;
        }
      }),
      catchError(this.handleError<any>('searchPersonByRFC', null))
    );
  }

  searchPersonByCURP(curp: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/persona/bycurp/${curp}`, this.httpOptions).pipe(
      map((response: any) => {
        if (response && response[0]?.idPersona) {
          localStorage.setItem('idPersonaUsuario', response[0].idPersona);
          localStorage.setItem('idPerUsuario', response[0].idUsuario);
          return response;
        } else {
          return null;
        }
      }),
      catchError(this.handleError<any>('searchPersonByCURP', null))
    );
  }

  searchPersonByNumber(numero: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/persona/bynumero/${numero}`, this.httpOptions).pipe(
      map((response: any) => {
        if (response && response[0]?.idPersona) {
          localStorage.setItem('idPersonaUsuario', response[0].idPersona);
          localStorage.setItem('idPerUsuario', response[0].idUsuario);
          return response;
        } else {
          return null;
        }
      }),
      catchError(this.handleError<any>('searchPersonByNumber', null))
    );
  }

  searchPersonByName(nombre: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/api/persona/bynombre/${nombre}`, this.httpOptions).pipe(
      catchError(this.handleError<any[]>('searchPersonByName', []))
    );
  }

  // Nuevo método para buscar en secuencia
  searchPerson(query: string): Observable<any[]> {
    return this.searchPersonByNumber(query).pipe(
      switchMap(numberResult => {
        if (numberResult) {
          return of([numberResult[0]]); // Si encontró por número, retorna el resultado como array
        } else {
          return this.searchPersonByRFC(query).pipe(
            switchMap(result => {
              if (result) {
                return of([result[0]]); // Si encontró por RFC, retorna el resultado como array
              } else {
                return this.searchPersonByCURP(query).pipe(
                  switchMap(curpResult => {
                    if (curpResult) {
                      return of([curpResult[0]]); // Si encontró por CURP, retorna el resultado como array
                    } else {
                      return this.searchPersonByName(query); // Finalmente, busca por nombre o apellido
                    }
                  })
                );
              }
            })
          );
        }
      })
    );
  }

  getPersonById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/persona/byid/${id}`, this.httpOptions).pipe(
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
    return this.http.get(`${this.apiUrl}/api/persona/byid/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getPersonalInfo', {}))
    );
  }

  getPersonAddressById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/personadomicilio/${id}`, this.httpOptions).pipe(
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
    return this.http.get(`${this.apiUrl}/api/personadomicilio/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getPersonalAddress', {}))
    );
  }

  getWorkById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/empleado/${id}`, this.httpOptions).pipe(
      map((work: any) => {
        const contratacion = this.contratosList.find(c => c.descripcion === work.contratacion);
        const areaClave = this.areasList.find(a => a.clave === work.areaClave);
        const puesto = this.puestosList.find(p => p.nombre === work.puesto);
        return {
          ...work,
          idTipoContratacion: contratacion ? contratacion.idTipoContratacion : null,
          idArea: areaClave ? areaClave.idArea : null,
          idPuesto: puesto ? puesto.idPuesto : null,
        };
      }),
      catchError(this.handleError<any>('getWorkById', {}))
    );
  }

  getWorkInfo(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/empleado/${id}`, this.httpOptions).pipe(
      catchError(this.handleError<any>('getWorkInfo', {}))
    );
  }

  getWorkAddressById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/trabajodomicilio/${id}`, this.httpOptions).pipe(
      map((workdomicilio: any) => {
        const estado = this.estadosList.find(e => e.descripcion === workdomicilio.estado);
        const municipio = this.municipiosList.find(m => m.nombre === workdomicilio.municipio);
        const cuadrante = this.cuadrantesList.find(c => c.descripcion === workdomicilio.cuadrante);
        const division = this.divisionesList.find(d => d.descripcion === workdomicilio.division);
        return {
          ...workdomicilio,
          idEstado: estado ? estado.idEstado : null,
          idMunicipio: municipio ? municipio.idMunicipio : null,
          idCuadrante: cuadrante ? cuadrante.idCuadrante : null,
          idDivision: division ? division.idDivision : null,
        };
      }),
      catchError(this.handleError<any>('getWorkAddressById', {}))
    );
  }

  getWorkAddress(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/api/trabajodomicilio/${id}`, this.httpOptions).pipe(
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
      urlImagen: data.urlImagen,
      idEstatus: "2"  
    };

    // Imprime el objeto updateData en la consola para verificar su contenido
    console.log('updateData:', updateData);

    return this.http.put(`${this.apiUrl}/api/persona`, updateData, this.httpOptions).pipe(
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

    return this.http.put(`${this.apiUrl}/api/PersonaDomicilio`, updatePerAddData, this.httpOptions).pipe(
      catchError(this.handleError<any>('updatePersonalAddress'))
    );
  }

  updateWorkInfo(data: any): Observable<any> {
    console.log('data:', data);  // Verifica el contenido de WorkInfo

    const updateWorkData = {
      idEmpleado: data.idEmpleado,
      idPersona: data.idPersona,
      idInterno: data.idInterno,
      numEmpleado: data.numEmpleado,
      idTipoContratacion: data.idTipoContratacion,
      idArea: data.idArea,
      idPuesto: data.idPuesto,
      sueldoNeto: data.sueldoNeto,
      sueldoBruto: data.sueldoBruto,
      fechaContratacion: data.fechaContratacion
    };

    // Imprime el objeto updateWorkData en la consola para verificar su contenido
    console.log('updateWorkData:', updateWorkData);

    return this.http.put(`${this.apiUrl}/api/Empleado`, updateWorkData, this.httpOptions).pipe(
      catchError(this.handleError<any>('updateWorkInfo'))
    );
  }

  updateWorkAddress(data: any): Observable<any> {
    console.log('data:', data);  // Verifica el contenido de WorkAddres

    const updateWorkAddressData = {
      idTrabajoDomicilio: data.idTrabajoDomicilio,
      idEmpleado: data.idEmpleado,
      idEstado: data.idEstado,
      idMunicipio: data.idMunicipio,
      idCuadrante: data.idCuadrante,
      idDivision: data.idDivision,
      domicilio: data.domicilio
    };

    // Imprime el objeto updateWorkAddressData en la consola para verificar su contenido
    console.log('updateWorkAddressData:', updateWorkAddressData);

    return this.http.put(`${this.apiUrl}/api/TrabajoDomicilio`, updateWorkAddressData, this.httpOptions).pipe(
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