import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccessService } from '../../services/access.service';
import { AttendanceService } from '../../services/attendance.service';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './checkin.component.html',
  styleUrl: './checkin.component.css'
})
export class CheckinComponent implements OnInit {
  attendanceRecords: any[] = [];
  message: string | null = null;

  constructor(
    private authService: AccessService,
    private attendanceService: AttendanceService
  ) {}

  ngOnInit() {
    this.loadAttendanceRecords();
  }

  isCheckInTime(): boolean {
    const now = new Date();
    const start = new Date();
    start.setHours(10, 0, 0);
    const end = new Date();
    end.setHours(10, 30, 0);
    return now >= start && now <= end;
  }

  async registerAttendance() {
    const user = this.authService.getUser(); // Obtener la información del usuario logeado
    const now = new Date();
    const status = this.attendanceService.getAttendanceStatus(now);

    try {
      const response = await this.attendanceService.getPublicIp();
      const ip = response?.ip;

      const newRecord = {
        userId: user.id, // ID del usuario logeado
        name: user.name,
        time: now.toTimeString().split(' ')[0],
        date: now.toDateString(),
        status: status,
        ip: ip
      };

      this.attendanceService.saveAttendanceRecord(newRecord).subscribe(
        (result: any) => {
          this.attendanceRecords.push(result);
          this.message = 'Asistencia registrada con éxito';
        },
        (_error: any) => {
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
