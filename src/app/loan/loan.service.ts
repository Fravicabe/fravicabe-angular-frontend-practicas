import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan } from './model/Loan';
import { PaginatedData } from '../core/model/page/PaginatedData';
import { Pageable } from '../core/model/page/Pageable';

export interface LoanSearch {
    gameTitle?: string;  
    clientName?: string; 
    date?: string | null;
    pageable: Pageable;
}

// Injección de dependencias para poder usar el service de forma global (root)
@Injectable({
    providedIn: 'root'
})

export class LoanService {
    protected readonly http = inject(HttpClient);
    // Definimos la puerta del backend
    private baseUrl = 'http://localhost:8080/loan';

    // Recibe los loans con un post en vez de un get para poder pasar JSONs más complejos
    // El any permite cualquier estructura, pero la que tomamos está definida en loan-list.page.ts
    getLoans(searchParams: LoanSearch): Observable<PaginatedData<Loan>> {
        return this.http.post<any>(this.baseUrl, searchParams);
    }
    // Si el id es true, edita manteniendo el id, si es false, crea un loan al igual que en autor
    saveLoan(loan: Loan): Observable<void> {
        if (loan.id) {
            // A la baseurl se le concatena el id
            return this.http.put<void>(`${this.baseUrl}/${loan.id}`, loan);
        }
        return this.http.put<void>(this.baseUrl, loan);
    }
    
    deleteLoan(id: number): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}