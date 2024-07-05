import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { TickerService } from '../../../services/ticker.service';



@Component({
  selector: 'app-ticker-admin',
  templateUrl: './ticker-admin.component.html',
  styleUrls: ['./ticker-admin.component.css']
})
export class TickerAdminComponent {
[x: string]: any;
  
  messages: string[] = [];
  newMessage: string = '';

  constructor(private tickerService: TickerService, public dialog: MatDialog) {
    this.loadMessages();
  }

  loadMessages() {
    this.tickerService.getMessages().subscribe((messages) => {
      this.messages = messages;
    });
  }

  addMessage(_newMessage?: string) {
    this.tickerService.addMessage(this.newMessage).subscribe(() => {
      this.loadMessages();
      this.newMessage = '';
    });
  }

  deleteMessage(index: number) {
    this.tickerService.deleteMessage(index).subscribe(() => {
      this.loadMessages();
    });
  }

  editMessage(index: number) {
    const dialogRef = this.dialog.open(EditDialog, {
      width: '250px',
      data: { index, message: this.messages[index] }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateMessage(result.index, result.message);
      }
    });
  }

  updateMessage(index: number, newMessage: string) {
    this.tickerService.updateMessage(index, newMessage).subscribe(() => {
      this.loadMessages();
    });
  }
}

@Component({
  selector: 'edit-dialog',
  templateUrl: 'edit-dialog.html',
})
export class EditDialog {
  constructor(
    public dialogRef: MatDialogRef<EditDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.data);
  }
}
