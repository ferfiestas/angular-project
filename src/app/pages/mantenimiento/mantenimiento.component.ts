import { Component, OnInit, inject } from '@angular/core';
import { PopupNotificationService } from '../../services/popup-notification.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mantenimiento',
  standalone: true,
  imports: [],
  templateUrl: './mantenimiento.component.html',
  styleUrls: ['./mantenimiento.component.css']
})
export class MantenimientoComponent implements OnInit {

  private popupNotificationService = inject(PopupNotificationService);

  ngOnInit(): void {
    const activeNotifications = this.popupNotificationService.getActiveNotifications();
    if (activeNotifications.length > 0) {
      this.showNotificationsSequentially(activeNotifications);
    }
  }

  private showNotificationsSequentially(notifications: any[]) {
    const showNext = (index: number) => {
      if (index >= notifications.length) return;

      const notification = notifications[index];

      Swal.fire({
        title: '¡Aviso importante!',
        imageUrl: `${notification.imageUrl}?timestamp=${new Date().getTime()}`,
        imageHeight: 400,
        imageAlt: notification.alt,
        confirmButtonText: 'Aceptar'
      }).then(() => showNext(index + 1));
    };

    showNext(0);
  }
}