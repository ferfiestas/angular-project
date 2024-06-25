import { Routes } from '@angular/router';



export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./main/layout.module').then(m => m.layoutModule)
    },
    
];
