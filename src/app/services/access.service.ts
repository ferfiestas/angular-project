import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { appsettings } from '../components/api/appsetting';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { responseAccess } from '../components/interfaces/responseaccess';
import { user } from '../components/interfaces/user';
import { AuthStatus } from '../components/interfaces/auth-status.enum';

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
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', user.idRol.toString());
    localStorage.setItem('idPersona', user.idPersona.toString());
    localStorage.setItem('idEmpleado', user.idEmpleado.toString());

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

  checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');
    const idEmpleado = localStorage.getItem('idEmpleado');
    
    if (!token || !idEmpleado) {
        this.logout();
        return of(false);
    }

    const user: user = {
        idPersona: parseInt(localStorage.getItem('idPersona')!, 10),
        idUsuario: 0, // Este valor no se obtiene de localStorage, podrías ajustar según lo necesites
        idEmpleado: parseInt(idEmpleado, 10),
        idRol: parseInt(localStorage.getItem('userRole')!, 10),
        usuario1: '', // Este valor no se obtiene de localStorage, podrías ajustar según lo necesites
        activo: true // Ajustar si es necesario
    };

    // Set the user and authentication status based on local storage data
    this._currentUser.set(user);
    this._authStatus.set(AuthStatus.authenticated);
    
    return of(true);
}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('idPersona');
    localStorage.removeItem('idEmpleado');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated);
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