import { Component, OnInit } from '@angular/core';


import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-notification',
  templateUrl: './admin-notification.component.html',
  styleUrls: ['./admin-notification.component.css']
})
export class AdminNotificationComponent implements OnInit {
  notifications: Notification[] = [];
  newNotification: Notification = { id: 0, subject: '', body: '', read: false };

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(notifications => {
      this.notifications = notifications;
    });
  }

  createNotification(): void {
    this.notificationService.createNotification(this.newNotification).subscribe(() => {
      this.loadNotifications();
      this.newNotification = { id: 0, subject: '', body: '', read: false };
    });
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe(() => {
      this.loadNotifications();
    });
  }
}
