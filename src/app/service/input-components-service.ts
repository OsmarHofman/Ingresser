import { Injectable, Type } from '@angular/core';
import { ShipmentHeaderInputComponent } from '../components/shipment/shipment-header/shipment-header-input';
import { CostInputContainerComponent } from '../components/shipment/cost-input-container/cost-input-container';
import { SelectionErrorComponent } from '../components/selection-error/selection-error';


@Injectable({ providedIn: 'root' })
export class InputComponentsService {
  getComponents() {
    return [
      {
        component: SelectionErrorComponent,
      },
      {
        component: ShipmentHeaderInputComponent,
      },
      {
        component: CostInputContainerComponent,
        // inputs: { name: 'Dr. IQ', bio: 'Smart as they come' },
      }
    ] as { component: Type<any>, inputs: Record<string, unknown> }[];
  }
}