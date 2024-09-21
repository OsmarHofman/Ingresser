import { Component, Injectable, signal, model } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from './features/service/app.service';
import { ShipmentBaseTag } from './model/xml-base-tags';
import { MatDialog } from '@angular/material/dialog';
import { ShipmentOptionDialog } from './features/shared/dialogs/shipment-option/shipment-option-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [AppService],
})


@Injectable()
export class AppComponent {

  constructor(private formBuilder: FormBuilder, private appService: AppService, private dialog: MatDialog) { }

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


  public showShipmentOptions(): void {
    const dialogRef = this.dialog.open(ShipmentOptionDialog, {
      data: { costXid: 'XID', costValue: this.costValue() },
    }
    );

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog fechou!');
      if (result !== undefined) {
        console.log(result);
      }
    });
  }
}