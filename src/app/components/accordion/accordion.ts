import { Component } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';

@Component({
    selector: 'accordion',
    templateUrl: 'accordion.html',
    styleUrl: 'accordion.css',
    standalone: true,
    imports: [CdkAccordionModule],
})

export class Accordion {
    items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];
    expandedIndex = 0;
}