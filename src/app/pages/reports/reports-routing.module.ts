import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { unusualitiesComponent } from './unusualities/unusualities.component';
import { AttendanceComponent } from './attendance/attendance.component';

const routes: Routes = [
  {
    path: 'unusualities',
    component: unusualitiesComponent
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
export class reportsRoutingModule { }
