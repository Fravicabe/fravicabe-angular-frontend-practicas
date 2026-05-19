import { Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ClientService } from '../client.service';
import { Client } from '../model/Client';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-client-edit',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule, 
        ReactiveFormsModule, 
        MatFormFieldModule, 
        MatInputModule, 
        MatButtonModule 
    ],
    templateUrl: './client-edit.html',
    styleUrl: './client-edit.scss'
})
export class ClientEditComponent implements OnInit {
    protected readonly dialogRef = inject(MatDialogRef<ClientEditComponent>);
    protected readonly data = inject(MAT_DIALOG_DATA) as { client: Client };
    protected readonly clientService = inject(ClientService);

    protected readonly id = signal<number | null>(null);
    protected readonly name = signal<string | null>(null);

    ngOnInit(): void {
        this.loadFormData(this.data.client ?? null);
    }

    loadFormData(initialData: Client | null): void {
        this.id.set(initialData?.id ?? null);
        this.name.set(initialData?.name ?? null);
    }

    onSave(): void {
        const id = this.id();
        const name = this.name();

        if (!name) {
            return; 
        }

        const client: Client = { id, name } as Client;

        this.clientService.saveClient(client).subscribe(() => {
            this.dialogRef.close(true);
        });
    }

    onClose(): void {
        this.dialogRef.close();
    }
}
