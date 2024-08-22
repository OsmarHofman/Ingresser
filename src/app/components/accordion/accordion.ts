import { Component, Input } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AccordionItem } from './accordion-item';
import { Tab } from '../tab/tab';

@Component({
    selector: 'accordion',
    templateUrl: 'accordion.html',
    styleUrl: 'accordion.scss',
    standalone: true,
    imports: [
        CdkAccordionModule,
        Tab
    ],
})

export class Accordion {
    @Input() items: AccordionItem[] = [];

    expandedIndex = 0;

}