import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-create-person',
  templateUrl: './create-person.component.html',
  styleUrls: ['./create-person.component.css']
})
export class CreatePersonComponent implements OnInit {
  createPersonForm!: FormGroup;

  // Listas de datos
  dependencias: any[] = [];
  estudios: any[] = [];
  contratos: any[] = [];
  areas: any[] = [];
  puestos: any[] = [];

  // Filtros dinámicos
  dependenciaFilterCtrl: FormControl = new FormControl();
  estudioFilterCtrl: FormControl = new FormControl();
  contratoFilterCtrl: FormControl = new FormControl();
  areaFilterCtrl: FormControl = new FormControl();
  puestoFilterCtrl: FormControl = new FormControl();

  filteredDependencias: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredEstudios: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredContratos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredAreas: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredPuestos: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  private onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder, private peopleService: PeopleService) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadDropdownData();
    this.initFilterListeners();
    this.listenToPuestoChanges();
  }

  // Inicializa el formulario
  initializeForm(): void {
    this.createPersonForm = this.fb.group({
      idInterno: [''],
      idDependencia: [''],
      idArea: [''],
      idPuesto: [''],
      sueldobruto: [{ value: '', disabled: true }],
      sueldoneto: [{ value: '', disabled: true }],
      idTipoContratacion: [''],
      nombreCompleto: ['', Validators.required],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      rfc: ['', Validators.required],
      curp: ['', Validators.required],
      telefonodeemergencia: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      domicilio: [''],
      correO_ELECTRONICO: ['', [Validators.required, Validators.email]],
      idEstudio: [''],
      idRole: [4] // Valor fijo
    });
  }

  // Cargar datos iniciales
  loadDropdownData(): void {
    this.peopleService.getDependencias().subscribe(data => {
      this.dependencias = data;
      this.filteredDependencias.next(data);
    });

    this.peopleService.getEstudios().subscribe(data => {
      this.estudios = data;
      this.filteredEstudios.next(data);
    });

    this.peopleService.getContratos().subscribe(data => {
      this.contratos = data;
      this.filteredContratos.next(data);
    });

    this.peopleService.getAreas().subscribe(data => {
      this.areas = data;
      this.filteredAreas.next(data);
    });

    this.peopleService.getPuestos().subscribe(data => {
      this.puestos = data;
      this.filteredPuestos.next(data);
    });
  }

  // Filtrado dinámico
  initFilterListeners(): void {
    this.dependenciaFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => this.filterDependencias());
    this.estudioFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => this.filterEstudios());
    this.contratoFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => this.filterContratos());
    this.areaFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => this.filterAreas());
    this.puestoFilterCtrl.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe(() => this.filterPuestos());
  }

  filterDependencias() { this.filteredDependencias.next(this.filterList(this.dependencias, this.dependenciaFilterCtrl.value)); }
  filterEstudios() { this.filteredEstudios.next(this.filterList(this.estudios, this.estudioFilterCtrl.value)); }
  filterContratos() { this.filteredContratos.next(this.filterList(this.contratos, this.contratoFilterCtrl.value)); }
  filterAreas() { this.filteredAreas.next(this.filterList(this.areas, this.areaFilterCtrl.value)); }
  filterPuestos() { this.filteredPuestos.next(this.filterList(this.puestos, this.puestoFilterCtrl.value)); }

  private filterList(list: any[], search: string): any[] {
    if (!search) return list; // Si no hay texto, devuelve la lista completa
    search = search.toLowerCase();
  
    return list.filter(item => 
      item.descripcion && item.descripcion.toLowerCase().includes(search)
    );
  }

  // Escuchar cambios en "Puesto"
  listenToPuestoChanges(): void {
    this.createPersonForm.get('idPuesto')!.valueChanges.subscribe(puestoId => {
      const puesto = this.puestos.find(p => p.idPuesto === puestoId);
      if (puesto) {
        this.createPersonForm.patchValue({
          sueldobruto: puesto.sueldoBruto,
          sueldoneto: puesto.sueldoNeto
        });
      }
    });
  }

  // Crear usuario
  createUser(): void {
    if (this.createPersonForm.invalid) {
      Swal.fire('Error', 'Revisa los campos del formulario.', 'warning');
      return;
    }
    this.peopleService.createPerson(this.createPersonForm.value).subscribe(
      () => Swal.fire('Éxito', 'Usuario creado exitosamente.', 'success'),
      () => Swal.fire('Error', 'Error al crear el usuario.', 'error')
    );
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  // Limpiar formulario

  resetForm(): void {
    this.createPersonForm.reset(); // Limpia los valores del formulario
    this.createPersonForm.patchValue({ idRole: 4 }); // Vuelve a asignar el valor fijo de idRole
    Swal.fire('Formulario Limpio', 'Todos los campos han sido limpiados.', 'info');
  }

}