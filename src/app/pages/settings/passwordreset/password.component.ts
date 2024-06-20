import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, /*AbstractControl, ValidationErrors*/ } from '@angular/forms';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class passwordComponent implements OnInit {
  cambiarContrasenaForm!: FormGroup;
  passwordMatchValidator: any;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cambiarContrasenaForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(5),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*]).+$')
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

 /* passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      return { mismatch: true };
    }
    return null;
  } */

  onSubmit() {
    if (this.cambiarContrasenaForm.valid) {
      console.log('Form Submitted', this.cambiarContrasenaForm.value);
    }
  }
}
