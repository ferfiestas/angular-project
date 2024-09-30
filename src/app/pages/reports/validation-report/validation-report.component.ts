import { Component } from '@angular/core';
import { RepvalidadosService } from '../../../services/repvalidados.service';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-validation-report',
  templateUrl: './validation-report.component.html',
  styleUrls: ['./validation-report.component.css']
})
export class ValidationReportComponent {

  constructor(private repvalidadosService: RepvalidadosService) {}

  downloadExcel(): void {
    this.repvalidadosService.getRepValidados().subscribe(data => {
      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook();

      // Agrupar los datos según el "Estatus"
      const groupedData = this.groupBy(data, 'estatus');

      // Iterar sobre cada grupo para crear una pestaña por cada "Estatus"
      Object.keys(groupedData).forEach(estatus => {
        // Crear una hoja para cada "Estatus"
        const worksheet = workbook.addWorksheet(estatus);

        // Definir las columnas del archivo Excel
        worksheet.columns = [
          { header: 'ID Interno', key: 'idinterno', width: 15 },
          { header: 'Clave', key: 'clave', width: 10 },
          { header: 'Estado Trabajo', key: 'estadotrabajo', width: 20 },
          { header: 'Municipio', key: 'mun1', width: 20 },
          { header: 'División', key: 'division', width: 15 },
          { header: 'Cuadrante', key: 'cuadrante', width: 10 },
          { header: 'Dirección Estatal', key: 'direccionestatal', width: 30 },
          { header: 'Subdirección', key: 'subdireccion', width: 25 },
          { header: 'Nombre', key: 'nombre', width: 30 },
          { header: 'Tipo de Contratación', key: 'tipocontratacion', width: 20 },
          { header: 'Puesto', key: 'puesto', width: 25 },
          { header: 'Sueldo Bruto', key: 'sueldobruto', width: 15 },
          { header: 'ISR', key: 'isr', width: 15 },
          { header: 'IMSS', key: 'imss', width: 15 },
          { header: 'Sueldo Neto', key: 'sueldoneto', width: 15 },
          { header: 'Asignación Adicional', key: 'asignacionadicional', width: 20 },
          { header: 'Prima', key: 'prima', width: 15 },
          { header: 'Aguinaldo', key: 'aguinaldo', width: 15 },
          { header: 'Fecha Contratación', key: 'fechacontratacion', width: 20 },
          { header: 'Teléfono', key: 'telefono', width: 15 },
          { header: 'RFC', key: 'rfc', width: 15 },
          { header: 'CURP', key: 'curp', width: 20 },
          { header: 'Referencia', key: 'referencia', width: 20 },
          { header: 'Teléfono Emergencia', key: 'telemergencia', width: 15 },
          { header: 'Domicilio', key: 'domicilio', width: 30 },
          { header: 'Estado Residencia', key: 'estadoresidencia', width: 20 },
          { header: 'Municipio Residencia', key: 'municipioresidencia', width: 20 },
          { header: 'Correo', key: 'correo', width: 25 },
          { header: 'Estudios', key: 'estudios', width: 15 },
          { header: 'Dependencia', key: 'dependencia', width: 15 },
          { header: 'Estatus', key: 'estatus', width: 15 }
        ];

        // Añadir los datos del grupo correspondiente a la hoja
        groupedData[estatus].forEach((item: any) => {
          worksheet.addRow(item);
        });
      });

      // Generar el archivo y guardarlo
      workbook.xlsx.writeBuffer().then((buffer: any) => {
        const blob = new Blob([buffer], { type: EXCEL_TYPE });
        saveAs(blob, `reporte_validado_${new Date().getTime()}.xlsx`);
      });
    }, error => {
      console.error('Error al obtener los datos:', error);
    });
  }

  // Función para agrupar los datos según una clave
  groupBy(array: any[], key: string): any {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
      return result;
    }, {});
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';