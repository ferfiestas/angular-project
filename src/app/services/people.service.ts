import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private apiUrl = 'http://tu-api-url.com';  // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  getPeople(params: any): Observable<any> {
    return forkJoin([
      this.http.get(`${this.apiUrl}/people/basic`, { params }),
      this.http.get(`${this.apiUrl}/people/contact`, { params }),
      this.http.get(`${this.apiUrl}/people/work`, { params }),
      this.http.get(`${this.apiUrl}/people/additional`, { params })
    ]).pipe(
      map(([basic, contact, work, additional]: any[]) => {
        // Combina los datos de los 4 endpoints en un solo array de objetos
        return basic.map((person: any, index: string | number) => ({
          ...person,
          ...contact[index],
          ...work[index],
          ...additional[index]
        }));
      })
    );
  }

  getPersonById(id: number): Observable<any> {
    return forkJoin([
      this.http.get(`${this.apiUrl}/people/basic/${id}`),
      this.http.get(`${this.apiUrl}/people/contact/${id}`),
      this.http.get(`${this.apiUrl}/people/work/${id}`),
      this.http.get(`${this.apiUrl}/people/additional/${id}`)
    ]).pipe(
      map(([basic, contact, work, additional]: any[]) => ({
        ...basic,
        ...contact,
        ...work,
        ...additional
      }))
    );
  }

  updatePerson(id: number, _data: any): Observable<any> {
    // Divide la data en los respectivos endpoints
    const basicData = { /* datos básicos */ };
    const contactData = { /* datos de contacto */ };
    const workData = { /* datos laborales */ };
    const additionalData = { /* datos adicionales */ };

    return forkJoin([
      this.http.put(`${this.apiUrl}/people/basic/${id}`, basicData),
      this.http.put(`${this.apiUrl}/people/contact/${id}`, contactData),
      this.http.put(`${this.apiUrl}/people/work/${id}`, workData),
      this.http.put(`${this.apiUrl}/people/additional/${id}`, additionalData)
    ]);
  }

  deletePerson(id: number): Observable<any> {
    return forkJoin([
      this.http.delete(`${this.apiUrl}/people/basic/${id}`),
      this.http.delete(`${this.apiUrl}/people/contact/${id}`),
      this.http.delete(`${this.apiUrl}/people/work/${id}`),
      this.http.delete(`${this.apiUrl}/people/additional/${id}`)
    ]);
  }
}
