import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MainComponent } from "../app/main/main.component";
import { AccessService } from './services/access.service';
import { AuthStatus } from './components/interfaces/auth-status.enum';




@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [MainComponent,RouterModule, RouterOutlet, CommonModule]
})
export class AppComponent {
  title = 'SEP';

  private accessService = inject( AccessService );
  private router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {

    if ( this.accessService.authStatus()() === AuthStatus.checking ) {
      return false;
    }

    return true;

  });

  public authStatusChangedEffect = effect( () => {

    switch( this.accessService.authStatus()() ) {
      
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
