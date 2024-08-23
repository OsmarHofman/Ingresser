import { Component } from '@angular/core';
import { GridComponent } from '../../grid/grid';

@Component({
    selector: 'shipment-header-input',
    templateUrl: 'shipment-header-input.html',
    styleUrl: 'shipment-header-input.scss',
    standalone: true,
    imports: [GridComponent],
})

export class ShipmentHeaderInputComponent {

    expandedIndex = 0;

}