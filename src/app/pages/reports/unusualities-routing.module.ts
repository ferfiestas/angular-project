import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsComponent } from './reports.component';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
  {
    path: 'unusualities',
    component: ReportsComponent
  },
  {
    path: 'attendance',
    component: AttendanceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnusualitiesRoutingModule { }
