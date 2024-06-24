import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { reportsRoutingModule } from './reports-routing.module';
import { unusualitiesComponent } from './unusualities/unusualities.component';




@NgModule({
  declarations: [
    unusualitiesComponent,
  ],
  imports: [
    CommonModule,
    reportsRoutingModule,
  ]
})
export class reportsModule { }
