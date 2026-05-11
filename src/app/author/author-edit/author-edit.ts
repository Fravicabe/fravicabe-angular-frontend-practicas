import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthorService } from '../author.service';
import { Author } from '../model/Author';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-author-edit',
    standalone: true,
    imports: [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule ],
    templateUrl: './author-edit.html',
    styleUrl: './author-edit.scss',
})
export class AuthorEditComponent implements OnInit {
    protected readonly authorService = inject(AuthorService);
    protected readonly dialogRef = inject(MatDialogRef<AuthorEditComponent>);
    protected readonly data = inject(MAT_DIALOG_DATA);

    protected readonly id = signal<number | null>(null);
    protected readonly name = signal<string | null>(null);
    protected readonly nationality = signal<string | null>(null);

    
    loadFormData(initialData: Author | null) {
      if (!initialData) {
        this.id.set(null);
        this.name.set(null);
        this.nationality.set(null);
        return;
      }

      this.id.set(initialData.id ?? null);
      this.name.set(initialData.name ?? null);
      this.nationality.set(initialData.nationality ?? null);
    }


    ngOnInit(): void {
        this.loadFormData(this.data.author ?? null);
    }

    
    onSave() {
      const author: Author = {
        id: this.id() ?? undefined,
        name: this.name() ?? undefined,
        nationality: this.nationality() ?? undefined,
      };

      this.authorService.saveAuthor(author).subscribe(() => {
        this.dialogRef.close(author);
      });
    }


    onClose() {
        this.dialogRef.close(false);
    }
}
