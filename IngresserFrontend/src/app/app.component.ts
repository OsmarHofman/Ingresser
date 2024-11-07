import {
  Component,
  Injectable,
  signal,
  model,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  viewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from './features/service/app.service';
import { MatDialog } from '@angular/material/dialog';
import { ShipmentComponent } from './features/entities/shipment/shipment.component';
import { EntityType, SendEntity } from './model/entityType';
import { DeleteOptionDialog } from './components/dialogs/delete-option/delete-option-dialog.component';
import { DuplicateOptionDialog } from './components/dialogs/duplicate-option/duplicate-option-dialog.component';
import { UploadOptionDialog } from './components/dialogs/upload-option/upload-option-dialog.component';
import { DownloadOptionDialog } from './components/dialogs/download-option/download-option-dialog.component';
import { ConfigsOptionDialog } from './components/dialogs/configs-option/configs-option-dialog.component';
import { Configs } from './components/dialogs/configs-option/configs';
import { CreateOptionDialog } from './components/dialogs/create-option/create-option-dialog.component';
import { DownloadModel } from './model/downloadModel';
import { ShipmentIndex } from './model/shipment';
import { NFeComponent } from './features/entities/nfe/nfe.component';

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

  public sendConfigs: Configs = new Configs(10,'','');

  public entitiesTypes: EntityType[] = [];

  constructor(private formBuilder: FormBuilder,
    private appService: AppService,
    private dialog: MatDialog) { }

  //#region Form

  public form: FormGroup = this.formBuilder.group({
    entities: this.formBuilder.array([]),
  },);

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

  get entities() {
    return this.form.get('entities') as FormArray;
  }
  //#endregion

  readonly costXid = signal('');
  readonly costValue = model('');

  //#region Menu Options

  @ViewChild(ShipmentComponent) shipmentComponent!: ShipmentComponent;
  @ViewChild(NFeComponent) nfeComponent!: NFeComponent;

  //#region Create Options
  public showCreateOptions(): void {
    const dialogRef = this.dialog.open(CreateOptionDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.createEntityByAction(result);
      }
    });
  }

  public createEntityByAction(result: EntityType) {

    switch (result) {
      case EntityType.Shipment:

        this.entitiesTypes.push(EntityType.Shipment);

        this.addShipmentComponent();

        break;

      case EntityType.NFe:

        this.entitiesTypes.push(EntityType.NFe);

        this.addNFeComponent();

        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Upload Options

  public showUploadOptions(): void {
    const dialogRef = this.dialog.open(UploadOptionDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.createEntitiesFromUpload(result);
      }
    });

  }

  public createEntitiesFromUpload(entitiesFromUpload: ShipmentIndex[]): void {

    if (entitiesFromUpload) {

      entitiesFromUpload.forEach((entity: ShipmentIndex) => {

        this.form.reset();

        this.entitiesTypes.push(EntityType.Shipment);

        this.shipmentComponent.addShipment(entity.shipment);

      });

    }
  }

  //#endregion

  //#region Download Options

  public showDownloadOptions(): void {
    if (!this.form.value.shipment && !this.form.value.nfe) {
      alert("Não há nada para ser baixado!");

      return;
    }

    const dialogRef = this.dialog.open(DownloadOptionDialog,
      {
        data: new DownloadModel(this.form, this.entitiesTypes)
      }
    );

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.createEntityByAction(result);
      }
    });

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

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.duplicateEntityByIndex(result);
      }
    });
  }

  public duplicateEntityByIndex(sendEntityToBeDuplicated: SendEntity) {

    switch (sendEntityToBeDuplicated.type) {
      case EntityType.Shipment:
        this.shipmentComponent.duplicateShipmentByIndex(sendEntityToBeDuplicated.entityListIndex);

        break;

      default:
        break;
    }

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
        this.setConfigs(result);
      }
    });
  }


  private setConfigs(result: Configs) {
    this.sendConfigs = result;
  }

  //#endregion

  //#endregion

  
  public addShipmentComponent() {
    this.#shipmentComponentRef = this.vcr()?.createComponent(ShipmentComponent);

    const shipmentForm = this.#shipmentComponentRef?.instance.shipments!;

    shipmentForm.push(
      this.formBuilder.group(this.appService.getShipmentDefaultFormValues())
    );

    this.entities.push(
      shipmentForm
    );
  }

  public addNFeComponent() {
    this.#nfeComponentRef = this.vcr()?.createComponent(NFeComponent);

    const nfeForm = this.#nfeComponentRef?.instance.nfes!;

    nfeForm.push(
      this.formBuilder.group(this.appService.getNFeDefaultFormValues())
    );

    this.entities.push(
      nfeForm
    );
  }
}