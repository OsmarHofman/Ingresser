import { Injectable, Type } from '@angular/core';
import { SelectionErrorComponent } from '../components/selection-error/selection-error';
import { ShipmentHeaderInputComponent } from '../components/segments/shipment-header/tab/shipment-header-input/shipment-header-input';
import { CostInputContainerComponent } from '../components/segments/cost/cost-input-container/cost-input-container';


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