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
import { EntityType, SendEntity } from '../../../../model/entityType';
import { MatRadioModule } from '@angular/material/radio';
import fileSaver from 'file-saver';
import { DownloadModel } from '../../../../model/downloadModel';
import { Shipment, CreationSource, ShipmentIndex } from '../../../../model/shipment';

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

        this.entitiesToDownload.entitiesOrder.forEach((entityOrder: SendEntity, index) => {

            if (index > 0)
                jsonToBeDownloaded += ',\n';

            switch (entityOrder.type) {

                case EntityType.Shipment:
                    const formShipment = this.entitiesToDownload.formValue.controls['shipment'].value.shipments[entityOrder.entityListIndex];

                    const shipment: Shipment = new Shipment(formShipment, CreationSource.Form);

                    const shipmentIndex: ShipmentIndex = new ShipmentIndex(entityOrder.entityListIndex, shipment);

                    jsonToBeDownloaded += JSON.stringify(shipmentIndex);

                    break;

                default:
                    break;
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