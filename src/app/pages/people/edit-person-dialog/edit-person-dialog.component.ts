import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
  divisiones: any[] = [];

  // FormControls for the search filters
  dependenciaFilterCtrl: FormControl = new FormControl();
  estudioFilterCtrl: FormControl = new FormControl();
  estadoFilterCtrl: FormControl = new FormControl();
  municipioFilterCtrl: FormControl = new FormControl();
  contratoFilterCtrl: FormControl = new FormControl();
  areaFilterCtrl: FormControl = new FormControl();
  puestoFilterCtrl: FormControl = new FormControl();
  cuadranteFilterCtrl: FormControl = new FormControl();
  divisionFilterCtrl: FormControl = new FormControl();

  // Filtered lists
  filteredDependencias: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredEstudios: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredEstados: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredMunicipios: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredContratos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAreas: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredPuestos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredCuadrantes: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDivisiones: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  private onDestroy = new Subject<void>();

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
        sueldoNeto: [''],
        sueldoBruto: [''],
        fechaContratacion: ['']
      });

      this.workAddressForm = this.fb.group({
        idTrabajoDomicilio: [''],
        idEmpleado: [''],
        idEstadoTrabajo: [''],
        idMunicipioTrabajo: [''],
        idCuadrante: [''],
        idDivision: [''],
        domicilio: ['']
      });

      this.loadDependenciesAndStudies();
      this.loadEstadosAndMunicipios();
      this.loadContratosAreasCuadrantesPuestosAndDivisiones();
      this.loadPersonData(idPersonaUsuario);
    }

    this.initFilterListeners();
  }

  initFilterListeners(): void {
    this.dependenciaFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterDependencias();
      });

    this.estudioFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterEstudios();
      });

    this.estadoFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterEstados();
      });

    this.municipioFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterMunicipios();
      });

    this.contratoFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterContratos();
      });

    this.areaFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterAreas();
      });

    this.puestoFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterPuestos();
      });

    this.cuadranteFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterCuadrantes();
      });

      this.divisionFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterDivisiones();
      });
  }

  filterDependencias(): void {
    let search = this.dependenciaFilterCtrl.value;
    if (!search) {
      this.filteredDependencias.next(this.dependencias.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredDependencias.next(
      this.dependencias.filter(dependencia => dependencia.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  filterEstudios(): void {
    let search = this.estudioFilterCtrl.value;
    if (!search) {
      this.filteredEstudios.next(this.estudios.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredEstudios.next(
      this.estudios.filter(estudio => estudio.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  filterEstados(): void {
    let search = this.estadoFilterCtrl.value;
    if (!search) {
      this.filteredEstados.next(this.estados.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredEstados.next(
      this.estados.filter(estado => estado.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  filterMunicipios(): void {
    let search = this.municipioFilterCtrl.value;
    if (!search) {
      this.filteredMunicipios.next(this.municipios.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredMunicipios.next(
      this.municipios.filter(municipio => municipio.nombre.toLowerCase().indexOf(search) > -1)
    );
  }

  filterContratos(): void {
    let search = this.contratoFilterCtrl.value;
    if (!search) {
      this.filteredContratos.next(this.contratos.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredContratos.next(
      this.contratos.filter(contrato => contrato.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  filterAreas(): void {
    let search = this.areaFilterCtrl.value;
    if (!search) {
      this.filteredAreas.next(this.areas.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredAreas.next(
      this.areas.filter(areaClave => areaClave.clave.toLowerCase().indexOf(search) > -1)
    );
  }

  filterPuestos(): void {
    let search = this.puestoFilterCtrl.value;
    if (!search) {
      this.filteredPuestos.next(this.puestos.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredPuestos.next(
      this.puestos.filter(puesto => puesto.nombre.toLowerCase().indexOf(search) > -1)
    );
  }

  filterCuadrantes(): void {
    let search = this.cuadranteFilterCtrl.value;
    if (!search) {
      this.filteredCuadrantes.next(this.cuadrantes.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredCuadrantes.next(
      this.cuadrantes.filter(cuadrante => cuadrante.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

    filterDivisiones(): void {
      let search = this.divisionFilterCtrl.value;
      if (!search) {
        this.filteredDivisiones.next(this.divisiones.slice());
        return;
      }
      search = search.toLowerCase();
      this.filteredDivisiones.next(
        this.divisiones.filter(division => division.descripcion.toLowerCase().indexOf(search) > -1)
      );
  }

  loadDependenciesAndStudies(): void {
    this.peopleService.getDependencias().subscribe(dependencias => {
      this.dependencias = dependencias;
      this.filteredDependencias.next(this.dependencias.slice());
    });

    this.peopleService.getEstudios().subscribe(estudios => {
      this.estudios = estudios;
      this.filteredEstudios.next(this.estudios.slice());
    });
  }

  loadEstadosAndMunicipios(): void {
    this.peopleService.getEstados().subscribe(estados => {
      this.estados = estados;
      this.filteredEstados.next(this.estados.slice());
    });

    this.peopleService.getMunicipios().subscribe(municipios => {
      this.municipios = municipios;
      this.filteredMunicipios.next(this.municipios.slice());
    });
  }

  loadContratosAreasCuadrantesPuestosAndDivisiones(): void {
    this.peopleService.getContratos().subscribe(contratos => {
      this.contratos = contratos;
      this.filteredContratos.next(this.contratos.slice());
    });

    this.peopleService.getAreas().subscribe(areas => {
      this.areas = areas;
      this.filteredAreas.next(this.areas.slice());
    });

    this.peopleService.getPuestos().subscribe(puestos => {
      this.puestos = puestos;
      this.filteredPuestos.next(this.puestos.slice());
    });

    this.peopleService.getCuadrantes().subscribe(cuadrantes => {
      this.cuadrantes = cuadrantes;
      this.filteredCuadrantes.next(this.cuadrantes.slice());
    });

    this.peopleService.getDivisiones().subscribe(divisiones => {
      this.divisiones = divisiones;
      this.filteredDivisiones.next(this.divisiones.slice());
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
        }
      });

      this.peopleService.getMunicipios().subscribe(municipios => {
        this.municipios = municipios;
        const selectedMunicipios = this.municipios.find(m => m.nombre === data.municipio);
        if (selectedMunicipios) {
          this.personalAddressForm.get('idMunicipio')!.setValue(selectedMunicipios.idMunicipio);
          this.workAddressForm.get('idMunicipioTrabajo')!.setValue(selectedMunicipios.idMunicipio);
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
        const selectedAreas = this.areas.find(a => a.clave === data.areaClave);
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

    });

    this.peopleService.getWorkAddress(idPersona).subscribe(data => {
      this.workAddressForm.patchValue(data);
      this.peopleService.getCuadrantes().subscribe(cuadrantes => {
        this.cuadrantes = cuadrantes;
        const selectedCuadrantes = this.cuadrantes.find(c => c.descripcion === data.cuadrante);
        if (selectedCuadrantes) {
          this.workAddressForm.get('idCuadrante')!.setValue(selectedCuadrantes.idCuadrante);
        }
      });

      this.peopleService.getEstados().subscribe(estados => {
        this.estados = estados;
        const selectedEstados = this.estados.find(e => e.descripcion === data.estado);
        if (selectedEstados) {
          this.workAddressForm.get('idEstadoTrabajo')!.setValue(selectedEstados.idEstado);
        }
      });

      this.peopleService.getMunicipios().subscribe(municipios => {
        this.municipios = municipios;
        const selectedMunicipios = this.municipios.find(m => m.nombre === data.municipio);
        if (selectedMunicipios) {
          this.workAddressForm.get('idMunicipioTrabajo')!.setValue(selectedMunicipios.idMunicipio);
        }
      });

      this.peopleService.getDivisiones().subscribe(divisiones => {
        this.divisiones = divisiones;
        const selectedDivisiones = this.divisiones.find(d => d.descripcion === data.division);
        if (selectedDivisiones) {
          this.workAddressForm.get('idDivision')!.setValue(selectedDivisiones.idDivision);
        }
      });

    });
  }

  savePersonalInfo(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    if (idPersonaUsuario) {
      const formData = this.personalInfoForm.value;
      formData.idPersona = idPersonaUsuario;

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
      formData.idPersona = idPersonaUsuario;

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
      formData.idPersona = idPersonaUsuario;

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
      formData.idPersona = idPersonaUsuario;

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

  ngOnDestroy() {
    this.onDestroy.next();
    this.onDestroy.complete();
  }
}