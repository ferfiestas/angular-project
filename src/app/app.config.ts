import { ApplicationConfig, importProvidersFrom, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { MatExpansionModule } from '@angular/material/expansion';
import { OverlayModule } from '@angular/cdk/overlay';
import { provideServiceWorker } from '@angular/service-worker';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { IntlService } from './services/intl-service.service';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule } from '@angular/router';

import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { routes } from './app.routes';

import { profileComponent } from './pages/profile/profile.component';
import { passwordComponent } from './pages/settings/passwordreset/password.component';
import { AccessService } from './services/access.service';
import { AttendanceService } from './services/attendance.service';
import { TickerAdminComponent, EditDialog } from './pages/notifications/ticker-admin/ticker-admin.component';
import { AdminNotificationComponent } from './pages/notifications/admin-notification/admin-notification.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { NotificationDialogComponent } from './pages/notifications/notification-dialog/notification-dialog.component';
import { PeopleComponent } from './pages/people/people.component';
import { EditPersonDialogComponent } from './pages/people/edit-person-dialog/edit-person-dialog.component';
import { MessageDialogComponent } from './pages/checkin/message-dialog/message-dialog.component';
import { ChangePasswordComponent } from './pages/settings/change-password/change-password.component';
import { CoursesComponent } from './pages/courses/courses.component';
import { SafeUrlPipe } from './components/pipes/safe-url.pipe';
import { ValidationReportComponent } from './pages/reports/validation-report/validation-report.component';
import { CourseManagementComponent } from './pages/courses/courses-admin/course-management/course-management.component';
import { CourseEditDialogComponent } from './pages/courses/courses-admin/course-edit-dialog/course-edit-dialog/course-edit-dialog/course-edit-dialog.component';
import { AttendanceComponent } from './pages/reports/attendance/attendance.component';
import { CreatePersonComponent } from './pages/people/create-person/create-person.component';

/** Creación del Token para el modo mantenimiento */
export const MANTENIMIENTO_MODE = new InjectionToken<boolean>('MANTENIMIENTO_MODE');

@NgModule({
  declarations: [
    profileComponent,
    passwordComponent,
    EditDialog,
    TickerAdminComponent,
    AdminNotificationComponent,
    NotificationsComponent,
    NotificationDialogComponent,
    PeopleComponent,
    EditPersonDialogComponent,
    MessageDialogComponent,
    ChangePasswordComponent,
    CoursesComponent,
    SafeUrlPipe,
    CourseManagementComponent,
    CourseEditDialogComponent,
    AttendanceComponent,
    CreatePersonComponent,
    ValidationReportComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule, 
    BrowserAnimationsModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule, 
    MatListModule, 
    MatIconModule, 
    MatToolbarModule, 
    MatDialogModule, 
    MatFormFieldModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatGridListModule,
    MatPaginatorModule,
    MatTabsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMomentDateModule,
    YouTubePlayerModule,
    NgxMatSelectSearchModule,
    MatExpansionModule,
    CdkMenuModule,
    RouterModule,
    OverlayModule
  ],
  providers: [
    AccessService, 
    { 
      provide: MAT_DATE_LOCALE, 
      useValue: 'es-ES',
      useFactory: (intlService: IntlService) => intlService.currentLocale,
      deps: [IntlService],
    }, 
    AttendanceService
  ],
})
export class AppModule { }

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideAnimations(),
    importProvidersFrom(HttpClientModule),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    /** Configuración de mantenimiento */
    { provide: MANTENIMIENTO_MODE, useValue: false } // Cambia a true para activar la página de mantenimiento
  ],
};
