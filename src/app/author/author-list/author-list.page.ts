

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthorEditComponent } from '../author-edit/author-edit';
import { AuthorService } from '../author.service';
import { Author } from '../model/Author';
import { Pageable } from '../../core/model/page/Pageable';
import { DialogConfirmationComponent } from '../../core/dialog-confirmation/dialog-confirmation';



@Component({
  selector: 'app-author-list',
  standalone: true,
  templateUrl: './author-list.page.html',
  styleUrl: './author-list.page.scss',
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
  ],
})


export class AuthorListPage implements OnInit {
  pageNumber = 0;
  pageSize = 5;
  totalElements = 0;

  dataSource = new MatTableDataSource<Author>();
  displayedColumns: string[] = ['id', 'name', 'nationality', 'action'];

  private readonly authorService = inject(AuthorService);
  private readonly dialog = inject(MatDialog);

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(event?: PageEvent): void {
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [{ property: 'id', direction: 'ASC' }],
    };

    if (event) {
      pageable.pageNumber = event.pageIndex;
      pageable.pageSize = event.pageSize;
    }

    
  this.authorService.getAuthors(pageable).subscribe(data => {
    this.dataSource.data = data.content ?? [];
    this.pageNumber = data.pageable?.pageNumber ?? 0;
    this.pageSize = data.pageable?.pageSize ?? this.pageSize;
    this.totalElements = data.totalElements ?? 0;
  });

  }

  createAuthor(): void {
    const dialogRef = this.dialog.open(AuthorEditComponent, { data: {} });
    dialogRef.afterClosed().subscribe(() => this.loadPage());
  }

  editAuthor(author: Author): void {
    const dialogRef = this.dialog.open(AuthorEditComponent, {
      data: { author }
    });
    dialogRef.afterClosed().subscribe(() => this.loadPage());
  }

  deleteAuthor(author: Author): void {
    const dialogRef = this.dialog.open(DialogConfirmationComponent, {
      data: {
        title: 'Eliminar autor',
        description:
          'Atención si borra el autor se perderán sus datos.<br> ¿Desea eliminar el autor?',
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && author.id != null) {
        this.authorService.deleteAuthor(author.id).subscribe(() => {
          this.loadPage();
        });
      }
    });
  }
}

