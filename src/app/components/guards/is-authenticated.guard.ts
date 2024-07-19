import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AccessService } from '../../services/access.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  const accessService = inject( AccessService );
  const router = inject( Router );

  if( accessService.authStatus()() === AuthStatus.authenticated ) {
    
    return true;
  }

/*   if( accessService.authStatus()() === AuthStatus.checking ) {
    
    return false;
  } */

  router.navigateByUrl('/login')

  return false;
};
