import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PopupNotificationService {

  private notificationStart: Date = new Date(2024, 11, 10); // Fecha de inicio
  private notificationEnd: Date = new Date(2024, 24, 30); // Fecha de fin
  private notificationImageUrl: string = 'https://encompletadisonancia.com.mx/notification_popup/msjok.png';

  constructor() { }

  shouldShowNotification(): boolean {
    const today = new Date();
    return today >= this.notificationStart && today <= this.notificationEnd;
  }

  getNotificationImageUrl(): string {
    return `${this.notificationImageUrl}?timestamp=${new Date().getTime()}`;
  }
}