import { Component } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ShipmentHeaderInput } from '../shipment/shipment-header/shipment-header-input';

@Component({
    selector: 'tab',
    templateUrl: 'tab.html',
    styleUrl: 'tab.scss',
    standalone: true,
    imports: [
        MatTabsModule,
        ShipmentHeaderInput
    ],
})

export class Tab {

    expandedIndex = 0;

}