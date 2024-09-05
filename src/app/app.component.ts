import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShipmentHeaderAccordionComponent } from './features/segments/shipment-header/shipment-header-accordion.component';
import { ShipmentHeader2AccordionComponent } from './features/segments/shipment-header2/shipment-header2-accordion.component';
import { ShipmentStopAccordionComponent } from './features/segments/shipment-stop/shipment-stop-accordion.component';
import { LocationAccordionComponent } from './features/segments/location/location-accordion.component';
import { ReleaseAccordionComponent } from './features/segments/release/release-accordion.component';
import { AppService } from './features/service/app.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule,
    ShipmentHeaderAccordionComponent,
    ShipmentHeader2AccordionComponent,
    ShipmentStopAccordionComponent,
    LocationAccordionComponent,
    ReleaseAccordionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {

  private appService: AppService = new AppService();

  constructor(private formBuilder: FormBuilder) {
  }

  //#region Form

  form: FormGroup = this.formBuilder.group({
    shipmentHeader: [''],
    shipmentHeader2: [''],
    shipmentStop: [''],
    location: [''],
    release: [''],
  });

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

  title = 'Ingresser';

  showShipmentAccordion: boolean = false;

  public createShipment() {
    this.showShipmentAccordion = true;
  }

  public deleteShipment() {
    if (confirm('Tem certeza que deseja remover esse embarque?')) {
      this.showShipmentAccordion = false;
    }
  }
}
