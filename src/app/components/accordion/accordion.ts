import { Component, Input } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AccordionItem } from './accordion-item';

@Component({
    selector: 'accordion',
    templateUrl: 'accordion.html',
    styleUrl: 'accordion.css',
    standalone: true,
    imports: [CdkAccordionModule],
})

export class Accordion {
    @Input() items: AccordionItem[] = [];

    expandedIndex = 0;

}