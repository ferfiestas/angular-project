import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MANTENIMIENTO_MODE } from '../../app.config';

export const mantenimientoGuard: CanActivateFn = () => {
    const router = inject(Router);
    const isMantenimiento = inject(MANTENIMIENTO_MODE);

    if (isMantenimiento) {
        router.navigate(['/mantenimiento']);
        return false;
    }

    return true;
};
