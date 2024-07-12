import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PeopleService } from '../../../services/people.service';

@Component({
  selector: 'app-edit-person-dialog',
  templateUrl: './edit-person-dialog.component.html',
  styleUrls: ['./edit-person-dialog.component.css']
})
export class EditPersonDialogComponent {
  person: any;

  constructor(
    private dialogRef: MatDialogRef<EditPersonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private peopleService: PeopleService
  ) {
    this.person = { ...data.person };
  }

  save(): void {
    this.peopleService.updatePerson(this.person.id, this.person).subscribe(() => {
      this.dialogRef.close(true);
    });
  }

  delete(): void {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.peopleService.deletePerson(this.person.id).subscribe(() => {
        this.dialogRef.close(true);
      });
    }
  }
}
