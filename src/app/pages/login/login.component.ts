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
import { MatDialogModule, MatDialog } from '@angular/material/dialog'; // Asegúrate de importar MatDialog

import { AccessService } from '../../services/access.service';
import { PopupNotificationService } from '../../services/popup-notification.service';
import { NotificationDialogComponent } from '../login/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatInputModule, MatButtonModule, MatCardModule, MatFormFieldModule, 
    MatIconModule, MatToolbarModule, ReactiveFormsModule, CommonModule, MatDialogModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private accessService = inject(AccessService);
  private formBuild = inject(FormBuilder);
  private router = inject(Router);
  private popupNotificationService = inject(PopupNotificationService); // Inyectamos el servicio de notificación
  private dialog = inject(MatDialog); // Inyectamos MatDialog correctamente

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
          // Llamamos al servicio para verificar si debemos mostrar la notificación
          if (this.popupNotificationService.shouldShowNotification()) {
            this.dialog.open(NotificationDialogComponent, {
              data: {
                title: '¡Aviso importante!',
                imageUrl: this.popupNotificationService.getNotificationImageUrl(),
                imageAlt: 'Notificación de Feriado'
              }
            });
          }
        },
        error: (message) => {
          this.dialog.open(NotificationDialogComponent, {
            data: {
              title: 'Error',
              imageUrl: '',
              imageAlt: '',
              description: message
            }
          });
        }
      });
  }
}