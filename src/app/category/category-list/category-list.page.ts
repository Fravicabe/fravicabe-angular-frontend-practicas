import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { CategoryEditComponent } from '../category-edit/category-edit';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';

import { Category } from '../model/Category';
import { CategoryService } from '../category.service';

@Component({
    selector: 'app-category-list',
    standalone: true,
    imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
    ],
    templateUrl: './category-list.page.html',
    styleUrl: './category-list.page.scss'
})
export class CategoryListPage implements OnInit {

    dataSource = new MatTableDataSource<Category>();
    displayedColumns: string[] = ['id', 'name', 'action'];


constructor(
    private categoryService: CategoryService,
    public dialog: MatDialog
) {}

ngOnInit(): void {
    this.categoryService.getCategories().subscribe(categories => {
    this.dataSource.data = categories;
    });
}

createCategory(): void {    
    const dialogRef = this.dialog.open(CategoryEditComponent, {
        data: {}
    });

    dialogRef.afterClosed().subscribe(() => {
        this.ngOnInit();
    });
}
editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEditComponent, {
        data: { category: category }
    });

    dialogRef.afterClosed().subscribe(result => {
        this.ngOnInit();
    });
}

deleteCategory(category: Category) {    
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
        data: { title: "Eliminar categoría", description: "Atención si borra la categoría se perderán sus datos.<br> ¿Desea eliminar la categoría?" }
    });

    
dialogRef.afterClosed().subscribe(result => {
    if (result && category.id != null) {
    this.categoryService.deleteCategory(category.id).subscribe(() => {
        this.ngOnInit();
    });
    }
});
} 

}
