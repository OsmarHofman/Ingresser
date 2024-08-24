import { Component } from '@angular/core';
import { GridComponent } from '../../grid/grid';
import { InputContainerComponent } from "../../input-container/input-container";

@Component({
    selector: 'shipment-header-input',
    templateUrl: 'shipment-header-input.html',
    styleUrl: 'shipment-header-input.scss',
    standalone: true,
    imports: [GridComponent, InputContainerComponent],
})

export class ShipmentHeaderInputComponent {
    expandedIndex = 0;

}