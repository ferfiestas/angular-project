import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../../services/attendance-report.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  consultaType = '';
  personas: any[] = [];
  usuariosFiltrados: any[] = [];
  usuarioFiltro: string = ''; // Filtro para el buscador dentro del dropdown
  selectedPersona: any;
  fechaInicio: string | null = null;
  fechaFin: string | null = null;
  resultadoConsulta: any[] = [];
  excelDataAvailable = false;

  constructor(private attendanceService: AttendanceService) { }

  ngOnInit(): void {
    this.loadPersonas();
  }

  loadPersonas() {
    this.attendanceService.getPersonas().subscribe((data) => {
      this.personas = data.map((persona: any) => ({
        id: persona.idPersona,
        nombre: `${persona.urlImagen} - ${persona.nombreCompleto}`,
      }));
      this.usuariosFiltrados = [...this.personas];
    });
  }

  filtrarUsuarios() {
    if (this.usuarioFiltro.trim()) {
      this.usuariosFiltrados = this.personas.filter((persona) =>
        persona.nombre.toLowerCase().includes(this.usuarioFiltro.toLowerCase())
      );
    } else {
      this.usuariosFiltrados = [...this.personas];
    }
  }

  buscar() {
    if (!this.consultaType) {
      alert('Por favor, selecciona un tipo de consulta.');
      return;
    }

    if (
      (this.consultaType === '1' || this.consultaType === '4') &&
      !this.selectedPersona
    ) {
      alert('Por favor, selecciona un usuario.');
      return;
    }

    if (
      (this.consultaType === '2' || this.consultaType === '3' || this.consultaType === '4') &&
      !this.fechaInicio
    ) {
      alert('Por favor, selecciona la fecha de inicio.');
      return;
    }

    if (
      (this.consultaType === '3' || this.consultaType === '4') &&
      !this.fechaFin
    ) {
      alert('Por favor, selecciona la fecha de fin.');
      return;
    }

    let payload: any = {};

    switch (this.consultaType) {
      case '1':
        payload = {
          tipoConsulta: '1',
          idEmpleado: this.selectedPersona?.id,
          fechas: [''],
        };
        break;
      case '2':
        payload = {
          tipoConsulta: '2',
          fechas: [this.fechaInicio],
        };
        break;
      case '3':
        payload = {
          tipoConsulta: '3',
          fechas: [this.fechaInicio, this.fechaFin],
        };
        break;
      case '4':
        payload = {
          tipoConsulta: '4',
          idEmpleado: this.selectedPersona?.id,
          fechas: [this.fechaInicio, this.fechaFin],
        };
        break;
      default:
        return;
    }

    Swal.fire({
      title: 'Espera en lo que se recopila la información',
      text: 'Procesando datos...',
      allowOutsideClick: false,
      didOpen: () => {
        // Selecciona un botón de reemplazo para la animación de carga
        const buttonToReplace = document.querySelector('#loadingButton') as HTMLButtonElement;
        Swal.showLoading(buttonToReplace);  // Mostrar animación de carga
      },
    });

    this.attendanceService.postConsulta(payload).subscribe({
      next: (response: any[]) => {
        this.resultadoConsulta = response;
        this.excelDataAvailable = true;

        // Cerrar el mensaje de espera
        Swal.close();
      },
      error: (err) => {
        console.error('Error en la consulta:', err);
        Swal.close(); // Cerrar el mensaje de espera en caso de error
        Swal.fire('Error', 'Ocurrió un error al realizar la búsqueda.', 'error');
      },
    });
  }

  descargarExcel() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asistencias');

    worksheet.columns = [
      { header: 'ID Interno', key: 'idInterno', width: 15 },
      { header: 'Nombre Completo', key: 'nombreCompleto', width: 30 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Municipio', key: 'municipio', width: 20 },
      { header: 'Área', key: 'area', width: 25 },
      { header: 'Subárea', key: 'subArea', width: 25 },
      { header: 'Asistencia', key: 'asistencia1', width: 25 },
      { header: 'Descripción', key: 'descripcionAsistencia', width: 20 },
    ];

    this.resultadoConsulta.forEach((item) => {
      worksheet.addRow(item);
    });

    workbook.xlsx.writeBuffer().then((data) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'Asistencias.xlsx');

      // Limpiar los campos
      this.resetForm();
    });
  }

  resetForm() {
    this.consultaType = '';
    this.selectedPersona = null;
    this.usuarioFiltro = '';
    this.fechaInicio = null;
    this.fechaFin = null;
    this.excelDataAvailable = false;
  }
}