import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { AccessService } from '../../services/access.service';
import { PopupNotificationService } from '../../services/popup-notification.service';
import { NotificationDialogComponent } from '../notifications/notification-dialog/notification-dialog.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatToolbarModule, ReactiveFormsModule, CommonModule, MatDialogModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  [x: string]: any;

  private accessService = inject(AccessService);
  private formBuild = inject(FormBuilder);
  private router = inject(Router);
  private popupNotificationService = inject(PopupNotificationService); // Inyectamos el servicio de notificación

  public formLogin: FormGroup = this.formBuild.group({
    usuario1: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isKeyboardVisible: boolean = false;

  onFocus(): void {
    this.isKeyboardVisible = true;
  }

  onBlur(): void {
    this.isKeyboardVisible = false;
  }

  LogIn() {
    const { usuario1, password } = this.formLogin.value;
  
    this.accessService.login(usuario1, password)
      .subscribe({
        next: () => {
          if (this.popupNotificationService.shouldShowNotification()) {
            const isIOS = /iPad|iPhone|iPod/i.test(navigator.userAgent);
  
            if (isIOS) {
              // Mostrar una ventana que pide confirmación al usuario para mostrar la notificación
              Swal.fire({
                title: 'Permitir Notificación',
                text: 'Para ver el aviso importante, por favor acepta mostrar la notificación.',
                icon: 'info',
                confirmButtonText: 'Mostrar Notificación',
                allowOutsideClick: false,
                allowEscapeKey: false
              }).then((result) => {
                if (result.isConfirmed) {
                  // Ahora mostramos el pop-up real
                  Swal.fire({
                    title: '¡Aviso importante!',
                    imageUrl: this.popupNotificationService.getNotificationImageUrl(),
                    imageHeight: 400,
                    imageAlt: 'Notificación de Feriado',
                    confirmButtonText: 'Aceptar',
                    allowOutsideClick: false,
                    allowEscapeKey: false
                  });
                }
              });
            } else {
              // Para otros dispositivos (PC y Android), usar directamente Swal.fire
              Swal.fire({
                title: '¡Aviso importante!',
                imageUrl: this.popupNotificationService.getNotificationImageUrl(),
                imageHeight: 400,
                imageAlt: 'Notificación de Feriado',
                confirmButtonText: 'Aceptar',
                allowOutsideClick: false,
                allowEscapeKey: false
              });
            }
          }
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      });
  }
}