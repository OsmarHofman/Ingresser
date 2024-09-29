import { Component, Injectable, signal, model, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from './features/service/app.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateOptionDialog as CreateOptionDialog } from './features/shared/dialogs/create-option/create-option-dialog.component';
import { ShipmentComponent } from './features/segments/shipment/shipment.component';
import { EntityType, SendEntity } from './model/entityType';
import { DeleteOptionDialog } from './features/shared/dialogs/delete-option/delete-option-dialog.component';
import { DuplicateOptionDialog } from './features/shared/dialogs/duplicate-option/duplicate-option-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AppService],
})


@Injectable()
export class AppComponent {

  public entitiesToBeSent: SendEntity[] = [];

  constructor(private formBuilder: FormBuilder,
    private appService: AppService,
    private dialog: MatDialog) { }

  //#region Form

  public form: FormGroup = this.formBuilder.group({
    shipment: ['']
  },);

  public submitForm(): void {
    console.log('Formulario:', this.form.value);

    // if (this.validateForm())
    this.appService.convertFormToXml(this.form);
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

  readonly costXid = signal('');
  readonly costValue = model('');

  //#region Menu Options

  @ViewChild(ShipmentComponent) shipmentComponent!: ShipmentComponent;

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

        let shipmentIndex: number = 0;

        const shipmentList: any = this.form.controls['shipment'].value.shipments;

        if (shipmentList) {
          shipmentIndex = shipmentList.length;
        }

        this.entitiesToBeSent.push(new SendEntity(EntityType.Shipment, shipmentIndex));

        this.shipmentComponent.addShipment();

        break;

      default:
        break;
    }
  }

  //#endregion

  //#region Delete Options
  public showDeleteOptions(): void {
    if (this.entitiesToBeSent.length === 0) {
      alert("Não há nada para ser deletado!");

      return;
    }

    const dialogRef = this.dialog.open(DeleteOptionDialog, {
      data: this.entitiesToBeSent,
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
      const entityToBeDeleted = this.entitiesToBeSent[indexes[i]];

      switch (entityToBeDeleted.type) {
        case EntityType.Shipment:
          this.shipmentComponent.removeShipmentByIndex(entityToBeDeleted.entityListIndex);

          this.recalculateShipmentIndexesInEntitiesToBeSent(indexes, i);

          break;

        default:
          break;
      }

      delete this.entitiesToBeSent[indexes[i]]
    }

    this.entitiesToBeSent = this.entitiesToBeSent.filter((entityToBeSent: SendEntity) => {
      return entityToBeSent;
    })
  }

  private recalculateShipmentIndexesInEntitiesToBeSent(indexes: number[], i: number) {
    const lastEntityIndex: number = this.entitiesToBeSent.length - 1;

    if (lastEntityIndex > indexes[i]) {

      const entitiesAfterDeletedInList: SendEntity[] = this.entitiesToBeSent
        .slice(indexes[i] + 1, this.entitiesToBeSent.length)
        .filter((entityToBeSent: SendEntity) => {
          return entityToBeSent.type === EntityType.Shipment;
        });

      entitiesAfterDeletedInList.forEach((entityToBeSent: SendEntity) => {
        entityToBeSent.entityListIndex -= 1;
      });
    }
  }
  //#endregion

  //#region Create Options
  public showDuplicateOptions(): void {
    if (this.entitiesToBeSent.length === 0) {
      alert("Não há nada para ser duplicado!");

      return;
    }

    const dialogRef = this.dialog.open(DuplicateOptionDialog, {
      data: this.entitiesToBeSent,
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

  //#endregion
}