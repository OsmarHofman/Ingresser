import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShipmentHeaderAccordionComponent } from './components/segments/shipment-header/shipment-header-accordion';
import { CostAccordionComponent } from './components/segments/cost/cost-accordion';
import { ShipmentHeader2AccordionComponent } from './components/segments/shipment-header2/shipment-header2-accordion';
import { ShipmentStopAccordionComponent } from './components/segments/shipment-stop/shipment-stop-accordion';
import { LocationAccordionComponent } from './components/segments/location/location-accordion';

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
    CostAccordionComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {

  constructor(private formBuilder: FormBuilder) { }

  //#region Form

  form: FormGroup = this.formBuilder.group({
    shipmentHeader: [''],
    shipmentHeader2: [''],
    shipmentStop: [''],
    location: [''],
    cost: ['']
  });

  submitForm(): void {
    console.log('Formulario:', this.form.value);
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
