import { Injectable } from '@angular/core';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { NotificationDialogComponent } from '../pages/login/notification-dialog/notification-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class OverlayRefService {
  private overlayRef: OverlayRef | null = null;

  constructor(private overlay: Overlay) {}

  openNotificationDialog(data: any) {
    if (this.overlayRef) {
      this.overlayRef.dispose();
    }

    const overlayConfig = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-dark-backdrop',
      positionStrategy: overlayConfig,
      panelClass: 'custom-overlay-panel',
    });

    const portal = new ComponentPortal(NotificationDialogComponent);
    const componentRef = this.overlayRef.attach(portal);

    // Inyectar los datos manualmente en el componente
    componentRef.instance.data = data; // Asegurarse de pasar los datos al componente

    // Inyectar la lógica de cierre para que el componente pueda cerrar el overlay
    componentRef.instance.closeDialog = () => this.close();

    this.overlayRef.backdropClick().subscribe(() => this.close());

  }

  close() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}