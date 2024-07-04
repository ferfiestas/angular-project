import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { AccessService } from '../../services/access.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css'
})
export class CheckinComponent implements OnInit {
  attendanceRecords: any[] = [];
  message: string | null = null;
  userIp: string = '';

  constructor(
    private authService: AccessService,
    private attendanceService: AttendanceService
  ) {}

  async ngOnInit() {
    this.loadAttendanceRecords();
    const user = this.authService.getUser();
    const response = await this.attendanceService.getPublicIp();
    this.userIp = response!.ip;
    this.attendanceService.autoRegisterFalta(user, this.userIp);
  }

  getAttendanceMessage(status: string): string {
    if (status === 'Puntual') return '!Asistencia registrada con éxito!';
    if (status === 'Retardo') return '!Asistencia registrada como retardo!';
    return '!Asistencia registrada como falta!';
  }


  async registerAttendance() {
    const user = this.authService.getUser(); // Obtener la información del usuario logeado
    const now = new Date();
    const status = this.attendanceService.getAttendanceStatus(now);

    try {
      
      const newRecord = {
        userId: user.id, // ID del usuario logeado
        name: user.name,
        time: now.toTimeString().split(' ')[0],
        date: now.toDateString(),
        status: status,
        ip: this.userIp
      };

      this.attendanceService.saveAttendanceRecord(newRecord).subscribe(
        (result: any) => {
          this.attendanceRecords.push(result);
          this.message = this.getAttendanceMessage(status);
        },
        (_error) => {
          this.message = 'Error al registrar la asistencia';
        }
      );
    } catch (error) {
      this.message = 'Error al obtener la IP pública';
    }
  }

  loadAttendanceRecords() {
    this.attendanceService.loadAttendanceRecords().subscribe(
      (records: any[]) => {
        this.attendanceRecords = records || []; // Asignar un array vacío si records es undefined
      },
      (_error: any) => {
        this.message = 'Error al cargar los registros de asistencia';
      }
    );
  }
}
