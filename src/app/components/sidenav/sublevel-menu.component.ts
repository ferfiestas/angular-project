import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { INavbarData, fadeInOut } from './helper';


@NgModule({
  declarations: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SublevelMenuModule {}


@Component({
  selector: 'app-sublevel-menu',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  template: `
    <ul *ngIf="collapsed && data.items && data.items.length > 0"
    [@submenu]="expanded
    ? {value: 'visible',
      params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}}
      : {value: 'hidden',
          params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}"
    class="sublevel-nav">
    <li *ngFor="let data of data.items" class="sublevel-nav-item">
      <a class="sublevel-nav-link"
      (click)="handleClick(data)"
        *ngIf="data.items && data.items.length > 0"
        [ngClass]="getActiveClass(data)"
        >
        <i class="sublevel-link-icon" [class]="data.icon"></i>
        <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">{{data.Label}}</span>
        <i *ngIf="data.items && collapsed" class="menu-collapse-icon"
          [ngClass]="!data.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"></i>
      </a>
      <a class="sublevel-nav-link"
        *ngIf="!data.items || (data.items && data.items.length === 0)"
        [routerLink]="[data.routeLink]"
        routerLinkActive="active-sublevel"
        [routerLinkActiveOptions]="{exact: true}"
      >
      <i class="sublevel-link-icon" [class]="data.icon"></i>
      <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">{{data.Label}}</span>
      </a>
      <div *ngIf="data.items && data.items.length > 0">
        <app-sublevel-menu
          
          [collapsed]="collapsed"
          [multiple]="multiple"
          [expanded]="data.expanded"
        ></app-sublevel-menu>
      </div>
    </li>
    </ul>
  `,
  styleUrl: './custom-admin-sidenav.component.css',
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({
        height: '0',
        overflow: 'hidden'
      })),
      state('visible', style({
        height: '*'
      })),
      transition('visible <=> hidden', [style({overflow: 'hidden'}),
        animate('{{transitionParams}}')]),
      transition('void => *', animate(0))
      ])
  ]
})
export class SublevelMenuComponent implements OnInit {

  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    Label: '',
    items: []
  }
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple: boolean = false;

  constructor(public router: Router) {}

  ngOnInit(): void {
      
  }

  handleClick(data: any): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length >0) {
        for(let modelItem of this.data.items) {
          if (data !==modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    data.expanded = !data.expanded;
  }
  
  getActiveClass(data: INavbarData): string {
    return data.expanded && this.router.url.includes(data.routeLink)
    ? 'active-sublevel'
    : '';
  }

}
