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
  person: any = null;

  constructor(private peopleService: PeopleService, private dialog: MatDialog) {}

  ngOnInit(): void {}

  search(): void {
    this.peopleService.searchPersonByRFC(this.searchRFC).subscribe(response => {
      if (response) {
        this.peopleService.getPersonById(localStorage.getItem('idPersonaUsuario')!).subscribe(person => {
          this.person = person;
        });
      }
    });
  }

  openEditDialog(): void {
    if (this.person) {
      let dialogWidth = '600px'; // Ancho predeterminado

      if (window.innerWidth <= 800) {
        dialogWidth = '55vw'; // Ancho para pantallas menores a 800px
      }

      const dialogRef = this.dialog.open(EditPersonDialogComponent, {
        width: dialogWidth,
        height: '600px', // Altura predeterminada
        maxWidth: '90vw',
        maxHeight: '90vh',
        data: { person: this.person }
      });

      dialogRef.afterClosed().subscribe(_result => {
        // Limpiar la persona después de cerrar el diálogo
        this.person = null;
        localStorage.removeItem('idPersonaUsuario');
        localStorage.removeItem('idPerUsuario');
        this.searchRFC = '';
      });
    }
  }
}