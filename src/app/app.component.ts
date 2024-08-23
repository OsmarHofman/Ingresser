import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccordionComponent } from '../app/components/accordion/accordion';
import { AccordionItem } from './components/accordion/accordion-item';
import { CommonModule } from '@angular/common';
import { ShipmentBaseTag } from './xml-base-tags/shipment';
import { Refnum } from './model/refnum';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    AccordionComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  schemas: []
})

export class AppComponent {
  title = 'Ingresser';

  public shipmentTags: AccordionItem[] = [];

  public shipmentRefnums: Refnum[] = [
    new Refnum('EMBDEV', "XID", 'ABC')
  ];

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
