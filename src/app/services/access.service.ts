import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { appsettings } from '../components/api/appsetting';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { responseAccess } from '../components/interfaces/responseaccess';
import { user } from '../components/interfaces/user';
import { AuthStatus } from '../components/interfaces/auth-status.enum';
import { CheckTokenResponse } from '../components/interfaces/check-token.response';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  private http = inject(HttpClient);
  private readonly baseUrl: string = appsettings.apiUrl;

  private _currentUser = signal<user|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );
  
  //! Exterior

  public currentUser = computed( () => this._currentUser);
  public authStatus = computed( () => this._authStatus);

  constructor() {
    this.checkAuthStatus().subscribe();
  }

  private setAuthentication(user: user, token:string): boolean {
    console.log('Setting authentication for user:', user);
    console.log('Storing token:', token);    
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', user.idRol.toString());
    localStorage.setItem('idPersona', user.idPersona.toString());

    return true;
  }

  login( usuario1: number, password: string ): Observable<boolean> {

    const url = `${ this.baseUrl }/api/usuario/login`;
    const body = { usuario1, password };

    return this.http.post<responseAccess>( url, body )
      .pipe(
        map(({ usuario, token }) => this.setAuthentication( usuario, token )),
        catchError( err => throwError( () => err.error.message ))
      );
  }

  checkAuthStatus():Observable<boolean> {

    const url = `${ this.baseUrl }/api/usuario`;
    const token = localStorage.getItem('token');

    if ( !token ) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${ token }`);

      return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe (
        map(({ user, token }) => this.setAuthentication( user, token )),
        catchError(() => {
          this._authStatus.set( AuthStatus.notAuthenticated );
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('idPersona');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated);
  }


  getUser() {
    // Aquí obtendrás la información del usuario logeado.
    // Esto es solo un ejemplo, deberás implementar esto basado en tu lógica de autenticación.
    return { id: 1, name: 'Juan Pérez' };
  }

  getUserRole(): number | null {
    const currentUser = this._currentUser();
    if (currentUser) {
      return currentUser.idRol;
    }
  
    const role = localStorage.getItem('userRole');
    return role ? parseInt(role, 10) : null;
  }


}