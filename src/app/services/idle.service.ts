import { Injectable, NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout: any;
  private timeoutDuration = 5 * 60 * 1000; // 5 minutos en milisegundos

  constructor(private ngZone: NgZone) {}

  startWatching() {
    this.ngZone.runOutsideAngular(() => {
      const reset = this.resetTimeout.bind(this); // Crear una referencia a la función ligada a `this`
      window.addEventListener('mousemove', reset);
      window.addEventListener('click', reset);
      window.addEventListener('keypress', reset);
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
    window.location.href = 'https://auditoriainterna.com.mx/auditoriainterna'; // Redirigir al sitio especificado
  }

  stopWatching() {
    const reset = this.resetTimeout.bind(this); // Usar la misma referencia para remover los eventos
    if (this.idleTimeout) {
      clearTimeout(this.idleTimeout);
    }
    window.removeEventListener('mousemove', reset);
    window.removeEventListener('click', reset);
    window.removeEventListener('keypress', reset);
  }
}