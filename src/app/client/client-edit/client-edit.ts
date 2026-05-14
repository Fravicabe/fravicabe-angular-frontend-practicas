import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

import { Client } from '../model/Client';
import { ClientService } from '../client.service';

@Component({
selector: 'app-client-edit',
standalone: true,
imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
],
    templateUrl: './client-edit.html',
    styleUrls: ['./client-edit.scss']
})
export class ClientEditComponent implements OnInit {

client: Client = {
    id: 0,
    name: ''
};

constructor(
    public dialogRef: MatDialogRef<ClientEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clientService: ClientService
) {}

ngOnInit(): void {
    if (this.data.client != null) {
        this.client = Object.assign({}, this.data.client);
    }
    else {
        this.client = new Client();
    }
}

onClose(): void {
    this.dialogRef.close();
}

onSave(): void {
    this.clientService.saveClient(this.client).subscribe({
        next: (result) => {
            this.dialogRef.close(result);
        },
        error: (httpError) => {
            const serverMessage = httpError.error?.message;
            const finalMessage = (serverMessage && serverMessage !== 'No message available') 
                ? 'El nombre del cliente ya existe en el sistema.' 
                : 'Ocurrió un error inesperado al intentar guardar.';

            Swal.fire({
                icon: 'error',
                title: 'Error al registrar',
                text: finalMessage,
                confirmButtonColor: '#d63030',
                // Para que la ventanita de alerta no quede detrás de la de crear/editar
                target: '.mat-mdc-dialog-container' 
            });
        }
    });
}
}