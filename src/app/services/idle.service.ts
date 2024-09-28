import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout: any;
  private timeoutDuration = 5 * 60 * 1000; // 5 minutos en milisegundos

  constructor(private ngZone: NgZone) {}

  startWatching() {
    // Usamos NgZone para asegurarnos de que no haya problemas de rendimiento en Angular al usar eventos globales
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('mousemove', () => this.resetTimeout());
      window.addEventListener('click', () => this.resetTimeout());
      window.addEventListener('keypress', () => this.resetTimeout());
      this.resetTimeout();
    });
  }

  resetTimeout() {
    // Cancelamos cualquier timeout anterior y empezamos uno nuevo
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    this.idleTimeout = setTimeout(() => this.ngZone.run(() => this.logout()), this.timeoutDuration);
  }

  logout() {
    localStorage.clear(); // Limpiamos el localStorage al cerrar sesión por inactividad
    window.location.href = 'http://auditoriainterna.com.mx/auditoriainterna'; // Redirigir al sitio especificado
  }

  stopWatching() {
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    // Remover eventos para detener el monitoreo de inactividad
    window.removeEventListener('mousemove', this.resetTimeout);
    window.removeEventListener('click', this.resetTimeout);
    window.removeEventListener('keypress', this.resetTimeout);
  }
}