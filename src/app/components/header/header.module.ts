import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

import { headerRoutingModule } from './header-routing.module';
import { ProfileComponent } from '../../pages/profile/profile.component';




@NgModule({
  declarations: [
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    headerRoutingModule,
    RouterModule,
    RouterOutlet,
  ]
})
export class headerModule { }