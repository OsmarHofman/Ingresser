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
    readonly action = model(this.data.costValue);

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public returnCreateShipment(): ShipmentOptionsResult {
        return new ShipmentOptionsResult('create', []);
    }
}