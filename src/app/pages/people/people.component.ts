import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { PeopleService } from '../../services/people.service';
import { EditPersonDialogComponent } from './edit-person-dialog/edit-person-dialog.component';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent implements OnInit {
  searchRFC: string = '';
  persons: any[] = [];
  paginatedPersons: any[] = [];
  currentPage: number = 1;
  pageSize: number = 5;
  totalPages: number = 1;

  constructor(private peopleService: PeopleService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  search(): void {
    this.peopleService.searchPerson(this.searchRFC).subscribe(response => {
      if (response && response.length > 0) {
        this.persons = response;
        this.totalPages = Math.ceil(this.persons.length / this.pageSize);
        this.paginate(1); // Muestra la primera página de resultados
      } else {
        console.log('No se encontró ninguna persona con los datos proporcionados.');
      }
    }, error => {
      console.error('Error durante la búsqueda:', error);
    });
  }

  paginate(page: number): void {
    this.currentPage = page;
    const startIndex = (page - 1) * this.pageSize;
    this.paginatedPersons = this.persons.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.paginate(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.paginate(this.currentPage - 1);
    }
  }

  openEditDialog(person: any): void {
    if (person) {
      // Guardar identificadores en localStorage cuando se selecciona un usuario
      localStorage.setItem('idPersonaUsuario', person.idPersona);
      localStorage.setItem('idPerUsuario', person.idUsuario);

      let dialogWidth = '600px'; // Ancho predeterminado

      if (window.innerWidth <= 800) {
        dialogWidth = '55vw'; // Ancho para pantallas menores a 800px
      }

      const dialogRef = this.dialog.open(EditPersonDialogComponent, {
        width: dialogWidth,
        height: '600px', // Altura predeterminada
        maxWidth: '90vw',
        maxHeight: '90vh',
        data: { person }
      });

      dialogRef.afterClosed().subscribe(_result => {
        this.clearSelection();
      });
    }
  }

  clearSelection(): void {
    localStorage.removeItem('idPersonaUsuario');
    localStorage.removeItem('idPerUsuario');
    this.searchRFC = '';
    this.persons = [];
    this.paginatedPersons = [];
  }
}