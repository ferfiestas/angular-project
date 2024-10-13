import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';

import { PasswordService } from '../../../services/password.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  cambiarContrasenaForm!: FormGroup;
  showNewPassword = false;
  showConfirmPassword = false;

  get newPassword() {
    return this.cambiarContrasenaForm.get('newPassword');
  }

  get confirmPassword() {
    return this.cambiarContrasenaForm.get('confirmPassword');
  }

  get hasUppercase() {
    return /[A-Z]/.test(this.newPassword?.value);
  }

  get hasNumber() {
    return /\d/.test(this.newPassword?.value);
  }

  get hasLowercase() {
    return /[a-z]/.test(this.newPassword?.value);
  }

  get hasSpecialChar() {
    return /[!@#$%^&*]/.test(this.newPassword?.value);
  }

  get hasMinLength() {
    return this.newPassword?.value.length >= 6;
  }

  get passwordsMatch() {
    const newPassword = this.newPassword?.value;
    const confirmPassword = this.confirmPassword?.value;
    // Solo marcar como coincidentes si ambos campos tienen valores
    return newPassword && confirmPassword && newPassword === confirmPassword;
  }

  constructor(private fb: FormBuilder, private router: Router, private passwordService: PasswordService) {}
    ngOnInit(): void {
      this.cambiarContrasenaForm = this.fb.group({
        newPassword: ['', [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$')
        ]],
        confirmPassword: ['', [Validators.required]]
      }, { validator: this.passwordMatchValidator });
    }
  
    passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
      const newPassword = control.get('newPassword')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      if (newPassword !== confirmPassword) {
        return { mismatch: true };
      }
      return null;
    }

    togglePasswordVisibility(field: string) {
      if (field === 'newPassword') {
        this.showNewPassword = !this.showNewPassword;
      } else if (field === 'confirmPassword') {
        this.showConfirmPassword = !this.showConfirmPassword;
      }
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
              window.location.href = 'https://auditoriainterna.com.mx';
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