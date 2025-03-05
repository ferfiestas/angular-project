import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { isAuthenticatedGuard } from './components/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './components/guards/is-not-authenticated.guard';
import { ChangePasswordComponent } from './pages/settings/change-password/change-password.component';
import { MantenimientoComponent } from './pages/mantenimiento/mantenimiento.component';
import { mantenimientoGuard } from './components/guards/mantenimiento.guard';

export const routes: Routes = [
    /** Redirigir a mantenimiento si está activo */
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
        canActivate: [mantenimientoGuard]
    },
    {
        path: 'auth',
        canActivate: [isNotAuthenticatedGuard, mantenimientoGuard],
        component: LoginComponent,
    },
    {
        path: 'change-password',
        canActivate: [mantenimientoGuard],
        component: ChangePasswordComponent
    },
    {
        path: 'main',
        canActivate: [isAuthenticatedGuard, mantenimientoGuard],
        loadChildren: () => import('./main/layout.module').then(m => m.layoutModule)
    },
    {
        path: 'mantenimiento',
        component: MantenimientoComponent
    },
    /** Redirigir cualquier ruta desconocida a mantenimiento si está activo */
    {
        path: '**',
        redirectTo: 'auth',
        canActivate: [mantenimientoGuard]
    }
];
