import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class IdleService {
  private idleTimeout: any;
  private timeoutDuration = 30 * 60 * 1000; // 30 minutos en milisegundos

  constructor(private router: Router) {}

  startWatching() {
    window.addEventListener('mousemove', () => this.resetTimeout());
    window.addEventListener('click', () => this.resetTimeout());
    window.addEventListener('keypress', () => this.resetTimeout());
    this.resetTimeout();
  }

  resetTimeout() {
    clearTimeout(this.idleTimeout);
    this.idleTimeout = setTimeout(() => this.logout(), this.timeoutDuration);
  }

  logout() {
    localStorage.clear(); // Limpia el localStorage
    window.location.href = 'http://auditoriainterna.com.mx/auditoriainterna'; // Redirige a la página especificada
  }

  stopWatching() {
    clearTimeout(this.idleTimeout);
    window.removeEventListener('mousemove', this.resetTimeout);
    window.removeEventListener('click', this.resetTimeout);
    window.removeEventListener('keypress', this.resetTimeout);
  }
}