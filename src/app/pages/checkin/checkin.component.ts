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
  
      // Usamos setTimeout para evitar posibles problemas en dispositivos móviles
      setTimeout(() => {
        if (this.popupNotificationService.shouldShowNotification()) {
          Swal.fire({
            title: '¡Aviso importante!',
            imageUrl: this.popupNotificationService.getNotificationImageUrl(),
            imageHeight: 400,
            imageAlt: 'Notificación de Feriado',
            confirmButtonText: 'Aceptar',
            allowOutsideClick: false, // Evitar que se cierre accidentalmente en móviles
            allowEscapeKey: false     // Evitar cierre accidental en móviles
          });
        }
      }, 100); // Retraso breve para asegurar que el pop-up funcione bien en dispositivos móviles
  
    } catch (error) {
      // Manejo de errores
      const errorMessage = typeof error === 'string' ? error : 'Error desconocido al registrar la asistencia';
      Swal.fire('Error', errorMessage, 'error');
    }
  }
}