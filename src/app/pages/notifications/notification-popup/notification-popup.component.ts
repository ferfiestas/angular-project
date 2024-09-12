import { Component, OnInit } from '@angular/core';
import { PopupNotificationService } from '../../../services/popup-notification.service';

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrls: ['./notification-popup.component.css']
})
export class NotificationPopupComponent implements OnInit {
  showPopup: boolean = false;
  imageUrl: string = '';

  constructor(private popupNotificationService: PopupNotificationService) {}

  ngOnInit(): void {
    // Mostrar el pop-up si las condiciones se cumplen
    if (this.popupNotificationService.shouldShowNotification()) {
      this.showPopup = true;
      this.imageUrl = this.popupNotificationService.getNotificationImageUrl();
    }
  }

  closePopup(): void {
    this.showPopup = false;
  }
}