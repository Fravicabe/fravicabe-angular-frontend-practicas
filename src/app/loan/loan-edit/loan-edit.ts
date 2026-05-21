import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import Swal from 'sweetalert2';

import { LoanService } from '../loan.service';
import { GameService } from '../../game/game.service'; 
import { ClientService } from '../../client/client.service'; 
import { Loan } from '../model/Loan';
import { Game } from '../../game/model/Game';       
import { Client } from '../../client/model/Client';          

@Component({
    selector: 'app-loan-edit',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
    ],
    // Para el desplegable de fechas
    providers: [provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}], 
    templateUrl: './loan-edit.html',
    styleUrl: './loan-edit.scss',
})
export class LoanEditComponent implements OnInit {
    protected readonly loanService = inject(LoanService);
    protected readonly gameService = inject(GameService);
    protected readonly clientService = inject(ClientService);
    protected readonly dialogRef = inject(MatDialogRef<LoanEditComponent>);
    protected readonly data = inject(MAT_DIALOG_DATA);

    // Listas para llenar los desplegables
    protected readonly games = signal<Game[]>([]);
    protected readonly clients = signal<Client[]>([]);

    // Uso los signals como se hace en autores para que se actualice
    protected readonly id = signal<number | null>(null);
    protected readonly game = signal<Game | null>(null);
    protected readonly client = signal<Client | null>(null);
    protected readonly loanDate = signal<Date | null>(null);
    protected readonly returnDate = signal<Date | null>(null);

    // Aquí me he tenido que ayudar un poco de mi primo ElIAs porque no solucionaba el problema
    // de fechas de ninguna manera

    parseDate(value: string | Date | null | undefined): Date | null {
        if (!value) return null;
        if (value instanceof Date) return value;
        const [y,m,d] = value.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    formatDate(date: Date | null): string | null {
        if (!date) return null;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }


    // Si inicia en null, nuevo, si no, modifica
    loadFormData(initialData: Loan | null) {
        if (!initialData) {
            this.id.set(null);
            this.game.set(null);
            this.client.set(null);
            this.loanDate.set(null);
            this.returnDate.set(null);
            return;
        }

        this.id.set(initialData.id ?? null);
        this.game.set(initialData.game ?? null);
        this.client.set(initialData.client ?? null);
        // Asegura que se pinten las fechas bien aunque desde el backend no sean del mismo formato
        this.loanDate.set(this.parseDate(initialData.loanDate ?? null));
        this.returnDate.set(this.parseDate(initialData.returnDate ?? null));
    }

    ngOnInit(): void {
        this.loadFormData(this.data.loan ?? null);

        // Se cargan los juegos y clientes para pintar las opciones del modal
        this.gameService.getGames().subscribe(gamesList => this.games.set(gamesList));
        this.clientService.getClient().subscribe(clientsList => this.clients.set(clientsList));
    }

    // Comparación de juego para que salgan al editar y no estén vacíos por estar en instancias diferentes
    // Al comparar que son iguales, Angular sabe que debe pintarlo (Mucho texto)
    compGames(o1: Game, o2: Game): boolean {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    // Lo mismo para clientes
    compClients(o1: Client, o2: Client): boolean {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
    }

    onSave() {
    const loan: Loan = {
        id: this.id() ?? undefined,
        game: this.game() ?? undefined,
        client: this.client() ?? undefined,
        loanDate: this.formatDate(this.loanDate()) ?? undefined,
        returnDate: this.formatDate(this.returnDate()) ?? undefined,
    };

    this.loanService.saveLoan(loan).subscribe({
        next: () => {
            this.dialogRef.close(loan);
        },
        error: (httpError) => {
            const serverMessage = httpError.error?.message || 'Ocurrió un error inesperado al guardar.';

            Swal.fire({
                icon: 'error',
                title: 'Conflicto de Préstamo',
                text: serverMessage,
                confirmButtonColor: '#d63030',
                confirmButtonText: 'Entendido',
                target: '.mat-mdc-dialog-container'
            });
        }
    });
}

    onClose() {
        this.dialogRef.close(false);
    }
}