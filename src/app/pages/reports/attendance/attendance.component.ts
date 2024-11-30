import { Component, OnInit } from '@angular/core';
import { AttendanceService } from '../../../services/attendance-report.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  consultaType = '';
  personas: any[] = [];
  selectedPersona: any;
  fechaInicio: any;
  fechaFin: any;
  resultadoConsulta: any[] = [];
  excelDataAvailable = false;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void {
    this.loadPersonas();
  }

  loadPersonas() {
    this.attendanceService.getPersonas().subscribe((data) => {
      this.personas = data.map((persona: any) => ({
        id: persona.idPersona,
        nombre: `${persona.urlImagen} - ${persona.nombreCompleto}`,
      }));
    });
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
  
    // Lógica existente para realizar la búsqueda
    let payload: any = {};
    const formatFecha = (fecha: Date | null) =>
      fecha ? fecha.toISOString().split('T')[0] : ''; 
  
    switch (this.consultaType) {
      case '1': // Búsqueda por empleado
        payload = {
          tipoConsulta: '1',
          idEmpleado: this.selectedPersona?.id,
          fechas: [''],
        };
        break;
      case '2': // Buscar por comienzo de una fecha en específico
        payload = {
          tipoConsulta: '2',
          fechas: [formatFecha(this.fechaInicio)],
        };
        break;
      case '3': // Búsqueda por rango de fechas
        payload = {
          tipoConsulta: '3',
          fechas: [formatFecha(this.fechaInicio), formatFecha(this.fechaFin)],
        };
        break;
      case '4': // Búsqueda por empleado y rango de fechas
        payload = {
          tipoConsulta: '4',
          idEmpleado: this.selectedPersona?.id,
          fechas: [formatFecha(this.fechaInicio), formatFecha(this.fechaFin)],
        };
        break;
      default:
        return;
    }
  
    this.attendanceService.postConsulta(payload).subscribe({
      next: (response: any[]) => {
        this.resultadoConsulta = response;
        this.excelDataAvailable = true;
      },
      error: (err) => {
        console.error('Error en la consulta:', err);
        alert('Ocurrió un error al realizar la búsqueda. Por favor, verifica los datos ingresados.');
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
    });
  }
}