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
  people: any[] = [];
  searchQuery: string = '';
  filters: any = {};
  page: number = 1;
  pageSize: number = 10;
  totalItems: number = 0;

  constructor(private peopleService: PeopleService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    const params = {
      search: this.searchQuery,
      ...this.filters,
      page: this.page,
      pageSize: this.pageSize
    };

    this.peopleService.getPeople(params).subscribe(response => {
      this.people = response;
      this.totalItems = response.length;
    });
  }

  onSearch(): void {
    this.page = 1;
    this.loadPeople();
  }

  onFilterChange(): void {
    this.page = 1;
    this.loadPeople();
  }

  onPageChange(page: number): void {
    this.page = page;
    this.loadPeople();
  }

  openEditDialog(person: any): void {
    const dialogRef = this.dialog.open(EditPersonDialogComponent, {
      width: '400px',
      data: { person }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadPeople();
      }
    });
  }
}
