import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-notification-dialog',
  template: `
    <h1 mat-dialog-title class="dialog-title">{{ data.title }}</h1>
    <div mat-dialog-content class="dialog-content">
      <img [src]="data.imageUrl" [alt]="data.imageAlt" class="notification-image">
    </div>
    <div mat-dialog-actions class="dialog-actions">
      <button mat-button (click)="closeDialog()" class="close-button">Cerrar</button>
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
export class NotificationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<NotificationDialogComponent>, // Inyectamos MatDialogRef
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close(); // Cerramos el diálogo cuando se hace clic en el botón
  }
}