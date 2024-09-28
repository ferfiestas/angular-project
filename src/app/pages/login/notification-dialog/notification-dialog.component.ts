import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-dialog',
  template: `
    <h1 class="dialog-title">{{ data?.title }}</h1>
    <div class="dialog-content" style="width: 100%; height: auto; min-height: 200px;">
    <img [src]="data?.imageUrl || 'default-placeholder.jpg'" [alt]="data?.imageAlt || 'No Image Available'" class="notification-image" style="max-width: 100%; max-height: 400px; min-height: 200px;">
    </div>
    <div class="dialog-actions">
    <button (click)="closeDialog()" class="close-button">Cerrar</button>
    </div>
  `,
  styles: [`
    .dialog-title {
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      color: #621132;
      margin-bottom: 20px;
    }
    .dialog-content {
      text-align: center;
      max-width: 100%;
    }
    .notification-image {
      max-width: 100%;
      max-height: 400px;
      height: auto;
      display: block;
      margin: 0 auto;
    }
    .dialog-actions {
      display: flex;
      justify-content: center;
    }
    .close-button {
      background-color: #56242A;
      color: white;
      font-size: 16px;
      padding: 10px 20px;
      border-radius: 5px;
      transition: background-color 0.3s ease;
    }
    .close-button:hover {
      background-color: #621132;
    }
  `]
})
export class NotificationDialogComponent implements OnInit {
  data: any; // Recibe los datos pasados desde el servicio

  closeDialog: () => void = () => { };

  constructor() { }

  ngOnInit(): void {
    
  }
}