import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-edit-person-dialog',
  templateUrl: './edit-person-dialog.component.html',
  styleUrls: ['./edit-person-dialog.component.css']
})
export class EditPersonDialogComponent implements OnInit {
  personalInfoForm!: FormGroup;
  personalAddressForm!: FormGroup;
  workInfoForm!: FormGroup;
  workAddressForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    public dialogRef: MatDialogRef<EditPersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');

    if (idPersonaUsuario) {
      this.personalInfoForm = this.fb.group({
        idPersona: [''],
        nombreCompleto: [''],
        rfc: [''],
        curp: [''],
        referencia: [''],
        telefono: [''],
        telEmergencia: [''],
        email: [''],
        dependencia: [''],
        gradoEstudio: [''],
        estudio: [''],
        urlImagen: ['']
      });

      this.personalAddressForm = this.fb.group({
        estado: [''],
        municipio: [''],
        domicilio: ['']
      });

      this.workInfoForm = this.fb.group({
        idInterno: [''],
        contratacion: [''],
        area: [''],
        puesto: [''],
        idCuadrante: [''],
        sueldo: [''],
        fechaContratacion: ['']
      });

      this.workAddressForm = this.fb.group({
        estado: [''],
        municipio: [''],
        domicilio: ['']
      });

      this.peopleService.getPersonalInfo(idPersonaUsuario).subscribe(data => {
        this.personalInfoForm.patchValue(data);
      });

      this.peopleService.getPersonalAddress(idPersonaUsuario).subscribe(data => {
        this.personalAddressForm.patchValue(data);
      });

      this.peopleService.getWorkInfo(idPersonaUsuario).subscribe(data => {
        this.workInfoForm.patchValue(data);
      });

      this.peopleService.getWorkAddress(idPersonaUsuario).subscribe(data => {
        this.workAddressForm.patchValue(data);
      });
    }
  }

  savePersonalInfo(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
      this.peopleService.updatePersonalInfo(idPersonaUsuario, this.personalInfoForm.value).subscribe(_response => {
        alert('Información personal guardada exitosamente.');
      }, _error => {
        alert('Error al guardar información personal.');
      });
    }
  }

  savePersonalAddress(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
      this.peopleService.updatePersonalAddress(idPersonaUsuario, this.personalAddressForm.value).subscribe(_response => {
        alert('Domicilio personal guardado exitosamente.');
      }, _error => {
        alert('Error al guardar domicilio personal.');
      });
    }
  }

  saveWorkInfo(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
      this.peopleService.updateWorkInfo(idPersonaUsuario, this.workInfoForm.value).subscribe(_response => {
        alert('Información laboral guardada exitosamente.');
      }, _error => {
        alert('Error al guardar información laboral.');
      });
    }
  }

  saveWorkAddress(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
      this.peopleService.updateWorkAddress(idPersonaUsuario, this.workAddressForm.value).subscribe(_response => {
        alert('Domicilio laboral guardado exitosamente.');
      }, _error => {
        alert('Error al guardar domicilio laboral.');
      });
    }
  }

  closeDialog(): void {
    localStorage.removeItem('idPersonaUsuario');
    this.dialogRef.close();
  }
}