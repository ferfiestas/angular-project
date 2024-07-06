import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


import { NotificationService, Notification } from '../../../services/notification.service';

@Component({
  selector: 'app-admin-notification',
  templateUrl: './admin-notification.component.html',
  styleUrls: ['./admin-notification.component.css']
})
export class AdminNotificationComponent implements OnInit {
  notifications: Notification[] = [];
  newNotification: Notification = { id: 0, subject: '', body: '', read: false };

  constructor(private notificationService: NotificationService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(  
      (notifications) => {
        this.notifications = notifications;
      },
      (error) => {
        this.snackBar.open('Error al cargar notificaciones', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error fetching notifications:', error);
      }
    );
  }

  createNotification(): void {
    this.notificationService.createNotification(this.newNotification).subscribe(
      (notification) => {
        this.notifications.push(notification);
        this.newNotification = { id: 0, subject: '', body: '', read: false };
        this.snackBar.open('Notificación creada', 'Cerrar', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open('Error al crear notificación', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error creating notification:', error);
      }
    );
  }

  deleteNotification(id: number): void {
    this.notificationService.deleteNotification(id).subscribe(
      () => {
        this.notifications = this.notifications.filter(notification => notification.id !== id);
        this.snackBar.open('Notificación eliminada', 'Cerrar', {
          duration: 3000,
        });
      },
      (error) => {
        this.snackBar.open('Error al eliminar notificación', 'Cerrar', {
          duration: 3000,
        });
        console.error('Error deleting notification:', error);
      }
    );
  }
}
