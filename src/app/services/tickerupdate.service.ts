import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TickerupdateService {

  private messagesUpdated = new Subject<void>();

  // Observable que pueden suscribirse los componentes para recibir notificaciones
  messagesUpdated$ = this.messagesUpdated.asObservable();

  // Método para emitir el evento de actualización
  notifyMessagesUpdated() {
    this.messagesUpdated.next();
  }
}
