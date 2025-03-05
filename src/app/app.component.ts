import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker'; // Importa 'VersionReadyEvent' para manejar la actualización

import { MainComponent } from "../app/main/main.component";
import { AccessService } from './services/access.service';
import { AuthStatus } from './components/interfaces/auth-status.enum';
import { MANTENIMIENTO_MODE } from './app.config'; // Importamos el Modo Mantenimiento

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [MainComponent, RouterModule, RouterOutlet, CommonModule]
})
export class AppComponent implements OnInit {
  title = 'SEP';

  private accessService = inject(AccessService);
  private router = inject(Router);
  private updates = inject(SwUpdate); // Inyectamos SwUpdate para las actualizaciones
  private mantenimiento = inject(MANTENIMIENTO_MODE); // Inyectamos el modo mantenimiento

  constructor() {
    this.checkForUpdates(); // Llamar al método para verificar actualizaciones al inicializar el componente
  }

  ngOnInit() {
    // Si mantenimiento está activado, redirigir a /mantenimiento
    if (this.mantenimiento) {
      
      this.router.navigate(['/mantenimiento']);
    }
  }

  // Método para verificar y manejar las actualizaciones del Service Worker
  private checkForUpdates() {
    if (this.updates.isEnabled) {
      this.updates.versionUpdates.subscribe(event => {
        if (event.type === 'VERSION_READY') {
          const update = confirm('¡Nueva versión disponible! ¿Deseas actualizar?');
          if (update) {
            window.location.reload(); // Recargar la página para aplicar la nueva versión
          }
        }
      });
    }
  }

  public finishedAuthCheck = computed<boolean>(() => {
    if (this.accessService.authStatus()() === AuthStatus.checking) {
      return false;
    }
    return true;
  });

  public authStatusChangedEffect = effect(() => {
    // Si mantenimiento está activo, evitar cambios de rutas
    if (this.mantenimiento) return;

    switch (this.accessService.authStatus()()) {
      case AuthStatus.checking:
        return;
      case AuthStatus.authenticated:
        this.router.navigateByUrl('main');
        return;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('auth');
        return;
    }
  });
}
