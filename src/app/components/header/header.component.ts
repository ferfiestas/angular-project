import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule, RouterOutlet } from '@angular/router';

import { languages, userItems } from './header-dummy-data';
import { TickerService } from '../../services/ticker.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { AccessService } from '../../services/access.service';


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
  userItems = userItems;
  public notifications: Notification[] = [];
  public unreadNotificationsCount: number = 0;

  tickerWidth: string = '100'; 
  messages: { id: number; message: string }[] = [];

  constructor(
    private tickerService: TickerService, 
    private notificationService: NotificationService,
    public accessService: AccessService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
    this.loadMessages();
    this.loadNotifications();
  }

  loadMessages(): void {
    this.tickerService.getMessages().subscribe(
        (messages) => {
          this.messages = messages;
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
    );
  }

  onLogout(): void {
    this.accessService.logout();
  }

  loadNotifications(): void {
    this.notificationService.getNotifications().subscribe(
      (notifications) => {
        this.notifications = notifications;
        this.unreadNotificationsCount = this.notifications.filter(n => !n.read).length; // Calcular notificaciones no leídas
      },
      (error) => {
        console.error('Error fetching notifications:', error);
      }
    );
  }

  markAsRead(id: number): void {
    this.notificationService.markAsRead(id).subscribe(() => {
      this.loadNotifications();
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
