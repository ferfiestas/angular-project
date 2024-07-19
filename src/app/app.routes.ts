import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { isAuthenticatedGuard } from './components/guards/is-authenticated.guard';
import { isNotAuthenticatedGuard } from './components/guards/is-not-authenticated.guard';



export const routes: Routes = [
    {
        path: 'auth',
        canActivate: [ isNotAuthenticatedGuard ],
        component: LoginComponent,
    },
    {
        path: 'main',
        canActivate: [ isAuthenticatedGuard ],
        loadChildren: () => import('./main/layout.module').then(m => m.layoutModule)
    },
    {
        path: '**',
        redirectTo: 'auth'
    },
    
];
