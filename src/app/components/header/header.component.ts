import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnInit } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule, RouterOutlet } from '@angular/router';

import { languages, userItems } from './header-dummy-data';
import { TickerService } from '../../services/ticker.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { AccessService } from '../../services/access.service';
import { TickerupdateService } from '../../services/tickerupdate.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, OverlayModule, CdkMenuModule, RouterModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {

  headerImageUrl: string = '';

  @Input() collapsed = false;
  @Input() screenWidth = 0;

  canShowSearchAsOverlay = false;
  selectedLanguage: any;

  languages = languages;
  userItems = userItems;
  public notifications: Notification[] = [];
  public unreadNotificationsCount: number = 0;

  tickerWidth: string = '100'; 
  messages: { idTicker: number; descripcion: string }[] = [];

  constructor(
    private tickerService: TickerService, 
    private notificationService: NotificationService,
    public accessService: AccessService,
    private messageService: TickerupdateService
  ) {}

  @HostListener('window:resize', ['$event'])
  onResize(_event: any) {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
  }

  ngOnInit(): void {
    this.checkCanShowSearchAsOverlay(window.innerWidth);
    this.selectedLanguage = this.languages[0];
    this.loadMessages();
    this.messageService.messagesUpdated$.subscribe(() => {
      this.loadMessages();
    });
    this.loadNotifications();
    this.loadHeaderImage();
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
  
    if (this.screenWidth > 1080) {
      // Pantallas grandes
      styleClass = this.collapsed ? 'ticker-trimmed-lg' : 'ticker-md-screen-lg';
    } else if (this.screenWidth > 800) {
      // Pantallas medianas
      styleClass = this.collapsed ? 'ticker-trimmed-md' : 'ticker-md-screen-md';
    } else if (this.screenWidth > 500) {
      // Pantallas pequeñas
      styleClass = this.collapsed ? 'ticker-trimmed-sm' : 'ticker-md-screen-sm';
    } else if (this.screenWidth > 400) {
      // Pantallas muy pequeñas
      styleClass = this.collapsed ? 'ticker-trimmed-xs' : 'ticker-md-screen-xs';
    } else if (this.screenWidth > 300) {
      // Pantallas demasiado pequeñas
      styleClass = this.collapsed ? 'ticker-trimmed-xxs' : 'ticker-md-screen-xxs';
    } else {
      // Pantallas extremadamente pequeñas
      styleClass = this.collapsed ? 'ticker-trimmed-xxx' : 'ticker-md-screen-xxx';
    }
  
    return styleClass;
  }

  loadHeaderImage(): void {
    const idUsuario = localStorage.getItem('usuario1');
    if (idUsuario) {
      const imageUrl = `http://auditoriainterna.com.mx/photo_upload/${idUsuario}.jpg`;
      this.checkImageExists(imageUrl).then(exists => {
        this.headerImageUrl = exists ? imageUrl : 'http://auditoriainterna.com.mx/photo_upload/img00000.jpg';
      });
    } else {
      this.headerImageUrl = 'http://auditoriainterna.com.mx/photo_upload/img00000.jpg';
    }
  }

  checkImageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if(innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }
}
