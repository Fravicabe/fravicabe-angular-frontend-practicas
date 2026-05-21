import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

import { LoanEditComponent } from '../loan-edit/loan-edit';
import { LoanSearch, LoanService } from '../loan.service';
import { Loan } from '../model/Loan';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';

@Component({
selector: 'app-loan-list',
standalone: true,
templateUrl: './loan-list.page.html',
styleUrl: './loan-list.page.scss',
providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES'}
],
imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule
],
})

export class LoanListPage implements OnInit {

    private readonly loanService = inject(LoanService);
    private readonly dialog = inject(MatDialog);

    // Propiedades de paginación idénticas a Autores
    pageNumber = 0;
    pageSize = 5;
    totalElements = 0;

    // Propiedades de filtrado específicas para Loan
    filterGameTitle = '';
    filterClientName = '';
    filterDate: Date | null = null;
    // Para adaptar y refrescar la tabla cuando se cambia
    dataSource = new MatTableDataSource<Loan>();

    // Array de columnas ordenadas
    displayedColumns: string[] = ['id', 'game', 'client', 'loanDate', 'returnDate', 'action'];

    // Helper para corregir un pequeño bug en las fechas
    formatDate(date: Date | null): string | null {
        if (!date) return null;
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    ngOnInit(): void {
        this.loadPage();
    }

    loadPage(event?: PageEvent): void {
        // Si el filtro es sin evento, carga la 0, si no, a la del evento
        if (!event) {
            this.pageNumber = 0;
        } else {
            this.pageNumber = event.pageIndex;
            this.pageSize = event.pageSize;
        }
        // Constante para ordenar por id de forma ascendente la página y el tamaño ya definidos
        const pageable: Pageable = {
            pageNumber: this.pageNumber,
            pageSize: this.pageSize,
            sort: [{ property: 'id', direction: 'ASC' }],
        };

        // Estructura de los parámetros de búsqueda para llamar al backend
        const searchParams: LoanSearch = {
            gameTitle: this.filterGameTitle,
            clientName: this.filterClientName,
            date: this.formatDate(this.filterDate),
            pageable: pageable
        };
        // Llamada al backend para actualizar la tabla
        this.loanService.getLoans(searchParams).subscribe(data => {
            this.dataSource.data = data.content ?? [];
            this.pageNumber = data.pageable?.pageNumber ?? 0;
            this.pageSize = data.pageable?.pageSize ?? this.pageSize;
            this.totalElements = data.totalElements ?? 0;
        });
}

    // Método que limpia el formulario de búsqueda
    clearFilters(): void {
        this.filterGameTitle = '';
        this.filterClientName = '';
        this.filterDate = null;
        this.loadPage();
    }
    // Lo mismo que en autores, etc.
    createLoan(): void {
        const dialogRef = this.dialog.open(LoanEditComponent, { data: {} });
        dialogRef.afterClosed().subscribe(() => this.loadPage());
}

    editLoan(loan: Loan): void {
        const dialogRef = this.dialog.open(LoanEditComponent, {
            data: { loan }
        });
        dialogRef.afterClosed().subscribe(() => this.loadPage());
    }

    deleteLoan(loan: Loan): void {
        const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: {
            title: 'Eliminar préstamo',
            description:
                'Atención si borra el préstamo se perderán sus datos.<br> ¿Desea eliminar el préstamo registrado?',
        },
    });

    dialogRef.afterClosed().subscribe(result => {
        if (result && loan.id != null) {
            this.loanService.deleteLoan(loan.id).subscribe(() => {
            this.loadPage();
        });
        }
    });
    }
}
