import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-credential-form',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})


export class profileComponent {
  credentialForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.credentialForm = this.fb.group({
      usuario: ['', Validators.required],
      nombre: ['', Validators.required],
      rfc: ['', Validators.required],
      curp: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      estado: ['', Validators.required],
      municipio: ['', Validators.required],
      estatus: ['', Validators.required],
      folio: ['', Validators.required],
      tipoContratacion: ['', Validators.required],
      fechaContratacion: ['', Validators.required],
      alcaldia: ['', Validators.required],
      cuadrante: ['', Validators.required],
      puesto: ['', Validators.required],
      referente: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.credentialForm.valid) {
      console.log(this.credentialForm.value);
      // Aquí puedes manejar el envío del formulario, por ejemplo enviando los datos a un servidor
    } else {
      console.log('Formulario inválido');
    }
  }
}

export class AppComponent { }