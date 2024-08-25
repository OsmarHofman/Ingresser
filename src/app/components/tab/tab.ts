import {
    Component,
    Input,
    inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ShipmentHeaderInputComponent } from '../shipment/shipment-header/shipment-header-input';
import { InputComponentsService } from '../../service/input-components-service';

@Component({
    selector: 'tab',
    templateUrl: 'tab.html',
    styleUrl: 'tab.scss',
    standalone: true,
    imports: [
        CommonModule,
        MatTabsModule,
        ShipmentHeaderInputComponent,
    ],
})

export class TabComponent {

    @Input() inputComponent: string = '';
    @Input() xmlContent: string = '';

    public hasXmlContent(): boolean {
        return (this.xmlContent) ? true : false;
    }

    private componentList = inject(InputComponentsService).getComponents();

    get currentInputComponent() {
        const currentComponent = this.componentList.find(component => component.component.name.includes(this.inputComponent));

        if (currentComponent)
            return currentComponent;

        return this.componentList[0];
    }
}