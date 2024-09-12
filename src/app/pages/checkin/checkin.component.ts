import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { AttendanceService } from '../../services/attendance.service';
import { MessageDialogComponent } from '../checkin/message-dialog/message-dialog.component';
import { PopupNotificationService } from '../../services/popup-notification.service';


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
    private popupNotificationService: PopupNotificationService,
    private dialog: MatDialog
  ) { }

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
      // Después de mostrar el diálogo, verificar si debe aparecer el pop-up
      if (this.popupNotificationService.shouldShowNotification()) {
        Swal.fire({
          title: '¡Aviso importante!',
          text: 'Recuerda que este próximo 16 de Septiembre no pasaremos lista! Disfruta tu día feriado en conmemoración del día de la Independencia, Felices fiestas patrias!!',
          imageUrl: this.popupNotificationService.getNotificationImageUrl(),
          imageHeight: 200,
          imageAlt: 'Notificación de Feriado',
          confirmButtonText: 'Aceptar'
        });
      }

    } catch (error) {
      this.message = typeof error === 'string' ? error : 'Error desconocido al registrar la asistencia';
    }
  }
}