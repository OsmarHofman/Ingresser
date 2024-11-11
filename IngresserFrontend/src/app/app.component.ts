import {
  Component,
  Injectable,
  ViewContainerRef,
  ComponentRef,
  viewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { AppService } from './features/service/app.service';
import { NFeComponent } from './features/entities/nfe/nfe.component';
import { ShipmentComponent } from './features/entities/shipment/shipment.component';

import { DeleteOptionDialog } from './components/dialogs/delete-option/delete-option-dialog.component';
import { DuplicateOptionDialog } from './components/dialogs/duplicate-option/duplicate-option-dialog.component';
import { UploadOptionDialog } from './components/dialogs/upload-option/upload-option-dialog.component';
import { DownloadOptionDialog } from './components/dialogs/download-option/download-option-dialog.component';
import { ConfigsOptionDialog } from './components/dialogs/configs-option/configs-option-dialog.component';
import { CreateOptionDialog } from './components/dialogs/create-option/create-option-dialog.component';

import { EntityType } from './model/entityType';
import { Configs } from './model/configs';
import { Shipment } from './model/shipment';
import { DownloadModel } from './model/downloadModel';
import { NFe } from './model/nfe';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AppService],
})


@Injectable()
export class AppComponent {

  public vcr = viewChild('entities', { read: ViewContainerRef });

  #shipmentComponentRef?: ComponentRef<ShipmentComponent>;
  #nfeComponentRef?: ComponentRef<NFeComponent>;

  public sendConfigs: Configs = new Configs(10, '', '');

  public entitiesTypes: EntityType[] = [];

  constructor(private formBuilder: FormBuilder,
    private appService: AppService,
    private dialog: MatDialog) { }

  //#region Form

  public form: FormGroup = this.formBuilder.group({
    entities: this.formBuilder.array([]),
  },);

  get entities() {
    return this.form.get('entities') as FormArray;
  }

  public submitForm(): void {
    console.log('Formulario:', this.form.value);

    // if (this.validateForm())
    this.appService.sendXmlsToWS(this.form, this.entitiesTypes, this.sendConfigs);
    // else
    //   alert('Alguma tag não foi preenchida! Favor verificar se os campos foram preenchidos ou selecionado a aba do xml!');
  }

  private validateForm(): boolean {

    if (!this.validateFormControls()) return false;

    return true;
  }

  private validateFormControls(): boolean {

    /*O Cost não é validado aqui, pois se ele for preenchido manualmente será usado 
      tanto no embarque quanto na release. Mas caso use o xml no shipmentHeader e na
      release, terá que colocar em cada um. Então depois tem que ser validado se o cost
      foi preenchido manualmente ou se está no xml do embarque ou da release
    */
    const controlNames = ['shipmentHeader', 'shipmentHeader2', 'shipmentStop', 'location', 'release'];

    return controlNames.every(controlName => this.form.controls[controlName].value);
  }

  //#endregion

  //#region Menu Options

  //#region Create Options
  public showCreateOptions(): void {
    const dialogRef = this.dialog.open(CreateOptionDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {

        switch (result) {
          case EntityType.Shipment:

            this.entitiesTypes.push(EntityType.Shipment);

            this.addDefaultShipmentComponent();

            break;

          case EntityType.NFe:

            this.entitiesTypes.push(EntityType.NFe);

            this.addDefaultNFeComponent();

            break;

          default:
            break;
        }
      }
    });
  }

  public addDefaultShipmentComponent() {
    this.#shipmentComponentRef = this.vcr()?.createComponent(ShipmentComponent);

    const shipmentForm = this.#shipmentComponentRef?.instance.shipments!;

    shipmentForm.push(
      this.formBuilder.group(Shipment.getShipmentDefaultFormValues())
    );

    this.entities.push(
      shipmentForm
    );

  }

  public addDefaultNFeComponent() {
    this.#nfeComponentRef = this.vcr()?.createComponent(NFeComponent);

    const nfeForm = this.#nfeComponentRef?.instance.form!;

    nfeForm.setValue(NFe.getNFeDefaultFormValues());

    this.entities.push(
      nfeForm
    );
  }

  //#endregion

  //#region Upload Options

  public showUploadOptions(): void {
    const dialogRef = this.dialog.open(UploadOptionDialog);

    dialogRef.afterClosed().subscribe((result: DownloadModel) => {
      if (result !== undefined) {
        this.createEntitiesFromUpload(result);
      }
    });
  }

  public createEntitiesFromUpload(entitiesFromUpload: DownloadModel): void {

    if (entitiesFromUpload) {

      this.form.reset();

      entitiesFromUpload.entitiesTypes.forEach((entityType: EntityType, index: number) => {

        switch (entityType) {
          case EntityType.Shipment:

            this.entitiesTypes.push(EntityType.Shipment);

            const shipment: Shipment = entitiesFromUpload.formValue[index];

            this.addShipmentComponent(shipment);

            break;

          case EntityType.NFe:

            this.entitiesTypes.push(EntityType.NFe);

            const nfe: NFe = entitiesFromUpload.formValue[index];

            this.addNFeComponent(nfe);

            break;

          case EntityType.NotFound:
          default:
            break;
        }
      });
    }
  }

  public addShipmentComponent(shipment: Shipment) {
    this.#shipmentComponentRef = this.vcr()?.createComponent(ShipmentComponent);

    const shipmentForm = this.#shipmentComponentRef?.instance.shipments!;

    shipmentForm.push(
      this.formBuilder.group(Shipment.getShipmentFromEntity(shipment))
    );

    this.entities.push(
      shipmentForm
    );
  }

  public addNFeComponent(nfe: NFe) {
    this.#nfeComponentRef = this.vcr()?.createComponent(NFeComponent);

    const nfeForm = this.#nfeComponentRef?.instance.form!;

    nfeForm.setValue(NFe.addNFeFromEntity(nfe));

    if (nfe.emit.cnpj !== nfe.retirada.cnpj) {
      this.#nfeComponentRef?.instance.changeRetiradaState();
    }

    if (nfe.dest.cnpj !== nfe.entrega.cnpj) {
      this.#nfeComponentRef?.instance.changeEntregaState();
    }

    this.entities.push(
      nfeForm
    );

  }

  //#endregion

  //#region Download Options

  public showDownloadOptions(): void {
    if (this.entities.value.length === 0) {
      alert("Não há nada para ser baixado!");

      return;
    }

    this.dialog.open(DownloadOptionDialog,
      {
        data: new DownloadModel(this.entities.value, this.entitiesTypes)
      }
    );
  }

  //#endregion

  //#region Duplicate Options
  public showDuplicateOptions(): void {
    if (this.entitiesTypes.length === 0) {
      alert("Não há nada para ser duplicado!");

      return;
    }

    const dialogRef = this.dialog.open(DuplicateOptionDialog, {
      data: this.entitiesTypes,
    }
    );

    dialogRef.afterClosed().subscribe((entityIndex: number) => {
      if (entityIndex !== undefined) {

        const entityType: EntityType = this.entitiesTypes[entityIndex];

        switch (entityType) {

          case EntityType.Shipment:
            this.duplicateShipmentByIndex(entityIndex);

            break;

          case EntityType.NFe:
            this.duplicateNFeByIndex(entityIndex);

            break;

          default:
            break;
        }
      }
    });
  }

  public duplicateShipmentByIndex(index: number): void {

    this.#shipmentComponentRef = this.vcr()?.createComponent(ShipmentComponent);

    const shipmentForm = this.#shipmentComponentRef?.instance.shipments!;

    const shipmentToBeDuplicated = this.entities.value[index][0];

    shipmentForm.push(
      this.formBuilder.group(Shipment.getNewShipmentByExistent(shipmentToBeDuplicated))
    );

    this.entities.push(
      shipmentForm
    );

    this.entitiesTypes.push(EntityType.Shipment);
  }

  public duplicateNFeByIndex(index: number): void {

    this.#nfeComponentRef = this.vcr()?.createComponent(NFeComponent);

    const nfeForm = this.#nfeComponentRef?.instance.form!;

    const nfeToBeDuplicated = this.entities.value[index];

    nfeForm.setValue(NFe.getNewNFeByExistent(nfeToBeDuplicated));

    this.entities.push(
      nfeForm
    );

    this.entitiesTypes.push(EntityType.NFe);
  }

  //#endregion  

  //#region Delete Options
  public showDeleteOptions(): void {
    if (this.entitiesTypes.length === 0) {
      alert("Não há nada para ser deletado!");

      return;
    }

    const dialogRef = this.dialog.open(DeleteOptionDialog, {
      data: this.entitiesTypes,
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.deleteEntityByIndexes(result);
      }
    });
  }

  public deleteEntityByIndexes(indexes: number[]) {
    indexes = indexes.sort();

    for (let i = indexes.length - 1; i >= 0; i--) {

      this.vcr()?.remove(indexes[i]);

      this.entities.removeAt(indexes[i]);

      delete this.entitiesTypes[indexes[i]]
    }

    this.entitiesTypes = this.entitiesTypes.filter((entityToBeSent: EntityType) => {
      return entityToBeSent !== undefined;
    })
  }

  //#endregion

  //#region Configs Options
  public showConfigsOptions(): void {
    const dialogRef = this.dialog.open(ConfigsOptionDialog, {
      data: this.sendConfigs,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.sendConfigs = result;
      }
    });
  }

  //#endregion

  //#endregion
}