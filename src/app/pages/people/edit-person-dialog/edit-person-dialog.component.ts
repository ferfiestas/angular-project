import { Component, Inject, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
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
  estatus: any[] = [];
  subareas: any[] = [];

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
  estatusFilterCtrl: FormControl = new FormControl();
  subareaFilterCtrl: FormControl = new FormControl();

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
  filteredEstatus: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredSubAreas: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  private onDestroy = new Subject<void>();

  // Variable to store the valid image URL or the default one
  validImageUrl: string = 'https://auditoriainterna.com.mx/photo_upload/img00000.jpg';  // Imagen por defecto

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
        telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        telEmergencia: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        email: [''],
        idDependencia: [''],
        idEstudio: [''],
        estudio: [''],
        idEstatus: [''],
        urlImagen: ['']
      });

      this.loadImageWithExtensions();  // Cargar la imagen con las extensiones posibles

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
        idSubArea: [''],
        idPuesto: [''],
        asignacionAdicional: [''],
        fechaContratacion: [''],
        sueldoBruto: [{ value: '', disabled: true }],
        sueldoNeto: [{ value: '', disabled: true }]
      });

      this.workAddressForm = this.fb.group({
        idTrabajoDomicilio: [''],
        idEmpleado: [''],
        idEstado: [''],
        idMunicipio: [''],
        idCuadrante: [''],
        idDivision: [''],
        domicilio: ['']
      });

      this.loadDependenciesStudiesAndStatus();
      this.loadEstadosAndMunicipios();
      this.loadContratosAreasSubAreasCuadrantesPuestosAndDivisiones();
      this.loadPersonData(idPersonaUsuario);

      // Escuchar los cambios en el puesto y actualizar los sueldos
      this.workInfoForm.get('idPuesto')!.valueChanges
        .pipe(takeUntil(this.onDestroy))
        .subscribe(puestoId => {
          if (puestoId) {
            // Cuando se cambia el puesto, buscamos el puesto seleccionado
            this.peopleService.getPuestos().subscribe(puestos => {
              const selectedPuesto = puestos.find(p => p.idPuesto === puestoId);
              if (selectedPuesto) {
                // Actualizamos los valores de sueldo bruto y sueldo neto
                this.workInfoForm.get('sueldoBruto')!.setValue(selectedPuesto.sueldoBruto);
                this.workInfoForm.get('sueldoNeto')!.setValue(selectedPuesto.sueldoNeto);
              }
            });
          }
        });
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

    this.subareaFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterSubAreas();
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

    this.estatusFilterCtrl.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(() => {
        this.filterEstatus();
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
      this.areas.filter(areaDescripcion => areaDescripcion.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  filterSubAreas(): void {
    let search = this.subareaFilterCtrl.value;
    if (!search) {
      this.filteredSubAreas.next(this.subareas.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredSubAreas.next(
      this.subareas.filter(subAreaDescripcion => subAreaDescripcion.descripcion.toLowerCase().indexOf(search) > -1)
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

  filterEstatus(): void {
    let search = this.estatusFilterCtrl.value;
    if (!search) {
      this.filteredEstatus.next(this.estatus.slice());
      return;
    }
    search = search.toLowerCase();
    this.filteredEstatus.next(
      this.estatus.filter(estatus => estatus.descripcion.toLowerCase().indexOf(search) > -1)
    );
  }

  loadDependenciesStudiesAndStatus(): void {
    this.peopleService.getDependencias().subscribe(dependencias => {
      this.dependencias = dependencias;
      this.filteredDependencias.next(this.dependencias.slice());
    });

    this.peopleService.getEstudios().subscribe(estudios => {
      this.estudios = estudios;
      this.filteredEstudios.next(this.estudios.slice());
    });

    this.peopleService.getEstatus().subscribe(estatus => {
      this.estatus = estatus;
      this.filteredEstatus.next(this.estatus.slice());
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

  loadContratosAreasSubAreasCuadrantesPuestosAndDivisiones(): void {
    this.peopleService.getContratos().subscribe(contratos => {
      this.contratos = contratos;
      this.filteredContratos.next(this.contratos.slice());
    });

    this.peopleService.getAreas().subscribe(areas => {
      this.areas = areas;
      this.filteredAreas.next(this.areas.slice());
    });

    this.peopleService.getSubArea().subscribe(subareas => {
      this.subareas = subareas;
      this.filteredSubAreas.next(this.subareas.slice());
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
      if (this.personalInfoForm.get('urlImagen')?.value) {
        this.loadImageWithExtensions();
      }
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

      this.peopleService.getEstatus().subscribe(estatus => {
        this.estatus = estatus;
        const selectedEstatus = this.estatus.find(estatus => estatus.descripcion === data.estatus);
        if (selectedEstatus) {
          this.personalInfoForm.get('idEstatus')!.setValue(selectedEstatus.idEstatus);
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
        const selectedAreas = this.areas.find(a => a.descripcion === data.areaDescripcion);
        if (selectedAreas) {
          this.workInfoForm.get('idArea')!.setValue(selectedAreas.idArea);
        }
      });

      this.peopleService.getSubArea().subscribe(subareas => {
        this.subareas = subareas;
        const selectedSubAreas = this.subareas.find(s => s.descripcion === data.subAreaDescripcion);
        if (selectedSubAreas) {
          this.workInfoForm.get('idSubArea')!.setValue(selectedSubAreas.idSubArea);
        }
      });

      this.peopleService.getPuestos().subscribe(puestos => {
        this.puestos = puestos;
        const selectedPuestos = this.puestos.find(p => p.nombre === data.puesto);
        if (selectedPuestos) {
          this.workInfoForm.get('idPuesto')!.setValue(selectedPuestos.idPuesto);
          this.workInfoForm.get('sueldoBruto')!.setValue(selectedPuestos.sueldoBruto);
          this.workInfoForm.get('sueldoNeto')!.setValue(selectedPuestos.sueldoNeto);
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
          this.workAddressForm.get('idEstado')!.setValue(selectedEstados.idEstado);
        }
      });

      this.peopleService.getMunicipios().subscribe(municipios => {
        this.municipios = municipios;
        const selectedMunicipios = this.municipios.find(m => m.nombre === data.municipio);
        if (selectedMunicipios) {
          this.workAddressForm.get('idMunicipio')!.setValue(selectedMunicipios.idMunicipio);
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

  async loadImageWithExtensions(): Promise<void> {
    const userImageUrl = this.personalInfoForm.get('urlImagen')?.value;
    const baseUrl = 'https://auditoriainterna.com.mx/photo_upload/';
    const extensions = ['jpg', 'png', 'jpeg'];

    if (userImageUrl) {
      for (const ext of extensions) {
        const imageUrl = `${baseUrl}${userImageUrl}.${ext}`;
        const imageExists = await this.checkImage(imageUrl);
        if (imageExists) {
          this.validImageUrl = imageUrl;
          return;  // Exit once a valid image is found
        }
      }
    }
  }

  // Verifica si la imagen existe
  checkImage(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve(true);  // Si la imagen se carga correctamente
      img.onerror = () => resolve(false);  // Si hay error al cargar la imagen
    });
  }


  savePersonalInfo(): void {
    const idPersonaUsuario = localStorage.getItem('idPersonaUsuario');
    const userRole = localStorage.getItem('userRole');

    if (idPersonaUsuario) {
      const formData = this.personalInfoForm.value;
      formData.idPersona = idPersonaUsuario;

      if (userRole === '3') {
        // Llama a la función con idEstatus fijo a "2"
        this.peopleService.updatePersonalInfoValidator(formData).subscribe(
          _response => {
            Swal.fire({
              title: 'Éxito',
              text: 'Información personal guardada exitosamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Recarga los datos después de guardar
              this.loadPersonData(idPersonaUsuario);
            });
          },
          error => {
            this.handleSaveError(error);
          }
        );
      } else if (userRole === '1' || userRole === '2') {
        // Llama a la función con idEstatus variable
        this.peopleService.updatePersonalInfo(formData).subscribe(
          _response => {
            Swal.fire({
              title: 'Éxito',
              text: 'Información personal guardada exitosamente.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              // Recarga los datos después de guardar
              this.loadPersonData(idPersonaUsuario);
            });
          },
          error => {
            this.handleSaveError(error);
          }
        );
      } else {
        // Si no es 1, 2 o 3, muestra un mensaje y no procede
        Swal.fire({
          title: 'Acción no permitida',
          text: 'No tienes permisos para realizar esta acción.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    } else {
      Swal.fire({
        title: 'Error',
        text: 'ID de Persona no encontrado en el almacenamiento local.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }

  private handleSaveError(error: any): void {
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
          }).then(() => {
            // Recarga los datos de la dirección después de guardar
            this.peopleService.getPersonalAddress(idPersonaUsuario).subscribe(addressData => {
              this.personalAddressForm.patchValue(addressData);
            });
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
          }).then(() => {
            // Recarga la información laboral después de guardar
            this.peopleService.getWorkInfo(idPersonaUsuario).subscribe(workData => {
              this.workInfoForm.patchValue(workData);

              // Recarga la información del puesto y sueldos después de guardar
              this.peopleService.getPuestos().subscribe(puestos => {
                const selectedPuesto = puestos.find(p => p.idPuesto === workData.idPuesto);
                if (selectedPuesto) {
                  // Actualiza los valores de sueldo bruto y neto en el formulario
                  this.workInfoForm.get('sueldoBruto')!.setValue(selectedPuesto.sueldoBruto);
                  this.workInfoForm.get('sueldoNeto')!.setValue(selectedPuesto.sueldoNeto);
                }
              });
            });
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
          }).then(() => {
            // Recarga los datos de la dirección laboral después de guardar
            this.peopleService.getWorkAddress(idPersonaUsuario).subscribe(workAddressData => {
              this.workAddressForm.patchValue(workAddressData); // Actualiza el formulario con los datos
            });
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