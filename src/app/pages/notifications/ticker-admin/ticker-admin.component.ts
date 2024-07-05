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
  
  messages: { id: number; message: string }[] = [];
  newMessage: string = '';

  constructor(private tickerService: TickerService, public dialog: MatDialog) {
    this.loadMessages();
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

addMessage(): void {
  if (this.newMessage.trim()) {
    this.tickerService.createMessage(this.newMessage).subscribe(
      (message) => {
        this.messages.push(message);
        this.newMessage = '';
      },
      (error) => {
        console.error('Error adding message:', error);
      }
    );
  }
}

deleteMessage(id: number): void {
  this.tickerService.deleteMessage(id).subscribe(
    () => {
      this.messages = this.messages.filter(message => message.id !== id);
    },
    (error) => {
      console.error('Error deleting message:', error);
    }
  );
}

editMessage(index: number) {
  const message = this.messages[index];
  const dialogRef = this.dialog.open(EditDialog, {
    width: '350px',
    data: { id: message.id, message: message.message }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.updateMessage(result.id, result.message);
    }
  });
}

updateMessage(id: number, newMessage: string) {
  this.tickerService.updateMessage(id, newMessage).subscribe(() => {
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
    @Inject(MAT_DIALOG_DATA) public data: { id: number; message: string }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close(this.data);
  }
}
