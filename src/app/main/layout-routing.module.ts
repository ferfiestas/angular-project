import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { profileComponent } from '../pages/profile/profile.component';
import { PeopleComponent } from '../pages/people/people.component';
import { CoursesNewsComponent } from '../pages/courses-news/courses-news.component';
import { HolidaysComponent } from '../pages/holidays/holidays.component';
import { CheckinComponent } from '../pages/checkin/checkin.component';
import { AttendanceComponent } from '../pages/reports/attendance/attendance.component';
import { unusualitiesComponent } from '../pages/reports/unusualities/unusualities.component';
import { passwordComponent } from '../pages/settings/passwordreset/password.component';
import { TickerAdminComponent } from '../pages/notifications/ticker-admin/ticker-admin.component';
import { AdminNotificationComponent } from '../pages/notifications/admin-notification/admin-notification.component';




const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: 'profile', component: profileComponent},
      {path: 'people', component: PeopleComponent},
      {path: 'courses', component: CoursesNewsComponent},
      {path: 'ticker', component: TickerAdminComponent},
      {path: 'News', component: AdminNotificationComponent},
      {path: 'holidays', component: HolidaysComponent},
      {path: 'checkin', component: CheckinComponent},
      {path: 'unusualities', component: unusualitiesComponent},
      {path: 'attendance', component: AttendanceComponent},
      {path: 'passwordreset', component: passwordComponent},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
