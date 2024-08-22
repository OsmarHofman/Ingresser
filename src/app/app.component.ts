import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Accordion } from '../app/components/accordion/accordion';
import { CommonModule } from '@angular/common';
import { AccordionItem } from './components/accordion/accordion-item';
import { ShipmentBaseTag } from './xml-base-tags/shipment';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CdkAccordionModule, Accordion, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
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
