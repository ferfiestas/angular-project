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

import Swal from 'sweetalert2';

import { AccessService } from '../../services/access.service';
import { PopupNotificationService } from '../../services/popup-notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatToolbarModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private accessService = inject(AccessService);
  private formBuild = inject(FormBuilder);
  private router = inject(Router);
  private popupNotificationService = inject(PopupNotificationService);

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
          // Lógica para el caso de éxito
          this.router.navigate(['/main']); // Redirige al usuario después de un login exitoso

          // Verificar si se debe mostrar el pop-up de notificación
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
        },
        error: (message) => {
          Swal.fire('Error', message, 'error');
        }
      });
  }
}