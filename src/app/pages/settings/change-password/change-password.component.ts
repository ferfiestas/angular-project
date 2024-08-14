import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { PasswordService } from '../../../services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  cambiarContrasenaForm: FormGroup;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  hasUppercase: boolean = false;
  hasNumber: boolean = false;
  hasLowercase: boolean = false;
  hasSpecialChar: boolean = false;
  hasMinLength: boolean = false;
  passwordsMatch: boolean = true;

  constructor(private fb: FormBuilder, private router: Router, private passwordService: PasswordService) {
    this.cambiarContrasenaForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    });

    this.cambiarContrasenaForm.valueChanges.subscribe(() => {
      this.validatePassword();
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validatePassword() {
    const newPassword = this.cambiarContrasenaForm.get('newPassword')?.value || '';
    const confirmPassword = this.cambiarContrasenaForm.get('confirmPassword')?.value || '';

    this.hasUppercase = /[A-Z]/.test(newPassword);
    this.hasNumber = /[0-9]/.test(newPassword);
    this.hasLowercase = /[a-z]/.test(newPassword);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    this.hasMinLength = newPassword.length >= 6;
    
    // Asegúrate de que ambos campos no estén vacíos antes de validar la coincidencia
    this.passwordsMatch = newPassword.length > 0 && confirmPassword.length > 0 && newPassword === confirmPassword;
  }

  onSubmit() {
    if (this.cambiarContrasenaForm.valid) {
      const nuevaContrasena = this.cambiarContrasenaForm.get('newPassword')?.value;
      this.passwordService.passwordReset(nuevaContrasena).subscribe(
        _response => {
          Swal.fire({
            title: 'Éxito',
            text: 'Contraseña cambiada con éxito',
            icon: 'success',
            confirmButtonText: 'OK'
          }).then(() => {
            this.router.navigate(['main']);
          });
        },
        _error => {
          Swal.fire({
            title: 'Error',
            text: 'Error al cambiar la contraseña',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      );
    }
  }
}