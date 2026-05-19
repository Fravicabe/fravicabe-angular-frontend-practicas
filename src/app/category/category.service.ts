import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './model/Category';

@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  private readonly http = inject(HttpClient);

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>('http://localhost:8080/category');
  }

  saveCategory(category: Category): Observable<Category> {
    let url = 'http://localhost:8080/category';
        if (category.id != null) url += '/' + category.id;

        return this.http.put<Category>(url, category);
  }

  deleteCategory(idCategory : number): Observable<void> {
    return this.http.delete<void>('http://localhost:8080/category/' + idCategory);
  }  
}