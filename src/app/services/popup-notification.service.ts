import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupNotificationService {

  private notificationStart: Date = new Date(2024, 8, 26); // Fecha de inicio
  private notificationEnd: Date = new Date(2024, 9, 1); // Fecha de fin
  private notificationImageUrl: string = 'http://auditoriainterna.com.mx/notification_popup/asueto.jpg';

  constructor() { }

  shouldShowNotification(): boolean {
    const today = new Date();
    return today >= this.notificationStart && today <= this.notificationEnd;
  }

  getNotificationImageUrl(): string {
    return `${this.notificationImageUrl}?timestamp=${new Date().getTime()}`;
  }
}