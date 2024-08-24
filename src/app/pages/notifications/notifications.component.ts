import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { NotificationService, Notification } from '../../services/notification.service';
import { NotificationDialogComponent } from '../notifications/notification-dialog/notification-dialog.component';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];

  constructor(private notificationService: NotificationService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  openNotification(notification: Notification): void {
    const width = this.getDialogWidth();

    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: width,
      height: 'auto',
      maxWidth: '100vw', // Asegura que no se desborde en pantallas pequeñas
      maxHeight: '100vh', // Asegura que no se desborde en pantallas pequeñas
      data: notification
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.markAsRead(notification.id).subscribe(() => {
          this.loadNotifications();
        });
      }
    });
  }

  getDialogWidth(): string {
    const screenWidth = window.innerWidth;

    if (screenWidth > 1080) {
      return '600px';
    } else if (screenWidth > 800) {
      return '500px';
    } else if (screenWidth > 500) {
      return '300px';
    } else if (screenWidth > 400) {
      return '230px';
    } else if (screenWidth > 300) {
      return '180px';
    } else {
      return '100px';
    }
  }
}