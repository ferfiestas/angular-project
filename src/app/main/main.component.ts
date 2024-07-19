import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { LayoutComponent } from "./layout.component";
import { CustomAdminSidenavComponent } from "../components/sidenav/custom-admin-sidenav.component";
import { HeaderComponent } from "../components/header/header.component";



interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, LayoutComponent, CustomAdminSidenavComponent, HeaderComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

  

  isSideNavCollapsed = false;
  screenWidth = 0;
  
  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }

  

}
