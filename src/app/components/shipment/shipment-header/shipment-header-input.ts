import { Component } from '@angular/core';
import { GridComponent } from '../../grid/grid';
import { CarrierInputContainerComponent } from "./carrier-input-container/carrier-input-container";

@Component({
    selector: 'shipment-header-input',
    templateUrl: 'shipment-header-input.html',
    styleUrl: 'shipment-header-input.scss',
    standalone: true,
    imports: [
        GridComponent,
        CarrierInputContainerComponent,
    ],
})

export class ShipmentHeaderInputComponent {
}