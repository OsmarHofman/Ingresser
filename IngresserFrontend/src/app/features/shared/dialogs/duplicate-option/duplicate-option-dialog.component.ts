import { Component, inject } from '@angular/core';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { EntityTypeLabel, SendEntity } from '../../../../model/entityType';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';


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
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatRadioModule,
        CommonModule
    ]
})

export class DuplicateOptionDialog {
    readonly dialogRef = inject(MatDialogRef<DuplicateOptionDialog>);
    readonly entities = inject<SendEntity[]>(MAT_DIALOG_DATA);

    public selectedEntity: SendEntity = this.entities[0];

    constructor() { }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public getEntityAndNumberByIndex(index: number): string {
        const entity: SendEntity = this.entities[index];

        return `${EntityTypeLabel.get(entity.type)} no índice: ${index}`;
    }
}