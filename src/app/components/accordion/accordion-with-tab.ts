import { Component, Input } from '@angular/core';
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { AccordionItem } from './model/accordion-item';
import { TabComponent } from '../tab/tab';

@Component({
    selector: 'accordion-with-tab',
    templateUrl: 'accordion-with-tab.html',
    styleUrl: 'accordion-with-tab.scss',
    standalone: true,
    imports: [
        CdkAccordionModule,
        TabComponent
    ],
})

export class AccordionWithTabComponent {
    @Input() items: AccordionItem[] = [];

}