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
      start: new Date(2025, 11, 22), // 22 de Diciembre 2025
      end: new Date(2026, 0, 12),   // 12 de Enero 2026
      imageUrl: 'https://auditoriainterna.com.mx/notification_popup/invernales.png',
      alt: 'Notificación Interna'
    },
    {
      start: new Date(2025, 6, 8), // 8 de Julio 2025
      end: new Date(2025, 6, 14),     // 14 de Julio 2025
      imageUrl: 'https://auditoriainterna.com.mx/notification_popup/comunicado.png',
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