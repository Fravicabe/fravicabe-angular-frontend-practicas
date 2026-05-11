import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: 'categories', loadComponent: () => import('../app/category/category-list/category-list.page').then(m => m.CategoryListPage)},
    { path: 'authors', loadComponent: () => import('../app/author/author-list/author-list.page').then(m => m.AuthorListPage)},
];