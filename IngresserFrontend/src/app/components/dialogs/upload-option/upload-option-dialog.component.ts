import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
    MatDialogRef,
    MatDialogActions,
    MatDialogTitle
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

import { NFe } from '../../../model/nfe';
import { Shipment } from '../../../model/shipment';
import { EntityType } from '../../../model/entityType';
import { DownloadModel } from '../../../model/downloadModel';
import { CreationSource } from '../../../model/enums/creation-source';

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
        MatDialogActions,
        MatRadioModule
    ]
})

export class UploadOptionDialog {
    public fileName = '...';
    public uploadType = 'entity';

    private uploadedEntities: any[] = [];
    private uploadedEntitiesTypes: EntityType[] = [];

    readonly dialogRef = inject(MatDialogRef<UploadOptionDialog>);

    public onNoClick(): void {
        this.dialogRef.close();
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

            fileReader.onload = () => {
                if (fileReader.result) {

                    const convertedFileObjects = JSON.parse(fileReader.result.toString());

                    if (convertedFileObjects) {

                        let indexesWithError: string = "";

                        convertedFileObjects.forEach((convertedFileObject: any, index: number) => {

                            const entityType = this.getEntityType(convertedFileObject);

                            switch (entityType) {
                                case EntityType.Shipment:

                                    const shipment: Shipment = new Shipment(convertedFileObject.shipment, CreationSource.JSON);

                                    this.uploadedEntities.push(shipment);

                                    break;

                                case EntityType.NFe:

                                    const nfe: NFe = new NFe(convertedFileObject.nfe, CreationSource.JSON);

                                    this.uploadedEntities.push(nfe);

                                    break;

                                default:
                                    indexesWithError += `${index}, `;
                                    return;
                            }

                            this.uploadedEntitiesTypes.push(entityType);
                        });

                        if (indexesWithError) {

                            indexesWithError = indexesWithError.substring(0, indexesWithError.length - 2);

                            alert(`Erro ao tentar fazer upload do arquivo: entidades nas posições ${indexesWithError} do Json não identificadas!`);
                        }

                    } else {
                        alert("Erro ao tentar fazer upload do arquivo: não conseguido converter arquivo JSON!");

                        return;
                    }
                }
            }

            fileReader.readAsText(file);
        }

    }

    private getEntityType(convertedFileObject: any): EntityType {
        if (convertedFileObject.shipment) return EntityType.Shipment;
        if (convertedFileObject.nfe) return EntityType.NFe;

        return EntityType.NotFound;
    }

    public returnEntitiesToBeUploaded(): void {
        this.dialogRef.close(new DownloadModel(this.uploadedEntities, this.uploadedEntitiesTypes));
    }
}