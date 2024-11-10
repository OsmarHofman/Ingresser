import { Component, inject } from '@angular/core';
import {
    MatDialogRef,
    MatDialogActions,
    MatDialogTitle,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Configs } from '../../../model/configs';

@Component({
    selector: 'configs-option-dialog',
    templateUrl: 'configs-option-dialog.component.html',
    styleUrl: 'configs-option-dialog.component.scss',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        MatButtonModule,
        MatDialogTitle,
        MatDialogActions,
    ]
})

export class ConfigsOptionDialog {

    readonly dialogRef = inject(MatDialogRef<ConfigsOptionDialog>);
    readonly configs = inject<Configs>(MAT_DIALOG_DATA);

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public returnConfigurations(): void {
        this.dialogRef.close(this.configs);
    }

}