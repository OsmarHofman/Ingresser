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
import { MatRadioModule } from '@angular/material/radio';

@Component({
    selector: 'upload-option-dialog',
    templateUrl: 'upload-option-dialog.component.html',
    styleUrl: 'upload-option-dialog.component.scss',
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
        MatRadioModule
    ]
})

export class UploadOptionDialog {
    public fileName = '...';
    public uploadType = 'entity';

    readonly dialogRef = inject(MatDialogRef<UploadOptionDialog>);

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public returnCreateShipment(): EntityType {
        return EntityType.Shipment;
    }

    public onUploadTypeChange(event: any): void {
        this.uploadType = event.source.id;

        this.fileName = '...';
    }

    public onFileSelected(event: any): void {

        const file: File = event.target.files[0];

        if (file) {
            this.fileName = file.name;

            let fileReader = new FileReader();

            fileReader.onload = (e) => {
                console.log(fileReader.result);
            }

            fileReader.readAsText(file);
        }

    }
}