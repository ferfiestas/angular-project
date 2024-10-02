import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { OverlayModule } from '@angular/cdk/overlay';

import { AccessService } from '../../services/access.service';
import { PopupNotificationService } from '../../services/popup-notification.service';
import { OverlayRefService } from '../../services/overlay-ref.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule,
    MatIconModule, MatToolbarModule, ReactiveFormsModule, CommonModule, MatDialogModule, OverlayModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private accessService = inject(AccessService);
  private formBuild = inject(FormBuilder);
  private popupNotificationService = inject(PopupNotificationService); // Inyectamos el servicio de notificación
  private overlayRefService = inject(OverlayRefService); // Inyectamos el servicio de Overlay

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
            // Mostrar solo el título, imagen, altura de la imagen, alt de la imagen y botón de confirmación
            Swal.fire({
              title: '¡Aviso importante!',
              imageUrl: this.popupNotificationService.getNotificationImageUrl(),
              imageHeight: 400, // Altura de la imagen
              imageAlt: 'Notificación de Feriado', // Texto alternativo de la imagen
              confirmButtonText: 'Aceptar' // Texto del botón
            });
          }
        },
        error: (_message) => {
          // Manejar el error de credenciales
          Swal.fire({
            icon: 'error',
            title: 'Error de Usuario o Contraseña',
            text: 'Por favor, verifica tus credenciales e inténtalo de nuevo',
            confirmButtonText: 'Aceptar'
          });
        }
      });
  }
}