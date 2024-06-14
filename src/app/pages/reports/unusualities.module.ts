import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnusualitiesRoutingModule } from './unusualities-routing.module';
import { ReportsComponent } from './reports.component';




@NgModule({
  declarations: [
    ReportsComponent,
  ],
  imports: [
    CommonModule,
    UnusualitiesRoutingModule,
  ]
})
export class UnusualitiesModule { }
