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
import { Shipment, CreationSource, ShipmentIndex } from '../../../../model/shipment';

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

    private uploadedShipments: ShipmentIndex[] = [];

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

    //TODO: Criar ação do botão "Importar"

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

                            if (!isNaN(convertedFileObject.sendSequenceIndex) && convertedFileObject.shipment) {

                                const shipment: Shipment = new Shipment(convertedFileObject.shipment, CreationSource.JSON);

                                this.uploadedShipments.push(new ShipmentIndex(convertedFileObject.sendSequenceIndex, shipment));
                            }
                            else {

                                indexesWithError += `${index}, `;
                                return;
                            }
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
}