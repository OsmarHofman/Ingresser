import { Component, inject } from '@angular/core';
import {
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
import { EntityType } from '../../../../model/entityType';

@Component({
    selector: 'create-option-dialog',
    templateUrl: 'create-option-dialog.component.html',
    styleUrl: 'create-option-dialog.component.scss',
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

export class CreateOptionDialog {
    readonly dialogRef = inject(MatDialogRef<CreateOptionDialog>);

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public returnCreateShipment(): EntityType {
        return EntityType.Shipment;
    }
}