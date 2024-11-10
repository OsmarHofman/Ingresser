import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
    MAT_DIALOG_DATA,
    MatDialogRef,
    MatDialogActions,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';

import { EntityType, EntityTypeLabel } from '../../../model/entityType';


@Component({
    selector: 'delete-option-dialog',
    templateUrl: 'delete-option-dialog.component.html',
    styleUrl: 'delete-option-dialog.component.scss',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogActions,
        MatCheckbox,
        CommonModule
    ]
})

export class DeleteOptionDialog {
    readonly dialogRef = inject(MatDialogRef<DeleteOptionDialog>);
    readonly entities = inject<EntityType[]>(MAT_DIALOG_DATA);

    public selectedRows: number[] = [];

    constructor() {
        this.selectedRows = [];
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public getEntityAndNumberByIndex(index: number): string {
        const entity: EntityType = this.entities[index];

        return `${EntityTypeLabel.get(entity)} no índice: ${index}`;
    }

    public markRowAsSelected(selectedIndex: number) {
        if (this.selectedRows.includes(selectedIndex))
            delete this.selectedRows[this.selectedRows.indexOf(selectedIndex)];
        else
            this.selectedRows.push(selectedIndex);
    }

    public returnEntitiesToBeDeleted(): void {
        this.dialogRef.close(this.selectedRows);
    }
}