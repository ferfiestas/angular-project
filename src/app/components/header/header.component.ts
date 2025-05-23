import { CommonModule } from '@angular/common';
import { Component, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkMenuModule } from '@angular/cdk/menu';
import { RouterModule, RouterOutlet } from '@angular/router';

import { languages, userItems } from './header-dummy-data';
import { TickerService } from '../../services/ticker.service';
import { NotificationService, Notification } from '../../services/notification.service';
import { AccessService } from '../../services/access.service';
import { TickerupdateService } from '../../services/tickerupdate.service';
import { FullscreenService } from '../../services/fullscreen.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, OverlayModule, CdkMenuModule, RouterModule, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  headerImageUrl: string = '';

  @Input() collapsed = false;
  @Input() screenWidth = 0;
  @HostBinding('class.hidden') isHidden = false;

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
    private messageService: TickerupdateService,
    private fullscreenService: FullscreenService
  ) { }

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

    this.fullscreenService.fullscreen$.subscribe((active) => {
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
                    (/Macintosh/.test(navigator.userAgent) && 'ontouchend' in document);
      this.isHidden = isIOS && active;
    });
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
        this.unreadNotificationsCount = this.notifications.filter(n => !n.read).length;
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
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'head-trimmed';
    } else {
      styleClass = 'head-md-screen';
    }
    return styleClass;
  }

  gettrickerClass(): string {
    let styleClass = '';

    if (this.screenWidth > 1080) {
      styleClass = this.collapsed ? 'ticker-trimmed-lg' : 'ticker-md-screen-lg';
    } else if (this.screenWidth > 800) {
      styleClass = this.collapsed ? 'ticker-trimmed-md' : 'ticker-md-screen-md';
    } else if (this.screenWidth > 500) {
      styleClass = this.collapsed ? 'ticker-trimmed-sm' : 'ticker-md-screen-sm';
    } else if (this.screenWidth > 400) {
      styleClass = this.collapsed ? 'ticker-trimmed-xs' : 'ticker-md-screen-xs';
    } else if (this.screenWidth > 300) {
      styleClass = this.collapsed ? 'ticker-trimmed-xxs' : 'ticker-md-screen-xxs';
    } else {
      styleClass = this.collapsed ? 'ticker-trimmed-xxx' : 'ticker-md-screen-xxx';
    }

    return styleClass;
  }

  loadHeaderImage(): void {
    const idUsuario = localStorage.getItem('usuario1');
    const defaultImageUrl = 'https://encompletadisonancia.com.mx/photo_upload/img00000.jpg';

    if (idUsuario) {
      const possibleExtensions = ['jpg', 'png', 'jpeg'];
      this.checkMultipleImageExtensions(idUsuario, possibleExtensions)
        .then((validImageUrl) => {
          this.headerImageUrl = validImageUrl || defaultImageUrl;
        })
        .catch(() => {
          this.headerImageUrl = defaultImageUrl;
        });
    } else {
      this.headerImageUrl = defaultImageUrl;
    }
  }

  private async checkMultipleImageExtensions(idUsuario: string, extensions: string[]): Promise<string | null> {
    for (const ext of extensions) {
      const imageUrl = `https://encompletadisonancia.com.mx/photo_upload/${idUsuario}.${ext}`;
      const exists = await this.checkImageExists(imageUrl);
      if (exists) {
        return imageUrl;
      }
    }
    return null;
  }

  private checkImageExists(url: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }

  checkCanShowSearchAsOverlay(innerWidth: number): void {
    if (innerWidth < 845) {
      this.canShowSearchAsOverlay = true;
    } else {
      this.canShowSearchAsOverlay = false;
    }
  }

}