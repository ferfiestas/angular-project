import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class IntlService {
  private _locale = new BehaviorSubject<string>('en-US'); // Inicializar con un valor predeterminado
  localeChanges: Observable<string> = this._locale.asObservable();

  constructor(private http: HttpClient) {
    // Obtener el locale desde el backend (ejemplo)
    this.http.get<string>('/api/locale').subscribe({
      next: (locale) => {
        this._locale.next(locale); // Actualizar el BehaviorSubject cuando se obtenga el locale
      },
      error: () => {
        console.error('Error al cargar el locale, usando el predeterminado.');
      },
    });
  }

  // Método para obtener el valor actual del locale
  get currentLocale(): string {
    return this._locale.value;
  }

  // Método para actualizar el locale manualmente si es necesario
  setLocale(locale: string): void {
    this._locale.next(locale);
  }
}