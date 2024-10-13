import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MainComponent } from './main.component';
import { profileComponent } from '../pages/profile/profile.component';
import { PeopleComponent } from '../pages/people/people.component';
import { CoursesComponent } from '../pages/courses/courses.component';
import { HolidaysComponent } from '../pages/holidays/holidays.component';
import { CheckinComponent } from '../pages/checkin/checkin.component';
import { AttendanceComponent } from '../pages/reports/attendance/attendance.component';
import { unusualitiesComponent } from '../pages/reports/unusualities/unusualities.component';
import { passwordComponent } from '../pages/settings/passwordreset/password.component';
import { TickerAdminComponent } from '../pages/notifications/ticker-admin/ticker-admin.component';
import { AdminNotificationComponent } from '../pages/notifications/admin-notification/admin-notification.component';
import { NotificationsComponent } from '../pages/notifications/notifications.component';
import { RoleGuard } from '../components/guards/role.guard';
import { ValidationReportComponent } from '../pages/reports/validation-report/validation-report.component';
import { PrivacyPolicyComponent } from '../pages/privacy-policy/privacy-policy.component';




const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {path: 'checkin', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 3, 4, 5] }, component: CheckinComponent},
      {path: 'profile', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 3, 4, 5] }, component: profileComponent},
      {path: 'people', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 3] }, component: PeopleComponent},
      {path: 'courses', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 3, 4, 5] }, component: CoursesComponent},
      {path: 'news', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 3, 4, 5] }, component: NotificationsComponent},
      {path: 'ticker', canActivate: [RoleGuard], data: { expectedRole: [1] }, component: TickerAdminComponent},
      {path: 'adminnews', canActivate: [RoleGuard], data: { expectedRole: [1] }, component: AdminNotificationComponent},
      {path: 'holidays', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 3, 4, 5] }, component: HolidaysComponent},
      {path: 'unusualities', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 5] }, component: unusualitiesComponent},
      {path: 'attendance', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 5] }, component: AttendanceComponent},
      {path: 'validations', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 5] }, component: ValidationReportComponent},
      {path: 'passwordreset', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 3, 4, 5] }, component: passwordComponent},
      {path: 'privacy', canActivate: [RoleGuard], data: { expectedRole: [1, 2, 3, 4, 5] }, component: PrivacyPolicyComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
