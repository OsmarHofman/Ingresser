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
import { EntityType } from '../../../../model/entityType';
import { MatRadioModule } from '@angular/material/radio';
import fileSaver from 'file-saver';

@Component({
    selector: 'download-option-dialog',
    templateUrl: 'download-option-dialog.component.html',
    styleUrl: 'download-option-dialog.component.scss',
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
    ]
})

export class DownloadOptionDialog {
    public downloadType = 'json';

    readonly dialogRef = inject(MatDialogRef<DownloadOptionDialog>);
    readonly entitiesToDownload = inject<any>(MAT_DIALOG_DATA);

    public onNoClick(): void {
        this.dialogRef.close();
    }

    public returnCreateShipment(): EntityType {
        return EntityType.Shipment;
    }

    public onDownloadTypeChange(event: any): void {
        this.downloadType = event.source.id;
    }

    public downloadCallsAsFile(): void {
        var blob = new Blob(["Hello, world!"], { type: "text/plain;charset=utf-8" });
        fileSaver.saveAs(blob, "hello world.txt");
        this.dialogRef.close();
    }
}