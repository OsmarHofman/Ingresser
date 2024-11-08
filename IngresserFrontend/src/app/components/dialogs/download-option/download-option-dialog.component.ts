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
import { AbstractControl, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { EntityType } from '../../../model/entityType';
import { MatRadioModule } from '@angular/material/radio';
import fileSaver from 'file-saver';
import { DownloadModel } from '../../../model/downloadModel';
import { Shipment } from '../../../model/shipment';
import { CreationSource } from '../../../model/enums/creation-source';
import { NFe } from '../../../model/nfe';

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
    public fileName = 'Ingresser';

    readonly dialogRef = inject(MatDialogRef<DownloadOptionDialog>);
    readonly entitiesToDownload = inject<DownloadModel>(MAT_DIALOG_DATA);

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
        if (this.downloadType === 'json')
            this.downloadFileAsJson();
        else
            this.downloadFileAsXml();

        this.dialogRef.close();
    }

    private downloadFileAsJson() {
        let jsonToBeDownloaded: string = '[';

        this.entitiesToDownload.formValue.forEach((entityToDownload: any, index: number) => {

            if (index > 0)
                jsonToBeDownloaded += ',\n';

            const entityType: EntityType = this.entitiesToDownload.entitiesTypes[index];

            switch (entityType) {
                case EntityType.Shipment:

                    const shipment: Shipment = new Shipment(entityToDownload[0], CreationSource.Form);

                    jsonToBeDownloaded += JSON.stringify({ shipment: shipment });

                    break;

                case EntityType.NFe:

                    const nfe: NFe = new NFe(entityToDownload[0], CreationSource.Form);

                    jsonToBeDownloaded += JSON.stringify({ nfe: nfe });

                    break;

                case EntityType.NotFound:
                default:
                    return;
            }

        });

        jsonToBeDownloaded += ']'

        var blob = new Blob([jsonToBeDownloaded], { type: "application/json;charset=utf-8" });
        fileSaver.saveAs(blob, `${this.fileName}.json`);
    }

    private downloadFileAsXml() {
        var blob = new Blob(["Hello, world!"], { type: "application/xml;charset=utf-8" });
        fileSaver.saveAs(blob, `${this.fileName}.xml`);
    }

}