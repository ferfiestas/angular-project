import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PasswordService } from '../../../services/password.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class passwordComponent implements OnInit {
  cambiarContrasenaForm!: FormGroup;

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

  constructor(private fb: FormBuilder, private passwordService: PasswordService) {}

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

  onSubmit() {
    if (this.cambiarContrasenaForm.valid) {
      const nuevaContrasena = this.cambiarContrasenaForm.get('newPassword')?.value;
      this.passwordService.passwordReset(nuevaContrasena).subscribe(
        response => {
          console.log('Contraseña cambiada con éxito', response);
        },
        error => {
          console.error('Error al cambiar la contraseña', error);
        }
      );
    }
  }
}