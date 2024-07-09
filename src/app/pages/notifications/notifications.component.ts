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
    const dialogRef = this.dialog.open(NotificationDialogComponent, {
      width: '400px',
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
}
