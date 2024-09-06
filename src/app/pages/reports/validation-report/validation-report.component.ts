import { Component } from '@angular/core';

import { RepvalidadosService } from '../../../services/repvalidados.service';
import * as XLSX from 'xlsx';
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
      // Convertir datos a formato Excel
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
      const workbook: XLSX.WorkBook = { Sheets: { 'Datos': worksheet }, SheetNames: ['Datos'] };
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

      // Guardar el archivo Excel
      this.saveAsExcelFile(excelBuffer, 'repvalidados');
    }, error => {
      console.error('Error al obtener los datos:', error);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_${new Date().getTime()}.xlsx`);
  }
}

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';