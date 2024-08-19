import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { PeopleService } from '../../../services/people.service';
import { PasswordService } from '../../../services/password.service';

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

  userRole: number | undefined;

  dependencias: any[] = [];
  estudios: any[] = [];
  estados: any[] = [];
  municipios: any[] = [];
  contratos: any[] = [];
  areas: any[] = [];
  puestos: any[] = [];
  cuadrantes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private peopleService: PeopleService,
    private passwordService: PasswordService,
    public dialogRef: MatDialogRef<EditPersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  resetPassword(): void {
    this.passwordService.defaultPasswordReset().subscribe(
      _response => {
        // Si llegamos aquí, es porque la llamada fue exitosa
        Swal.fire({
          icon: 'success',
          title: 'Contraseña restablecida',
          text: 'La contraseña se ha restablecido exitosamente.',
          customClass: {
            confirmButton: 'swal2-confirm'
          }
        });
      },
      error => {
        const message = error.error.text || error.message || 'Hubo un error al restablecer la contraseña. Intenta nuevamente.';
        if (message.includes('Contraseña reseteada satisfactoriamente')) {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña restablecida',
            text: message,
            customClass: {
              confirmButton: 'swal2-confirm'
            }
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: message,
            customClass: {
              confirmButton: 'swal2-confirm'
            }
          });
        }
      }
    );
  }

  ngOnInit(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    this.userRole = parseInt(localStorage.getItem('userRole') || '0', 10);

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
        idPersonaDomicilio: [''],
        idPersona: [''],
        idEstado: [''],
        idMunicipio: [''],
        domicilio: ['']
      });

      this.workInfoForm = this.fb.group({
        idEmpleado: [''],
        idPersona: [''],
        idInterno: [''],
        numEmpleado: [''],
        idTipoContratacion: [''],
        idArea: [''],
        idPuesto: [''],
        idCuadrante: [''],
        sueldoNeto: [''],
        sueldoBruto: [''],
        fechaContratacion: ['']
      });

      this.workAddressForm = this.fb.group({
        idTrabajoDomicilio: [''],
        idEmpleado: [''],
        idEstado: [''],
        idMunicipio: [''],
        domicilio: ['']
      });

      this.loadDependenciesAndStudies();
      this.loadEstadosAndMunicipios();
      this.loadContratosAreasCuadrantesAndPuestos();
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

  loadEstadosAndMunicipios(): void {
    this.peopleService.getEstados().subscribe(estados => {
      this.estados = estados;
    });

    this.peopleService.getMunicipios().subscribe(municipios => {
      this.municipios = municipios;
    });
  }

  loadContratosAreasCuadrantesAndPuestos(): void {
    this.peopleService.getContratos().subscribe(contratos => {
      this.contratos = contratos;
    });

    this.peopleService.getAreas().subscribe(areas => {
      this.areas = areas;
    });

    this.peopleService.getPuestos().subscribe(puestos => {
      this.puestos = puestos;
    });

    this.peopleService.getCuadrantes().subscribe(cuadrantes => {
      this.cuadrantes = cuadrantes;
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
      this.peopleService.getEstados().subscribe(estados => {
        this.estados = estados;
        const selectedEstados = this.estados.find(e => e.descripcion === data.estado);
        if (selectedEstados) {
          this.personalAddressForm.get('idEstado')!.setValue(selectedEstados.idEstado);
          this.workAddressForm.get('idEstado')!.setValue(selectedEstados.idEstado);
        }
      });

      this.peopleService.getMunicipios().subscribe(municipios => {
        this.municipios = municipios;
        const selectedMunicipios = this.municipios.find(m => m.nombre === data.municipio);
        if (selectedMunicipios) {
          this.personalAddressForm.get('idMunicipio')!.setValue(selectedMunicipios.idMunicipio);
          this.workAddressForm.get('idMunicipio')!.setValue(selectedMunicipios.idMunicipio);
        }
      });
    });

    this.peopleService.getWorkInfo(idPersona).subscribe(data => {
      this.workInfoForm.patchValue(data);
      this.peopleService.getContratos().subscribe(contratos => {
        this.contratos = contratos;
        const selectedContratos = this.contratos.find(c => c.descripcion === data.contratacion);
        if (selectedContratos) {
          this.workInfoForm.get('idTipoContratacion')!.setValue(selectedContratos.idTipoContratacion);
        }
      });

      this.peopleService.getAreas().subscribe(areas => {
        this.areas = areas;
        const selectedAreas = this.areas.find(a => a.clave === data.area);
        if (selectedAreas) {
          this.workInfoForm.get('idArea')!.setValue(selectedAreas.idArea);
        }
      });

      this.peopleService.getPuestos().subscribe(puestos => {
        this.puestos = puestos;
        const selectedPuestos = this.puestos.find(p => p.nombre === data.puesto);
        if (selectedPuestos) {
          this.workInfoForm.get('idPuesto')!.setValue(selectedPuestos.idPuesto);
        }
      });

      this.peopleService.getCuadrantes().subscribe(cuadrantes => {
        this.cuadrantes = cuadrantes;
        const selectedCuadrantes = this.cuadrantes.find(c => c.descripcion === data.idCuadrante);
        if (selectedCuadrantes) {
          this.workInfoForm.get('idCuadrante')!.setValue(selectedCuadrantes.idCuadrante);
        }
      });

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
          Swal.fire({
            title: 'Éxito',
            text: 'Información personal guardada exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error => {
          console.error('Error al guardar información personal:', error);
          if (error.status === 400 && error.error.errors) {
            const errorMessages = Object.values(error.error.errors).flat().join('\n');
            Swal.fire({
              title: 'Errores de validación',
              text: errorMessages,
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Error al guardar información personal. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'ID de Persona no encontrado en el almacenamiento local.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  savePersonalAddress(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
      const formData = this.personalAddressForm.value;
      formData.idPersona = idPersonaUsuario; // Añadir el ID al objeto de datos
  
      this.peopleService.updatePersonalAddress(formData).subscribe(
        _response => {
          Swal.fire({
            title: 'Éxito',
            text: 'Dirección personal guardada exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error => {
          console.error('Error al guardar dirección personal:', error);
          if (error.status === 400 && error.error.errors) {
            const errorMessages = Object.values(error.error.errors).flat().join('\n');
            Swal.fire({
              title: 'Errores de validación',
              text: errorMessages,
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Error al guardar dirección personal. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'ID de Persona no encontrado en el almacenamiento local.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  saveWorkInfo(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
      const formData = this.workInfoForm.value;
      formData.idPersona = idPersonaUsuario; // Añadir el ID al objeto de datos
  
      this.peopleService.updateWorkInfo(formData).subscribe(
        _response => {
          Swal.fire({
            title: 'Éxito',
            text: 'Información laboral guardada exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error => {
          console.error('Error al guardar información laboral:', error);
          if (error.status === 400 && error.error.errors) {
            const errorMessages = Object.values(error.error.errors).flat().join('\n');
            Swal.fire({
              title: 'Errores de validación',
              text: errorMessages,
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Error al guardar información laboral. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'ID de Persona no encontrado en el almacenamiento local.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  saveWorkAddress(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
      const formData = this.workAddressForm.value;
      formData.idPersona = idPersonaUsuario; // Añadir el ID al objeto de datos
  
      this.peopleService.updateWorkAddress(formData).subscribe(
        _response => {
          Swal.fire({
            title: 'Éxito',
            text: 'Dirección laboral guardada exitosamente.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error => {
          console.error('Error al guardar dirección laboral:', error);
          if (error.status === 400 && error.error.errors) {
            const errorMessages = Object.values(error.error.errors).flat().join('\n');
            Swal.fire({
              title: 'Errores de validación',
              text: errorMessages,
              icon: 'warning',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Error',
              text: 'Error al guardar dirección laboral. Por favor, intenta nuevamente.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      );
    } else {
      Swal.fire({
        title: 'Error',
        text: 'ID de Persona no encontrado en el almacenamiento local.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }


  closeDialog(): void {
    localStorage.removeItem('idPersonaUsuario');
    this.dialogRef.close();
    this.dialogClosed.emit();
  }
}