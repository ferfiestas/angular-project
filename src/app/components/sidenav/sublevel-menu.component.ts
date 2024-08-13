import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, NgModule, OnInit } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { INavbarData, fadeInOut } from './helper';
import { AccessService } from '../../services/access.service';

@NgModule({
  declarations: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SublevelMenuModule { }

@Component({
  selector: 'app-sublevel-menu',
  standalone: true,
  imports: [RouterModule, RouterOutlet, CommonModule],
  template: `
    <ng-container *ngIf="collapsed && data.items && data.items.length > 0">
      <ul
        [ngClass]="{'overflow-hidden': !expanded}"
        [@submenu]="expanded
        ? {value: 'visible', params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '*'}}
        : {value: 'hidden', params: {transitionParams: '400ms cubic-bezier(0.86, 0, 0.07, 1)', height: '0'}}"
        class="sublevel-nav"
      >
        <ng-container *ngFor="let item of data.items">
          <li *ngIf="item.allowedRoles.includes(accessService.getUserRole() ?? -1)" class="sublevel-nav-item">
            <ng-container *ngIf="item.items && item.items.length > 0; else noSubItems">
              <a
                class="sublevel-nav-link"
                (click)="handleClick(item)"
                [ngClass]="getActiveClass(item)"
              >
                <i class="sublevel-link-icon" [class]="item.icon"></i>
                <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">{{ item.Label }}</span>
                <i *ngIf="item.items && collapsed" class="menu-collapse-icon"
                  [ngClass]="!item.expanded ? 'fal fa-angle-right' : 'fal fa-angle-down'"></i>
              </a>
              <div>
                <app-sublevel-menu
                  [collapsed]="collapsed"
                  [multiple]="multiple"
                  [expanded]="item.expanded"
                  [data]="item"
                ></app-sublevel-menu>
              </div>
            </ng-container>
            <ng-template #noSubItems>
              <a
                class="sublevel-nav-link"
                [routerLink]="[item.routeLink]"
                routerLinkActive="active-sublevel"
                [routerLinkActiveOptions]="{exact: true}"
                (click)="item.Label === 'Salir' ? onLogout() : null"
              >
                <i class="sublevel-link-icon" [class]="item.icon"></i>
                <span class="sublevel-link-text" @fadeInOut *ngIf="collapsed">{{ item.Label }}</span>
              </a>
            </ng-template>
          </li>
        </ng-container>
      </ul>
    </ng-container>
  `,
  styleUrls: ['./custom-admin-sidenav.component.css'],
  animations: [
    fadeInOut,
    trigger('submenu', [
      state('hidden', style({ height: '0' })),
      state('visible', style({ height: '*' })),
      transition('visible <=> hidden', [
        style({ overflow: 'hidden' }),
        animate('{{transitionParams}}')
      ]),
      transition('void => *', animate(0))
    ])
  ]
})
export class SublevelMenuComponent implements OnInit {

  @Input() data: INavbarData = {
    routeLink: '',
    icon: '',
    Label: '',
    items: [],
    allowedRoles: [],
  };
  @Input() collapsed = false;
  @Input() animating: boolean | undefined;
  @Input() expanded: boolean | undefined;
  @Input() multiple = false;

  constructor(public router: Router, public accessService: AccessService) { }

  ngOnInit(): void { }

  handleClick(data: any): void {
    if (!this.multiple) {
      if (this.data.items && this.data.items.length > 0) {
        for (let modelItem of this.data.items) {
          if (data !== modelItem && modelItem.expanded) {
            modelItem.expanded = false;
          }
        }
      }
    }
    data.expanded = !data.expanded;
  }

  onLogout(): void {
    this.accessService.logout();
  }

  getActiveClass(data: INavbarData): string {
    return data.expanded && this.router.url.includes(data.routeLink) ? 'active-sublevel' : '';
  }
}