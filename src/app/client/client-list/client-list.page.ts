import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { ClientEditComponent } from '../client-edit/client-edit'
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';
import Swal from 'sweetalert2';

import { Client } from '../model/Client';
import { ClientService } from '../client.service';

@Component({
    selector: 'app-client-list',
    standalone: true,
    imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
    ],
    templateUrl: './client-list.page.html',
    styleUrl: './client-list.page.scss'
})
export class ClientListPage implements OnInit {

    dataSource = new MatTableDataSource<Client>();
    displayedColumns: string[] = ['id', 'name', 'action'];


constructor(
    private clientService: ClientService,
    public dialog: MatDialog
) {}

ngOnInit(): void {
    this.clientService.getClient().subscribe((client: Client[]) => {
    this.dataSource.data = client;
    });
}

createClient(): void {    
    const dialogRef = this.dialog.open(ClientEditComponent, {
        data: {}
    });

    dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit();
    });
}
editClient(client: Client) {
    const dialogRef = this.dialog.open(ClientEditComponent, {
        data: { client: client }
    });

    dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit();
    });
}

deleteClient(Client: Client) {    
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: { title: "Eliminar cliente", description: "Atención si borra el cliente se perderán sus datos.<br> ¿Desea eliminar el cliente?" }
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result && Client.id != null) {
            this.clientService.deleteClient(Client.id).subscribe({
                next: () => {
                    this.ngOnInit();
                },
                error: (httpError) => {
                    const serverMessage = httpError.error?.message || 'Ocurrió un error inesperado al intentar eliminar.';

                    Swal.fire({
                        icon: 'error',
                        title: 'No se puede eliminar',
                        text: serverMessage,
                        confirmButtonColor: '#d63030',
                        confirmButtonText: 'Entendido'
                    });
                }
            });
        }
    });
}


}
