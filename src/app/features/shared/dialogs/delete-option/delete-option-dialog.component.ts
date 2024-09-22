import { Component, inject, model } from '@angular/core';
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

import { AcessorialCost } from '../../../../model/shipment';
import { ShipmentOptionsResult as ShipmentOptionsResult } from './model/shipment-options-result';
import { EntityTypeLabel, SendEntity } from '../../../../model/entityType';
import { CommonModule } from '@angular/common';
import { MatCheckbox } from '@angular/material/checkbox';


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
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
        MatCheckbox,
        CommonModule
    ]
})

export class DeleteOptionDialog {
    readonly dialogRef = inject(MatDialogRef<DeleteOptionDialog>);
    readonly entities = inject<SendEntity[]>(MAT_DIALOG_DATA);

    public selectedRows: number[] = [];


    constructor(){
        this.selectedRows = [];
    }

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public getEntityAndNumberByIndex(index: number): string {
        const entity: SendEntity = this.entities[index];

        return `${EntityTypeLabel.get(entity.type)} no índice: ${index}`;
    }

    public markRowAsSelected(selectedIndex: number) {
        if (this.selectedRows.includes(selectedIndex))
            delete this.selectedRows[this.selectedRows.indexOf(selectedIndex)];
        else
            this.selectedRows.push(selectedIndex);
    }
}