import { Injectable } from '@angular/core';

interface Notification {
  start: Date;
  end: Date;
  imageUrl: string;
  alt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PopupNotificationService {

  private notifications: Notification[] = [
    {
      start: new Date(2025, 6, 3), // 3 de Julio 2025
      end: new Date(2025, 6, 9),   // 9 de Julio 2025
      imageUrl: 'https://encompletadisonancia.com.mx/notification_popup/paselista.jpg',
      alt: 'Notificación Interna'
    },
    {
      start: new Date(2024, 11, 10), // 25 de diciembre 2024
      end: new Date(2025, 0, 8),     // 8 de enero 2025
      imageUrl: 'https://encompletadisonancia.com.mx/notification_popup/vacaciones.png',
      alt: 'Notificación de Navidad'
    }
  ];

  constructor() { }

  getActiveNotifications(): Notification[] {
    const today = new Date();
    return this.notifications.filter(
      notification => today >= notification.start && today <= notification.end
    );
  }
}