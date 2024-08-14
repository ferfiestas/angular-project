import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
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
    ChangePasswordComponent
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
    MatSelectModule
  ],
  providers: [AccessService, AttendanceService],
})
export class AppModule { }

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(), provideAnimations(), importProvidersFrom(HttpClientModule), provideAnimationsAsync()]
};

