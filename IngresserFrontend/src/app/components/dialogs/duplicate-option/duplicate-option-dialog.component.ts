import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogActions,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

import { EntityType, EntityTypeLabel } from '../../../model/entityType';


@Component({
    selector: 'duplicate-option-dialog',
    templateUrl: 'duplicate-option-dialog.component.html',
    styleUrl: 'duplicate-option-dialog.component.scss',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogActions,
        MatRadioModule,
        CommonModule
    ]
})

export class DuplicateOptionDialog {
    readonly dialogRef = inject(MatDialogRef<DuplicateOptionDialog>);
    readonly entities = inject<EntityType[]>(MAT_DIALOG_DATA);

    public selectedEntityIndex: number = 0;

    constructor() { }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public getEntityAndNumberByIndex(index: number): string {
        const entity: EntityType = this.entities[index];

        return `${EntityTypeLabel.get(entity)} no índice: ${index}`;
    }

    public returnEntityToBeDuplicated(): void {
        this.dialogRef.close(this.selectedEntityIndex);
    }
}