import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Course } from '../components/interfaces/course.model';
import { appsettings } from '../components/api/appsetting';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private apiUrl = `${appsettings.apiUrl}/api/Curso`;
  private puestoUrl = `${appsettings.apiUrl}/api/puesto`;

  constructor(private http: HttpClient) { }

  getCourses(): Observable<Course[]> {
    const token = localStorage.getItem('token'); // Obtener el token del localStorage
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(this.apiUrl, { headers }).pipe(
      map(response => response.map(course => ({
        id: course.idCurso,
        title: course.titulo,
        subtitulo: course.subtitulo,
        description: course.descripcion,
        type: course.nota,
        puesto: course.puesto,
        url: this.extractYouTubeId(course.liga)
      })))
    );
  }

  getPuesto(idPuesto: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any>(`${this.puestoUrl}/${idPuesto}`, { headers });
  }

  getPuestos(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<any[]>(this.puestoUrl, { headers });
  }

  createCourse(courseData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(this.apiUrl, courseData, { headers });
  }

  updateCourse(courseData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.put(`${this.apiUrl}`, courseData, { headers });
}

  deleteCourse(idCurso: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.delete(`${this.apiUrl}/${idCurso}`, { headers });
  }

  private extractYouTubeId(url: string): string {
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/);
    return (videoIdMatch && videoIdMatch[1]) ? videoIdMatch[1] : url;
  }
}