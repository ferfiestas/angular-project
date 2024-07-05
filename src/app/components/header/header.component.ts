import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule, RouterOutlet } from '@angular/router';

import { languages, notifications, userItems } from './header-dummy-data';
import { TickerService } from '../../services/ticker.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, OverlayModule, CdkMenuModule, RouterModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  selectedLanguage: any;

  languages = languages;
  notifications = notifications;
  userItems = userItems;

  tickerWidth: string = '100'; 
  messages: string[] = [];

  constructor(private tickerService: TickerService) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
    this.loadMessages();
  }

  loadMessages() {
    this.tickerService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }


  getHeadClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  gettrickerClass(): string {
    let styleClass = '';
    if(this.collapsed && this.screenWidth > 768) {
      styleClass = 'ticker-trimmed';
    } else {
      styleClass = 'ticker-md-screen';
    }
    return styleClass;
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if(innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }
}
