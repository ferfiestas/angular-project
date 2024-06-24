import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { PeopleComponent } from './pages/people/people.component';
import { CoursesNewsComponent } from './pages/courses-news/courses-news.component';
import { HolidaysComponent } from './pages/holidays/holidays.component';
import { CheckinComponent } from './pages/checkin/checkin.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { profileComponent } from './pages/profile/profile.component';
import { MainComponent } from './main/main.component';
/**import { passwordComponent } from './pages/settings/passwordreset/password.component'; **/

export const routes: Routes = [
    {path: '', component: MainComponent},
    {path: 'main', component: MainComponent},
    {path: 'profile', component: profileComponent},
    {path: 'people', component: PeopleComponent},
    {path: 'courses', component: CoursesNewsComponent},
    {path: 'holidays', component: HolidaysComponent},
     /** {path: 'password', component: passwordComponent},**/

    {
        path: 'reports',
        loadChildren: () => import('./pages/reports/unusualities.module').then(m => m.UnusualitiesModule)
    },
    {path: 'checkin', component: CheckinComponent},
    {path: 'settings', component: SettingsComponent},
];
