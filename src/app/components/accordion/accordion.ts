import { Component, Input } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AccordionItem } from './accordion-item';
import { TabComponent } from '../tab/tab';

@Component({
    selector: 'accordion',
    templateUrl: 'accordion.html',
    styleUrl: 'accordion.scss',
    standalone: true,
    imports: [
        CdkAccordionModule,
        TabComponent
    ],
})

export class AccordionComponent {
    @Input() items: AccordionItem[] = [];

    expandedIndex = 0;

}