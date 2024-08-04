import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-edit-person-dialog',
  templateUrl: './edit-person-dialog.component.html',
  styleUrls: ['./edit-person-dialog.component.css']
})
export class EditPersonDialogComponent implements OnInit {

  @Output() dialogClosed: EventEmitter<void> = new EventEmitter<void>();

  personalInfoForm!: FormGroup;
  personalAddressForm!: FormGroup;
  workInfoForm!: FormGroup;
  workAddressForm!: FormGroup;

  dependencias: any[] = [];
  estudios: any[] = [];

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
        idDependencia: [''],
        idEstudio: [''],
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

      this.loadDependenciesAndStudies();
      this.loadPersonData(idPersonaUsuario);
    }
  }

  loadDependenciesAndStudies(): void {
    this.peopleService.getDependencias().subscribe(dependencias => {
      this.dependencias = dependencias;
    });

    this.peopleService.getEstudios().subscribe(estudios => {
      this.estudios = estudios;
    });
  }

  loadPersonData(idPersona: string): void {
    this.peopleService.getPersonalInfo(idPersona).subscribe(data => {
      this.personalInfoForm.patchValue(data);
      this.peopleService.getDependencias().subscribe(dependencias => {
        this.dependencias = dependencias;
        const selectedDependencia = this.dependencias.find(d => d.descripcion === data.dependencia);
        if (selectedDependencia) {
          this.personalInfoForm.get('idDependencia')!.setValue(selectedDependencia.idDependencia);
        }
      });
  
      this.peopleService.getEstudios().subscribe(estudios => {
        this.estudios = estudios;
        const selectedEstudio = this.estudios.find(e => e.descripcion === data.gradoEstudio);
        if (selectedEstudio) {
          this.personalInfoForm.get('idEstudio')!.setValue(selectedEstudio.idEstudio);
        }
      });
    });

    this.peopleService.getPersonalAddress(idPersona).subscribe(data => {
      this.personalAddressForm.patchValue(data);
    });

    this.peopleService.getWorkInfo(idPersona).subscribe(data => {
      this.workInfoForm.patchValue(data);
    });

    this.peopleService.getWorkAddress(idPersona).subscribe(data => {
      this.workAddressForm.patchValue(data);
    });
  }

  savePersonalInfo(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
        const formData = this.personalInfoForm.value;
        formData.idPersona = idPersonaUsuario; // Añadir el ID al objeto de datos
        
        this.peopleService.updatePersonalInfo(formData).subscribe(
            _response => {
                alert('Información personal guardada exitosamente.');
            },
            error => {
                console.error('Error al guardar información personal:', error);
                if (error.status === 400 && error.error.errors) {
                    const errorMessages = Object.values(error.error.errors).flat().join('\n');
                    alert('Errores de validación: \n' + errorMessages);
                } else {
                    alert('Error al guardar información personal. Por favor, intenta nuevamente.');
                }
            }
        );
    } else {
        alert('ID de Persona no encontrado en el almacenamiento local.');
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
    this.dialogClosed.emit();
  }
}