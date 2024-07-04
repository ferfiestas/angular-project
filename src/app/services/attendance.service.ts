import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  private apiUrl = '/api/attendance'; // URL de la API del servidor

  constructor(private http: HttpClient) {}

  async getPublicIp(): Promise<{ ip: string }| undefined> {
    try {
      return await this.http.get<{ ip: string; }>('https://api.ipify.org?format=json').toPromise();
    } catch (error) {
      console.error('Error al obtener la IP pública:', error);
      return { ip: '0.0.0.0' };
    }
  }

  getAttendanceStatus(date: Date): string {
    const checkInTime = new Date(date).getHours() * 60 + new Date(date).getMinutes();
    if (checkInTime <= 614) return 'Puntual';
    if (checkInTime <= 630) return 'Retardo';
    return 'Falta';
  }

  saveAttendanceRecord(record: any): Observable<any> {
    return this.http.post(this.apiUrl, record);
  }

  loadAttendanceRecords(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error: any) => {
        console.error('Error al cargar los registros de asistencia:', error);
        return [[]]; // Devolver un array vacío en caso de error
      })
    );
  }

  autoRegisterFalta(user: any, ip: string): void {
    const now = new Date();
    const checkInTime = new Date();
    checkInTime.setHours(20, 0, 0); // 8 PM

    const timeUntilCheckIn = checkInTime.getTime() - now.getTime();
    if (timeUntilCheckIn > 0) {
      setTimeout(() => {
        const record = {
          userId: user.id,
          name: user.name,
          time: checkInTime.toTimeString().split(' ')[0],
          date: checkInTime.toDateString(),
          status: 'Falta',
          ip: ip
        };
        this.saveAttendanceRecord(record).subscribe(
          _result => console.log('Asistencia registrada como falta automáticamente'),
          _error => console.error('Error al registrar la falta automáticamente')
        );
      }, timeUntilCheckIn);
    }
  }

}
