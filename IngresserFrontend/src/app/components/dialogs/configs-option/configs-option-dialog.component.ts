import { Component, inject } from '@angular/core';
import {
    MatDialogRef,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Configs } from './configs';

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
        MatDialogContent,
        MatDialogActions,
        MatDialogClose,
    ]
})

export class ConfigsOptionDialog {

    readonly dialogRef = inject(MatDialogRef<ConfigsOptionDialog>);
    readonly configs = inject<Configs>(MAT_DIALOG_DATA);

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public returnConfigurations(): Configs {
        return this.configs;
    }

}