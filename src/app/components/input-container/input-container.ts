import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';


@Component({
    selector: 'input-container',
    templateUrl: 'input-container.html',
    styleUrl: 'input-container.scss',
    standalone: true,
    imports: [
        MatCardModule
    ],
})

export class InputContainerComponent {
    expandedIndex = 0;

}