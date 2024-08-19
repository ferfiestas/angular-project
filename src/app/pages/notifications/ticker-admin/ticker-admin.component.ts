import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';

import { TickerService } from '../../../services/ticker.service';
import { TickerupdateService } from '../../../services/tickerupdate.service';


@Component({
  selector: 'app-ticker-admin',
  templateUrl: './ticker-admin.component.html',
  styleUrls: ['./ticker-admin.component.css']
})
export class TickerAdminComponent {
  
  messages: { idTicker: number; texto: string }[] = [];
  newMessage: string = '';

  constructor(private tickerService: TickerService, public dialog: MatDialog, private messageService: TickerupdateService) {
    this.loadMessages();
  }

  loadMessages(): void {
    this.tickerService.getMessages().subscribe(
        (messages) => {
          // Ahora los mensajes usan la propiedad "texto" en lugar de "descripcion"
          this.messages = messages.map(message => ({ idTicker: message.idTicker, texto: message.descripcion }));
        },
        (error) => {
          console.error('Error fetching messages:', error);
        }
    );
  }

  addMessage(): void {
    if (this.newMessage.trim()) {
      this.tickerService.createMessage(this.newMessage).subscribe(
        () => {
          this.newMessage = '';
          this.loadMessages();
          this.messageService.notifyMessagesUpdated();
          Swal.fire('¡Éxito!', 'El mensaje se agregó correctamente.', 'success');
        },
        (error) => {
          console.error('Error adding message:', error);
          Swal.fire('Error', 'No se pudo agregar el mensaje.', 'error');
        }
      );
    }
  }

  deleteMessage(id: number): void {
    this.tickerService.deleteMessage(id).subscribe(
      () => {
        this.messages = this.messages.filter(message => message.idTicker !== id);
        this.messageService.notifyMessagesUpdated();
        Swal.fire('¡Éxito!', 'El mensaje ha sido eliminado correctamente.', 'success');
      },
      (error) => {
        console.error('Error deleting message:', error);
        Swal.fire('Error', 'No se pudo eliminar el mensaje.', 'error');
      }
    );
  }

  editMessage(index: number) {
    const message = this.messages[index];
    const dialogRef = this.dialog.open(EditDialog, {
      width: '350px',
      data: { id: message.idTicker, message: message.texto }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateMessage(result.id, result.message);
      }
    });
  }

  updateMessage(id: number, newMessage: string) {
    this.tickerService.updateMessage(id, newMessage).subscribe(
      () => {
        this.loadMessages();
        this.messageService.notifyMessagesUpdated();
        Swal.fire('¡Éxito!', 'El mensaje ha sido actualizado correctamente.', 'success');
      },
      (error) => {
        console.error('Error updating message:', error);
        Swal.fire('Error', 'No se pudo actualizar el mensaje.', 'error');
      }
    );
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