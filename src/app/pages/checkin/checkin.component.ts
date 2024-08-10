import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { AttendanceService } from '../../services/attendance.service';
import { MessageDialogComponent } from '../checkin/message-dialog/message-dialog.component';

@Component({
  selector: 'app-checkin',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})
export class CheckinComponent implements OnInit {
  message: string | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private dialog: MatDialog
  ) {}

  async ngOnInit() {
    // Get the public IP when the component initializes
    const response = await this.attendanceService.getPublicIp();
    this.attendanceService.setUserIp(response!.ip);
  }

  async registerAttendance() {
    try {
      const result = await this.attendanceService.saveAttendanceRecord().toPromise();
      // Mostrar el mensaje del servidor en un diálogo
      this.dialog.open(MessageDialogComponent, {
        data: { message: result },
        width: '45vw',  // Ancho del diálogo para pantallas grandes
        maxWidth: '90vw', // Máximo ancho para pantallas pequeñas
        maxHeight: '90vh', // Altura máxima para evitar ocultamiento detrás del sidenav
        panelClass: 'responsive-dialog' // Clase CSS personalizada para el diálogo
      });
    } catch (error) {
      this.message = typeof error === 'string' ? error : 'Error desconocido al registrar la asistencia';
    }
  }
}