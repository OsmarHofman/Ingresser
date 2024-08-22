import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Accordion } from '../app/components/accordion/accordion';
import { AccordionItem } from './components/accordion/accordion-item';
import { CommonModule } from '@angular/common';
import { ShipmentBaseTag } from './xml-base-tags/shipment';
import { Tab } from './components/tab/tab';
import { ShipmentHeaderInput } from './components/shipment/shipment-header/shipment-header-input';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Accordion,
    CommonModule,
    Tab,
    ShipmentHeaderInput
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: []
})

export class AppComponent {

  title = 'Ingresser';

  public shipmentTags: AccordionItem[] = [];

  showShipmentAccordion: boolean = false;

  public createShipment() {

    this.shipmentTags = [];

    this.createBaseShipmentTags();

    this.showShipmentAccordion = true;
  }

  private createBaseShipmentTags() {
    const shipmentHeader = new AccordionItem('ShipmentHeader', ShipmentBaseTag.ShipmentHeader);
    this.shipmentTags.push(shipmentHeader);
  }

  public deleteShipment() {
    if (confirm('Tem certeza que deseja remover esse embarque?')) {
      this.shipmentTags = [];
      this.showShipmentAccordion = false;
    }
  }
}
