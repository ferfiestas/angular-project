import { Component, EventEmitter, HostListener, HostBinding, OnInit, Output, computed, inject } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { style, transition, trigger, animate, keyframes } from '@angular/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { navbarData } from './nav-data';
import { SublevelMenuComponent } from './sublevel-menu.component';
import { INavbarData, fadeInOut } from './helper';
import { AccessService } from '../../services/access.service';
import { FullscreenService } from '../../services/fullscreen.service';

@NgModule({
  imports: [BrowserModule, BrowserAnimationsModule],
  declarations: [],
  bootstrap: [],
})
export class AppModule {}

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-custom-admin-sidenav',
  standalone: true,
  imports: [RouterModule, RouterOutlet, MatIconModule, CommonModule, SublevelMenuComponent],
  templateUrl: './custom-admin-sidenav.component.html',
  styleUrl: './custom-admin-sidenav.component.css',
  animations: [
    fadeInOut,
    trigger('rotate', [
      transition(':enter', [
        animate('1000ms',
          keyframes([
            style({ transform: 'rotate(0deg)', offset: '0' }),
            style({ transform: 'rotate(2turn)', offset: '1' })
          ])
        )
      ])
    ])
  ]
})
export class CustomAdminSidenavComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  filteredNavData = navbarData;
  multiple: boolean = false;

  private accessService = inject(AccessService);
  private fullscreenService = inject(FullscreenService);

  @HostBinding('class.hidden')
  get isHidden(): boolean {
    return this.fullscreenService.isFullscreen();
  }

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  constructor(public router: Router) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.filterMenuByRole();
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  handleClick(data: INavbarData): void {
    if (!this.multiple) {
      for (let modelItem of this.navData) {
        if (data !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    data.expanded = !data.expanded;
  }

  getActiveClass(data: INavbarData): string {
    return this.router.url.includes(data.routeLink) ? 'active' : '';
  }

  profilePicSize = computed(() => this.collapsed ? '100' : '50');

  filterMenuByRole(): void {
    const userRole = this.accessService.getUserRole() ?? -1;
    this.filteredNavData = this.navData.filter(item => item.allowedRoles.includes(userRole));
  }

  trackByLabel(_index: number, item: any): string {
    return item.Label;
  }
  
}