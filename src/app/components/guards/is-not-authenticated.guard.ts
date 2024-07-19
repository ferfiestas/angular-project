import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AccessService } from '../../services/access.service';
import { AuthStatus } from '../interfaces/auth-status.enum';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {

  const accessService = inject( AccessService );
  const router = inject( Router );

  if( accessService.authStatus()() === AuthStatus.authenticated ) {
    router.navigateByUrl('main')
    return false;
  }

  return true;
};
