import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', redirectTo: '/games', pathMatch: 'full'},
    { path: 'categories', loadComponent: () => import('../app/category/category-list/category-list.page').then(m => m.CategoryListPage)},
    { path: 'clients', loadComponent: () => import('../app/client/client-list/client-list.page').then(m => m.ClientListPage)},
    { path: 'authors', loadComponent: () => import('../app/author/author-list/author-list.page').then(m => m.AuthorListPage)},
    { path: 'games', loadComponent: () => import('../app/game/game-list/game-list.page').then(m => m.GameListPage)},
    { path: 'loans', loadComponent: () => import('../app/loan/loan-list/loan-list.page').then(m => m.LoanListPage)}
];