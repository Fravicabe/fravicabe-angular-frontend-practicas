import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-dialog-confirmation',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule],
    templateUrl: './dialog-confirmation.html',
    styleUrl: './dialog-confirmation.scss'
})
export class DialogConfirmationComponent implements OnInit {
    protected readonly dialogRef = inject(MatDialogRef<DialogConfirmationComponent>);
    protected readonly data = inject(MAT_DIALOG_DATA);

    protected readonly title = signal<string>('');
    protected readonly description = signal<string>('');

    ngOnInit(): void {
        this.title.set(this.data.title ?? 'Confirmación');
        this.description.set(this.data.description ?? '');
    }

    onYes(): void {
        this.dialogRef.close(true);
    }

    onNo(): void {
        this.dialogRef.close(false);
    }
}
