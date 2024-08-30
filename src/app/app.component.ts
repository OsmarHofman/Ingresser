import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccordionItem } from './components/accordion/model/accordion-item';
import { CommonModule } from '@angular/common';
import { ShipmentBaseTag } from './model/xml-base-tags/shipment';
import { AccordionWithTabComponent } from './components/accordion/accordion-with-tab';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AccordionWithTabComponent,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})

export class AppComponent {

  constructor(private formBuilder: FormBuilder) { }

  //#region Form

  form: FormGroup = this.formBuilder.group({
    shipment: [''],
  });

  submitForm(): void {
    console.log('Formulario:', this.form.value);
  }

  //#endregion

  title = 'Ingresser';

  public shipmentTags: AccordionItem[] = [];

  showShipmentAccordion: boolean = false;

  public createShipment() {

    this.shipmentTags = [];

    this.createBaseShipmentTags();

    this.showShipmentAccordion = true;
  }

  private createBaseShipmentTags() {

    this.shipmentTags.push(new AccordionItem(
      'ShipmentHeaderInputComponent',
      'ShipmentHeader',
      ShipmentBaseTag.ShipmentHeader)
    );

    this.shipmentTags.push(new AccordionItem('CostInputContainerComponent',
      'Custos',
      '')
    );
  }

  public deleteShipment() {
    if (confirm('Tem certeza que deseja remover esse embarque?')) {
      this.shipmentTags = [];
      this.showShipmentAccordion = false;
    }
  }
}
