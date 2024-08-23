import { Component, Input } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ShipmentHeaderInputComponent } from '../shipment/shipment-header/shipment-header-input';

@Component({
    selector: 'tab',
    templateUrl: 'tab.html',
    styleUrl: 'tab.scss',
    standalone: true,
    imports: [
        MatTabsModule,
        ShipmentHeaderInputComponent
    ],
})

export class TabComponent {
    @Input() xmlContent: string = '';

    expandedIndex = 0;
}