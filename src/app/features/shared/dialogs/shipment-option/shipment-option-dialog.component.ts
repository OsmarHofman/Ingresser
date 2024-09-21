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


@Component({
    selector: 'shipment-option-dialog',
    templateUrl: 'shipment-option-dialog.component.html',
    styleUrl: 'shipment-option-dialog.component.scss',
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
    ]
})

export class ShipmentOptionDialog {
    readonly dialogRef = inject(MatDialogRef<ShipmentOptionDialog>);
    readonly data = inject<AcessorialCost>(MAT_DIALOG_DATA);
    readonly costValue = model(this.data.costValue);

    onNoClick(): void {
        this.dialogRef.close();
    }
}