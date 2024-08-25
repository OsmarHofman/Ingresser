import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';


@Component({
    selector: 'cost-input-container',
    templateUrl: 'cost-input-container.html',
    styleUrl: 'cost-input-container.scss',
    standalone: true,
    imports: [
        MatCardModule
    ],
})

export class CostInputContainerComponent {
}