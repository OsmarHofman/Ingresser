import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';


@Component({
    selector: 'carrier-input-container',
    templateUrl: 'carrier-input-container.html',
    styleUrl: 'carrier-input-container.scss',
    standalone: true,
    imports: [
        MatCardModule
    ],
})

export class CarrierInputContainerComponent {
}